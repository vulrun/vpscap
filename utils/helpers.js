export function $persist(key, value) {
  // set the values
  if (typeof value !== "undefined") {
    if (value === null) {
      localStorage.removeItem(key);
    } else if (typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // get the values
  const stored = localStorage.getItem(key);
  try {
    return JSON.parse(stored);
  } catch (e) {
    return stored;
  }
}

export function changeHref(path) {
  if (window.history.pushState) {
    window.history.pushState({}, "", path);
  }
  return;
}

export function getViewport() {
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
  };
}

export function isWebApp() {
  if (/iPhone|iPad|iPod/i.test(window.navigator?.userAgent)) {
    return "standalone" in window.navigator && window.navigator.standalone;
  }

  return window.matchMedia("(display-mode: standalone)").matches;
}
