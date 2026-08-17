import { e as eventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs-extra';
import 'axios';
import 'html-minifier-terser';
import 'nodemailer';
import 'handlebars';
import 'lodash';
import 'shelljs';
import 'node:net';
import 'node:util';
import 'node:child_process';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';

const weeklyCrons_get = eventHandler(async (event) => {
  try {
    return event.cronResponse("weekly cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});

export { weeklyCrons_get as default };
//# sourceMappingURL=weekly-crons.get.mjs.map
