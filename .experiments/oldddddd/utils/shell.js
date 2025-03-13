const shell = require("child_process");
const shelljs = require("shelljs");
const passwd = process.env.PASSWD_KEY;

module.exports = shelljs;
module.exports.execSync = (cmd) => shell.execSync(cmd, { encoding: "utf8" });
module.exports.sudoExec = (cmd) => {
    return new Promise((resolve, reject) => {
        cmd = passwd ? `echo \"${passwd}\" | sudo -S \"${cmd}\"` : `sudo ${cmd}`;

        shell.exec(cmd, function (error, data) {
            error ? reject(error) : resolve(data);
        });
        return;
    });
};
