import { DurableObject } from 'cloudflare:workers';
import type { Admission } from './handler';

const DAY = 86_400_000;
export const DAILY_BUDGET = 8_000_000; // milli-neurons, shared by every Worker instance.

export class ChatQuota extends DurableObject<unknown> {
  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env);
    ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS clients (day INTEGER, client TEXT, total INTEGER, recent TEXT, PRIMARY KEY(day, client));
      CREATE TABLE IF NOT EXISTS budgets (day INTEGER PRIMARY KEY, used INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, day INTEGER, amount INTEGER, settled INTEGER DEFAULT 0);
    `);
  }

  // Keep the boolean RPC compatible with older Worker versions during deployment.
  async admit(client: string): Promise<boolean> {
    return (await this.admitDetailed(client)).allowed;
  }

  async admitDetailed(client: string): Promise<Admission> {
    if (!/^[a-f0-9]{64}$/.test(client)) return { allowed: false, code: 'invalid_request' };
    const now = Date.now();
    const day = Math.floor(now / DAY);
    // Schedule deletion even when traffic stops. No raw IPs or conversations stored.
    if (await this.ctx.storage.getAlarm() === null) await this.ctx.storage.setAlarm((day + 1) * DAY + 60_000);
    return this.ctx.storage.transactionSync(() => {
      const row = this.ctx.storage.sql.exec<{ total: number; recent: string }>('SELECT total, recent FROM clients WHERE day = ? AND client = ?', day, client).toArray()[0];
      const recent: number[] = row ? JSON.parse(row.recent).filter((time: number) => time > now - 60_000) : [];
      if ((row?.total ?? 0) >= 20) return { allowed: false, code: 'daily_limit', retryAfterSeconds: Math.ceil(((day + 1) * DAY - now) / 1000) };
      if (recent.length >= 3) return { allowed: false, code: 'rate_limit', retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + 60_000 - now) / 1000)) };
      recent.push(now);
      this.ctx.storage.sql.exec('INSERT INTO clients VALUES (?, ?, ?, ?) ON CONFLICT(day,client) DO UPDATE SET total = excluded.total, recent = excluded.recent', day, client, (row?.total ?? 0) + 1, JSON.stringify(recent));
      return { allowed: true };
    });
  }

  async reserve(amount: number): Promise<string | null> {
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > DAILY_BUDGET) return null;
    const day = Math.floor(Date.now() / DAY);
    if (await this.ctx.storage.getAlarm() === null) await this.ctx.storage.setAlarm((day + 1) * DAY + 60_000);
    return this.ctx.storage.transactionSync(() => {
      const used = this.ctx.storage.sql.exec<{ used: number }>('SELECT used FROM budgets WHERE day = ?', day).toArray()[0]?.used ?? 0;
      if (used + amount > DAILY_BUDGET) return null;
      const id = crypto.randomUUID();
      this.ctx.storage.sql.exec('INSERT INTO budgets VALUES (?, ?) ON CONFLICT(day) DO UPDATE SET used = excluded.used', day, used + amount);
      this.ctx.storage.sql.exec('INSERT INTO reservations(id, day, amount) VALUES (?, ?, ?)', id, day, amount);
      return id;
    });
  }

  async settle(id: string, actual: number): Promise<void> {
    if (!Number.isSafeInteger(actual) || actual < 0) return;
    this.ctx.storage.transactionSync(() => {
      const row = this.ctx.storage.sql.exec<{ day: number; amount: number; settled: number }>('SELECT day, amount, settled FROM reservations WHERE id = ?', id).toArray()[0];
      if (!row || row.settled) return;
      this.ctx.storage.sql.exec('UPDATE budgets SET used = MAX(0, used + ?) WHERE day = ?', actual - row.amount, row.day);
      this.ctx.storage.sql.exec('UPDATE reservations SET settled = 1 WHERE id = ?', id);
    });
  }

  async alarm(): Promise<void> {
    const day = Math.floor(Date.now() / DAY);
    this.ctx.storage.transactionSync(() => {
      // All data from a completed UTC day expires at the following midnight.
      this.ctx.storage.sql.exec('DELETE FROM clients WHERE day < ?', day);
      this.ctx.storage.sql.exec('DELETE FROM reservations WHERE day < ?', day);
      this.ctx.storage.sql.exec('DELETE FROM budgets WHERE day < ?', day);
    });
    if (this.ctx.storage.sql.exec<{ count: number }>('SELECT count(*) AS count FROM clients').one().count || this.ctx.storage.sql.exec<{ count: number }>('SELECT count(*) AS count FROM budgets').one().count) {
      await this.ctx.storage.setAlarm((day + 1) * DAY + 60_000);
    }
  }
}
