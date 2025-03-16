Vue.mixin({
  data() {
    return {
      // classes
      btn_icon: "w-8 h-8 p-0.25 shrink-0 cursor-pointer shadow text-white bg-gray-500 hover:opacity-60 fill-white flex items-center justify-center transition-all",
      btn_dark: "flex items-center justify-center shrink-0 rounded shadow tracking-wide font-medium text-white bg-gray-3000 hover:bg-gray-500 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none cursor-pointer",
      btn_light: "flex items-center justify-center shrink-0 rounded tracking-wide font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none cursor-pointer",
      btn_outline: `flex items-center justify-center grow shrink-0 rounded shadow trackingwide text-sm font-normal border text-gray-500 border-gray-500 hover:bg-gray-500 hover:bg-gray-500 hover:text-white focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none cursor-pointer`,
      form_label: `mb-1 text-xs text-gray-400`,
      form_field: "min-w-0 flex-auto border-0 rounded shadow-sm text-sm text-gray-900 bg-white focus:bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-gray-400 focus:outline-none appearance-none",
      form_field2: "w-full rounded border border-gray-300 placeholder-gray-500 focus:ring focus:ring-offset-0 focus:ring-gray-600 focus:ring-opacity-50 focus:outline-none appearance-none",
      card_main: `bg-white rounded shadow py-5 px-5`,
      card_heading: `mb-4 font_mont font-bold text-sm text-cyan-800 tracking-wide uppercase`,

      locals: LOCALS,
      icons: feather.icons,
      navs: [
        //
        { href: "/", icon: "cpu", label: "Dashboard" },
        { href: "/certs", icon: "shield", label: "SSL Certificates" },
        { href: "/sites", icon: "rss", label: "Web Sites" },
        { href: "/deploys", icon: "terminal", label: "Deploys" },
        { href: "/actions", icon: "airplay", label: "Actions" },
        { href: "/logout", icon: "power", label: "Logout" },
      ],

      // actions
      actions: [],
      action_response: ``,

      // deploys
      deploys: [],
      deploy_exec: { key: `123`, pid: `` },
      deploy_edit: { key: ``, label: ``, commands: `` },
    };
  },
  computed: {
    is_action_reponse_errored: function () {
      return this.action_response.toString().startsWith("ERROR");
    },
  },
  methods: {
    // helper
    classNames,
    strTruncate,

    _img(src, classes = "", size = 24, alt = "") {
      if (/\<svg/.test(src)) {
        src = `data:image/svg+xml;base64,` + btoa(src);
      }
      return `<img src="${src}" alt="${alt}" class="${classes}" style="padding: 3px; width: ${size}px;" />`;
    },
    _timeAgo(time) {
      console.log("time hit");
      if (!time) return "now";

      time = time < Date.now() ? Date.now() - time : parseInt(time);
      const periods = {
        decade: 1e3 * 60 * 60 * 24 * 30 * 12 * 10,
        year: 1e3 * 60 * 60 * 24 * 30 * 12,
        month: 1e3 * 60 * 60 * 24 * 30,
        week: 1e3 * 60 * 60 * 24 * 7,
        day: 1e3 * 60 * 60 * 24,
        hr: 1e3 * 60 * 60,
        min: 1e3 * 60,
        sec: 1e3 * 1,
      };

      for (let unit in periods) {
        let secs = periods[unit];
        if (time < secs) {
          continue;
        }

        const number = Math.floor(time / secs);
        return `${number} ${unit}${number > 1 ? "s" : ""} ago`;
      }
    },
    _seprateByBulls(texts, strTruncateLength) {
      texts = [...texts];
      return texts
        .map((t) => {
          t = t.replace(/[\r\n]/g, "");
          return strTruncate(t, strTruncateLength);
        })
        .join(`<i class="px-2">&bull;</i>`);
    },

    // app handlers
    isActiveHref(href) {
      return href === window.location.pathname;
    },

    // action handlers
    async onActionClick({ key, onClick }) {
      this.$root.action_response = "please wait...";

      switch (onClick?.type) {
        case "fetch":
          try {
            const resp = await fetch2(onClick?.payload);
            this.$root.action_response = this.parseActRespToHtml(resp);
          } catch (err) {
            this.action_response = `ERROR:\n` + err;
          }
          break;

        case "new_window":
          const href = onClick?.payload?.href;
          if (!href) {
            this.action_response = `ERROR:\ntried opening new tab, but found [${href}]`;
          } else {
            window.open(href, "_blank");
            this.action_response = `opening new tab:\n${href}`;
          }
          break;

        default:
          this.action_response = `ERROR: Invalid Action, please opt for correct one`;
          break;
      }

      await fetch2({
        url: `/action/log_action_click`,
        method: "POST",
        body: { key },
      });
      this.loadActions();
    },
    loadActions() {
      return fetch2({ url: `?format=json` }).then((res) => {
        this.actions = [...res];
      });
    },
    parseActRespToHtml(resp) {
      if (String(resp) === String({})) {
        return JSON.stringify(resp, null, "\t");
      }

      return String(resp).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },

    // deploy handlers
    loadDeploys() {
      return fetch2({ url: `?format=json` }).then((res) => {
        // console.log(res);
        this.deploys = [...res];
      });
    },
    editDeploy(itm) {
      this.$root.deploy_exec = "";
      this.$root.deploy_edit.key = itm?.key || "";
      this.$root.deploy_edit.label = itm?.label || "";
      this.$root.deploy_edit.commands = itm?.commands || "";
    },
    async saveDeploy(key) {
      await fetch2({
        url: `/action/deploy_save`,
        method: "POST",
        body: { ...this.$root.deploy_edit },
      });

      this.$root.editDeploy(null);
      this.$root.loadDeploys();
    },
    async execDeploy(key) {
      this.$root.deploy_exec.key = key || "";

      const { pid } = await fetch2({
        url: `/action/deploy_exec`,
        method: "POST",
        body: { key },
      });

      this.$root.deploy_exec.pid = pid || "";
    },
    async stopDeploy(key) {
      if (this.$root.deploy_exec.key !== key) return;

      window.terminal.sendKill(this.$root.deploy_exec.pid);

      setTimeout(() => {
        window.terminal.prompt();
        this.$root.deploy_exec.pid = "";
      }, 1e3);
    },
  },

  watch: {
    deploy_edit_key() {
      console.log("watch changes:", ...arguments);
    },
  },
});

Vue.component("card", {
  template: `#card`,
  props: ["heading"],
});

Vue.component("action-div", {
  template: "#action-div",
  props: [""],
  beforeMount() {},
});

Vue.component("action-item", {
  template: "#action-item",
  props: ["itm"],
});

Vue.component("deploy-item", {
  template: "#deploy-item",
  props: ["itm", "exec"],
});

const vueApp = new Vue({
  el: "#app",
  created() {
    switch (true) {
      case this.isActiveHref(`/actions`):
        this.loadActions();
        break;

      case this.isActiveHref(`/deploys`):
        this.loadDeploys();
        break;

      default:
        break;
    }
  },
});
