import { ref, useSlots } from 'vue';
import { H as defu } from '../nitro/nitro.mjs';
import { n as navigateTo } from './server.mjs';
import { toast } from 'vue-sonner';

function $persist(key, value) {
  if (typeof value !== "undefined") {
    if (value === null) {
      localStorage.removeItem(key);
    } else if (typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
  const stored = localStorage.getItem(key);
  try {
    return JSON.parse(stored);
  } catch (e) {
    return stored;
  }
}
function consoleLog() {
  return;
}
function useSlotAsText(slotName, useAsHtml) {
  useSlots();
  const html = ref("");
  return html;
}
function useLocalRef(localKey, initialVal) {
  return ref(initialVal);
}
function useApi(url, _options) {
  try {
    if (true) {
      throw new Error("useAPI must be used on the client side only.");
    }
    const WebAppToken = $persist("WebAppToken") || "";
    if (!WebAppToken) throw new Error("NO_LOGIN_TOKEN");
    const headers = { Authorization: `Bearer ${WebAppToken}` };
    const options = defu(_options, { headers });
    return $fetch(url, options).catch((err) => {
      var _a, _b, _c, _d, _e;
      consoleLog("\u{1F680} ~ useAPI ~ err.response:", err);
      if ((err == null ? void 0 : err.status) === 401) {
        $persist("WebAppData", null);
        $persist("WebAppToken", null);
        return navigateTo("/login");
      }
      if ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.statusMessage) {
        return toast((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.statusMessage);
      }
      consoleLog("\u{1F680} ~ useAPI ~ err.response.data:", (_c = err.response) == null ? void 0 : _c._data);
      if (err.response) {
        return Promise.reject(new Error((_e = (_d = err.response) == null ? void 0 : _d._data) == null ? void 0 : _e.error));
      }
      return Promise.reject(err);
    });
  } catch (_err) {
    return Promise.reject(_err);
  }
}
function useApiFetch(url, options) {
  const error = ref(null);
  const result = ref(null);
  const reload = ref(() => null);
  const isLoading = ref(true);
  reload.value = async () => {
    try {
      isLoading.value = true;
      result.value = await useApi(url, options);
      isLoading.value = false;
    } catch (error2) {
      error2.value = error2;
      isLoading.value = false;
      return Promise.reject(error2);
    }
  };
  return { error, result, reload, isLoading };
}

export { $persist as $, useLocalRef as a, useApi as b, useSlotAsText as c, useApiFetch as u };
//# sourceMappingURL=hooks-CHj_C_Hn.mjs.map
