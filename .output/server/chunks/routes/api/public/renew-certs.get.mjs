import { e as eventHandler, W as WebSites } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'envfile';
import 'ms';
import 'axios';
import 'fs-extra';
import 'node:dns/promises';
import 'lodash';
import 'shelljs';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';

const site = new WebSites();
const renewCerts_get = eventHandler(async (event) => {
  try {
    const result = await site.renewCerts();
    return event.sendResponse(result);
  } catch (err) {
    console.log("\u{1F680} ~ eventHandler ~ err:", err);
    return event.errorResponse(err);
  }
});

export { renewCerts_get as default };
//# sourceMappingURL=renew-certs.get.mjs.map
