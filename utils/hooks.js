import { createApp, h, ref, watch, useSlots } from "vue";
import { defu } from "defu";

export function consoleLog() {
  if (!import.meta.env.DEV) return;
  console.log.apply(this, arguments);
}

export function useSlotAsText(slotName, useAsHtml) {
  const slots = useSlots();
  const html = ref("");

  onMounted(() => {
    const slot = slots[slotName || "default"];
    if (!slot) return;

    const container = document.createElement("div");
    const app = createApp({
      render() {
        return h("div", slot());
      },
    });
    app.mount(container);
    html.value = useAsHtml ? container.innerHTML : container.innerText;
    app.unmount();
  });

  return html;
}

export function useLocalRef(localKey, initialVal) {
  if (typeof window === "undefined") return ref(initialVal);

  // retrieve from local storage and save initial value
  const storedValue = $persist(localKey);
  if (!storedValue) $persist(localKey, initialVal);

  // set the initial value
  const val = ref(storedValue || initialVal);

  // watch and update local storage when it changes
  watch(val, (newValue) => $persist(localKey, newValue));
  return val;
}

export function useApi(url, _options) {
  try {
    if (import.meta.server) {
      throw new Error("useAPI must be used on the client side only.");
    }

    const WebAppToken = $persist("WebAppToken") || "";
    if (!WebAppToken) throw new Error("NO_LOGIN_TOKEN");

    const headers = { Authorization: `Bearer ${WebAppToken}` };
    const options = defu(_options, { headers });

    return $fetch(url, options).catch((err) => {
      consoleLog("🚀 ~ useAPI ~ err.response:", err);

      if (err?.status === 401) {
        $persist("WebAppData", null);
        $persist("WebAppToken", null);
        return navigateTo("/login");
      }
      if (err?.data?.statusMessage) {
        return toast(err?.data?.statusMessage);
      }

      consoleLog("🚀 ~ useAPI ~ err.response.data:", err.response?._data);

      if (err.response) {
        return Promise.reject(new Error(err.response?._data?.error));
      }

      return Promise.reject(err);
    });
  } catch (_err) {
    return Promise.reject(_err);
  }
}

export function useApiFetch(url, options) {
  const error = ref(null);
  const result = ref(null);
  const reload = ref(() => null);
  const isLoading = ref(true);

  reload.value = async () => {
    try {
      isLoading.value = true;

      result.value = await useApi(url, options);
      isLoading.value = false;
    } catch (error) {
      error.value = error;
      isLoading.value = false;
      return Promise.reject(error);
    }
  };

  onMounted(() => reload.value());

  return { error, result, reload, isLoading };
}
