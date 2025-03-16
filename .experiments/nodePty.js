const pty = require("node-pty");

const DEBUGGING = process.env.DEBUGGING === "true";
const path = require("node:path");
const util = require("node:util");
const { exec } = require("node:child_process");
const EventEmitter = require("node:events");
const treeKill = require("tree-kill");
treeKill.promise = function (pid, signal) {
  return new Promise((resolve, reject) => {
    treeKill(pid, signal, (err) => {
      if (err) return reject(err);
      setTimeout(() => resolve(true));
    });
  });
};

class NodeTerminal extends EventEmitter {
  constructor({ shell, execDir, projectPath }) {
    super();
    this.pid = null;
    this.shell = shell;
    this.execDir = execDir || projectPath;
  }

  getPid() {
    return this.pid;
  }

  async start(cmd) {
    DEBUGGING && console.log("🚀 ~ NodeTerminal ~ start ~ cmd:", cmd);
    try {
      cmd = String(cmd || "");
      this._emitter(`data`, cmd);
      if (!cmd) return;

      const term = pty.spawn(this.shell, [], {
        name: "xterm-color",
        cwd: this.execDir ? path.resolve(this.execDir) : process.cwd(),
        env: process.env,
        cols: 80,
        rows: 30,
      });

      if (!term || !term?.pid) {
        this._emitter(`error`, `Process failed to start`);
        return;
      }

      this.pid = term.pid;
      this._emitter(`info`, `Process started with PID: ${term.pid}`);

      term.on("data", (chunk) => this._emitter(`data`, chunk));
      term.on("data", (chunk) => this._emitter(`error`, chunk));
      term.on("close", (code, signal) => {
        this._emitter(`info`, `Process with PID ${term.pid || "--"} closed with code ${code || ""} by signal ${signal || ""}`);
      });
      term.on("exit", (code, signal) => {
        this._emitter(`info`, `Process with PID ${term.pid || "--"} exited with code ${code || ""} by signal ${signal || ""}`);
      });

      // ptyProcess.onData((data) => {
      //   process.stdout.write(data);
      // });

      term.write("a" + cmd);
      // ptyProcess.resize(100, 40);

      return term;
    } catch (error) {
      DEBUGGING && console.error(`big catch: ${error.message}\n`, error);
    }
  }

  async kill(pid) {
    try {
      pid = pid || this.getPid();
      if (!pid) throw new Error("PID is missing");
      DEBUGGING && console.log("🚀 ~ Job ~ killJob ~ pid:", pid);
      // There are some issues using fKill to kill nodejs processes in macOS
      // where the port used by nodejs stays locked where tree-kill working.
      // But using tree-kill has problems killing .NET processes in Windows :(
      // if (process.platform !== "win32") {
      // } else {
      // await fkill(pid, { force: true });
      // }

      await treeKill.promise(pid);
      this._emitter(`info`, `Process killed with PID: ${pid}`);
      return true;
    } catch (error) {
      this._emitter(`error`, `Error killing process: ${pid}.\n ${error.message}`);
      return false;
    }
  }

  _emitter(event, data) {
    console.log(event + " =>\n" + data);
    this.emit(event, data);
  }
}

module.exports = new NodeTerminal({
  shell: process.platform === "win32" ? "powershell.exe" : "bash",
  execDir: process.env.HOME,
});
