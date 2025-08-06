import { createApp, h, ref, watch, useSlots } from "vue";
import { defu } from "defu";

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
  const storedValue = window.localStorage.getItem(localKey);
  if (!storedValue) window.localStorage.setItem(localKey, JSON.stringify(initialVal));

  // set the initial value
  const val = ref(storedValue ? JSON.parse(storedValue) : initialVal);

  // watch and update local storage when it changes
  watch(val, (newValue) => {
    window.localStorage.setItem(localKey, JSON.stringify(newValue));
  });

  return val;
}

export function useApi(api, options) {
  const headers = {};
  headers.Authorization = `Bearer ${localStorage.getItem("WebAppToken") || ""}`;

  return $fetch(api, defu(options || {}, { headers })).catch((error) => {
    if (error?.status === 401) {
      localStorage.removeItem("WebAppToken");
      return navigateTo("/login");
    }

    return Promise.reject(new Error(error?.response?._data?.error || error?.message));
  });
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
