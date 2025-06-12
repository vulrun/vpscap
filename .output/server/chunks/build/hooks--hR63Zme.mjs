import { ref, useSlots } from 'vue';
import { A as defu } from '../nitro/nitro.mjs';
import { n as navigateTo } from './server.mjs';

function useSlotAsText(slotName, useAsHtml) {
  useSlots();
  const html = ref("");
  return html;
}
function useLocalRef(localKey, initialVal) {
  return ref(initialVal);
}
function useApi(api, options) {
  const headers = {};
  headers.Authorization = `Bearer ${localStorage.getItem("WebAppToken") || ""}`;
  return $fetch(api, defu(options || {}, { headers })).catch((error) => {
    var _a, _b;
    if ((error == null ? void 0 : error.status) === 401) {
      localStorage.removeItem("WebAppToken");
      return navigateTo("/login");
    }
    return Promise.reject(new Error(((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a._data) == null ? void 0 : _b.error) || (error == null ? void 0 : error.message)));
  });
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

export { useLocalRef as a, useApi as b, useSlotAsText as c, useApiFetch as u };
//# sourceMappingURL=hooks--hR63Zme.mjs.map
