import shelljs from "shelljs";
import childProcess from "node:child_process";

export default shelljs;

export function shellExec1(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      return resolve(stdout);
    });
  });
}

export function shellExec(command) {
  return new Promise((resolve, reject) => {
    shelljs.exec(command, { silent: true }, (exitCode, stdout, stderr) => {
      if (exitCode && exitCode !== 1) return reject(new Error(`EXITCODE: ${exitCode}`));
      if (stderr) return reject(stderr);
      return resolve(stdout);
    });
  });
}

export function sudoExec(command) {
  // process.env.PASSWD_KEY = "4123";
  // console.log("🚀 ~ PASSWD_KEY:", process?.env?.PASSWD_KEY);
  command = process?.env?.PASSWD_KEY ? `echo \"${process?.env?.PASSWD_KEY}\" | sudo -S ${command}` : `sudo ${command}`;

  return shellExec(command);
}

export function isInstalled(pkgName) {
  try {
    return shellExec(`which ${pkgName}`);
  } catch (error) {
    return null;
  }
}
