import { h } from "vue";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function valueUpdater(updaterOrValue, ref) {
  ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
}

export function hx(type, props, child) {
  if (!props?._children) {
    return h(type, props, child);
  }

  const { _children, ...restProps } = props;
  return h(type, restProps, _children || child);
}
