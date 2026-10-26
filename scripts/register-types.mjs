// Resolve the project's extensionless TypeScript imports in Node's native TS loader.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (error.code === 'ERR_MODULE_NOT_FOUND' && specifier.startsWith('.') && !/\.(?:[cm]?[jt]s|json)$/i.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});
