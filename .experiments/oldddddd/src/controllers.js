const _ = require("lodash");
const os = require("node:os");
const fs = require("node:fs");
fs.path = require("node:path");
const shell = require("../utils/shell");
const print = require("../utils/print");
const termy = require("../utils/nodeTermy");
const AuthService = require("./AuthService");
const Services = require("./services");
const Functions = require("jstub/functions");
const { TtlCache: cache } = require("jstub/utils/cache");
const { Deta } = require("deta");
const deta = Deta(process.env.DETA_PROJECT_KEY);

const basePath = "/";
const confPath = process.env.NGINX_CONF_DIR;

const adminLogins = {
  // admin: "1234",
  mercury: "Mercury@08",
  goosebox: "LetMeInN0w",
};

module.exports = {
  ping,
  debug,
  login,
  logout,
  loginHandler,
  vpsHandler,
  ejsIndex,
  ejsCerts,
  ejsSites,
  ejsSiteModify,
  ejsDeploys,
  ejsActions,
};

async function ping(req, res, next) {
  try {
    return res.end("pong");
  } catch (error) {
    next(error);
  }
}

async function debug(req, res, next) {
  try {
    return res.render("debug", { layout: "_admin" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    return res.render("login", { layout: "_plain" });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.cookie("CONNID", "", { maxAge: 0 });
    res.openPage("/", null, "Logged Out");
    return;
  } catch (err) {
    next(err);
  }
}

async function loginHandler(req, res, next) {
  try {
    const user = req.body.username || "";
    const pass = req.body.password || "";
    if (adminLogins[user] === pass) {
      const token = AuthService.getToken({ login: user });
      res.cookie("CONNID", token, { httpOnly: true });
    }
    return res.openPage("/", null, "Logged In");
  } catch (error) {
    next(error);
  }
}

async function vpsHandler(req, res, next) {
  try {
    switch (req.params?.action || req.body.action) {
      case "new_site":
        await Services.sites.new(req.body);
        return res.openPage("/sites", null, "Site Added Successfully");

      case "edit_site":
        await Services.sites.edit(req.body?.id, req.body);
        return res.openPage("/sites", null, "Site Configuration Updated");

      case "enable_site":
        await Services.sites.enable(req.body?.id);
        return res.openPage("/sites", null, "Site Enabled Successfully");

      case "disable_site":
        await Services.sites.disable(req.body?.id);
        return res.openPage("/sites", null, "Site Disabled Successfully");

      case "delete_site":
        await Services.sites.delete(req.body?.id);
        return res.openPage("/sites", null, "Site moved to bin");

      case "rebuild_sites":
        await Services.sites.rebuild();
        return res.openPage("/sites", null, "All Nginx Configuration Rebuilt");

      case "install_ssl":
        await Services.certs.install(req.body?.domain);
        return res.openPage("/certs", null, `SSL installed for [${req.body?.domain}]`);

      case "delete_ssl":
        await Services.certs.delete(req.body?.domain);
        return res.openPage("/certs", null, `SSL deleted for [${req.body?.domain}]`);

      case "restart_nginx":
        await shell.sudoExec(`systemctl restart nginx`);
        cache.set("pending_update_count", 0);
        return res.openPage("/sites", null, `NGINX restarted`);

      case "log_action_click":
        await deta.Base("su_actions").update({ lastClickedAt: Date.now() }, req.body?.key);
        return res.end("ok");

      case "deploy_save":
        await deta.Base("vps_deploys").update(
          {
            lastUpdatedAt: Date.now(),
            label: req.body?.label || req.body?.key,
            commands: req.body?.commands || "",
          },
          req.body?.key
        );
        return res.end("ok");

      case "deploy_exec":
        deta
          .Base("vps_deploys")
          .update(
            {
              lastExecutedAt: Date.now(),
            },
            req.body?.key
          )
          .then();
        const item = await deta.Base("vps_deploys").get(req.body?.key);
        await termy.start(item.commands);

        return res.json({
          key: req.body?.key,
          pid: termy.getPid(),
        });

      default:
        return res.openPage("/debug", `Invalid Action`);
    }
  } catch (error) {
    console.error(error);
    return res.openPage("/debug", error?.message || error);
  }
}

async function ejsIndex(req, res, next) {
  try {
    const data = {};
    const [Hostname, FQDNs, Public_IP, Private_IP1, Private_IP2] = await Promise.all([
      //
      shell.execSync("hostname"),
      shell.execSync("hostname -A"),
      process.env.NODE_ENV.startsWith("dev") ? shell.execSync("hostname -i") : shell.execSync("wget -qO- https://api.ipify.org"),
      shell.execSync("hostname -i"),
      shell.execSync("hostname -I"),
    ]);

    data.server = {
      Hostname,
      FQDNs: _.uniq([...FQDNs.split(" ")].filter(Boolean)).join(" "),
      Public_IP,
      Private_IP: _.uniq([...Private_IP1.split(" "), ...Private_IP2.split(" ")].filter(Boolean)).join(" "),
    };

    const distro = print.parse(shell.cat("/etc/*release"));
    data.system = {
      // Virtualization: os.type(),
      Architecture: os.arch(),
      Kernel: os.type() + " " + os.release(),
      Operating_System: distro.NAME + " " + distro.VERSION,
      Temp_Directory: os.tmpdir(),
      // arch: os.arch(),
      // constants: os.constants,
      // cpus: JSON.stringify(os.cpus()),
      // endianness: os.endianness(),
      // freemem: os.freemem(),
      // homedir: os.homedir(),
      // hostname: os.hostname(),
      // loadavg: os.loadavg(),
      // networkInterfaces: os.networkInterfaces(),
      // platform: os.platform(),
      // release: os.release(),
      // tmpdir: os.tmpdir(),
      // totalmem: os.totalmem(),
      // type: os.type(),
      // uptime: os.uptime(),
      // userInfo: JSON.stringify(os.userInfo()),
      // version: os.version(),
    };

    data.memory = {};
    data.memory.raw = await shell.execSync("free -hltw");
    data.memory.html = print.tabular(data.memory.raw);

    data.diskFiles = {};
    data.diskFiles.raw = await shell.execSync("df -h --total");
    data.diskFiles.html = print.tabular(data.diskFiles.raw);

    data.pageTitle = "Dashboard";
    return res.render("pages/index", data);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

async function ejsCerts(req, res, next) {
  try {
    // if (!shell.which("certbot")) throw "Please install [certbot] to use ssls";

    if (req.query.format === "json") {
      const data = await Services.certs.list({ includeSuggestions: true });

      return res.json({ data });
    }
    return res.render("pages/certs", { pageTitle: "SSL Certificates" });
  } catch (error) {
    console.error(error);
    res.openPage("/certs", error?.message || error);
  }
  return;
}

async function ejsSites(req, res, next) {
  try {
    if (!shell.test("-d", confPath)) throw "Invalid Path";

    if (req.query.format === "json") {
      const data = await Services.sites.list();
      return res.json({ data });
    }
    res.render("pages/sites", {
      pageTitle: "Sites",
      pending_update_count: cache.get("pending_update_count") || 0,
    });
  } catch (error) {
    console.error(error);
    res.openPage("/sites", error?.message || error);
  }
  return;
}

async function ejsSiteModify(req, res, next) {
  try {
    const { action, config } = await Services.sites.find(req.params.id);

    return res.render("pages/sites-edit", {
      pageTitle: config?.fileName,
      id: req.params?.id,
      action,
      config,
    });
  } catch (error) {
    return next(error);
  }
}

async function ejsDeploys(req, res, next) {
  try {
    if (req.query.format === "json") {
      const db = deta.Base("vps_deploys");
      const query = [];
      let result = await db.fetch(query);
      let items = result?.items;
      let last = result?.last;

      while (last) {
        result = await db.fetch(query, { last: result?.last });
        items = actions.concat(result?.items);
        last = result?.last;
      }

      return res.json(items);
    }

    res.render("pages/deploys", { pageTitle: "VPS Deploys" });
  } catch (error) {
    console.error(error);
    res.openPage("/deploys", error?.message || error);
  }
}

async function ejsActions(req, res, next) {
  try {
    if (req.query.format === "json") {
      const db = deta.Base("su_actions");
      const query = [];
      let result = await db.fetch(query);
      let items = result?.items;
      let last = result?.last;

      while (last) {
        result = await db.fetch(query, { last: result?.last });
        items = actions.concat(result?.items);
        last = result?.last;
      }

      return res.json(items);
    }

    res.render("pages/actions", { pageTitle: "Super Actions" });
  } catch (error) {
    console.error(error);
    res.openPage("/actions", error?.message || error);
  }
}
