import base from '../data/base.json';
import { handle } from './handler';
import type { Environment } from './handler';
import { ChatQuota } from './quota';

export { ChatQuota };
interface Bindings extends Environment { QUOTA: DurableObjectNamespace<ChatQuota> }
export default {
  fetch(request: Request, env: Bindings): Promise<Response> {
    return handle(request, env, base, env.QUOTA.getByName('global-v1'));
  },
};
