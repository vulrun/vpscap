import { e as eventHandler, c as runCronJobTask } from '../../../nitro/nitro.mjs';
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

const dailyCrons_get = eventHandler(async (event) => {
  try {
    Promise.allSettled([
      runCronJobTask("installed_certs_daily_renew"),
      runCronJobTask("monitored_certs_daily_refresh"),
      runCronJobTask("installed_certs_daily_alerts"),
      runCronJobTask("monitored_certs_daily_alerts")
    ]).then();
    return event.cronResponse("daily cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});

export { dailyCrons_get as default };
//# sourceMappingURL=daily-crons.get.mjs.map
