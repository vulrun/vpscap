import { fromAbsolute, toCalendarDate } from "@internationalized/date";

export function getLocale() {
  if (typeof Intl === "undefined") return navigator.language;

  return Intl.DateTimeFormat().resolvedOptions().locale;
}

export function getTimeZone() {
  if (typeof Intl === "undefined") return "Etc/UTC";

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function date2unix(dateValue, type) {
  const date = dateValue instanceof Date ? dateValue : dateValue.toDate(getTimeZone());
  if (type === "start") return Math.floor(date.setHours(0, 0, 0));
  if (type === "end") return Math.floor(date.setHours(23, 59, 59));

  return Math.floor(date.getTime());
}

export function unix2date(unix) {
  if (!unix) return;
  return toCalendarDate(fromAbsolute(unix, getTimeZone()));
}

export function longDate(unix = 0) {
  return new Date(unix).toString().substring(4, 24);
}

export function getRelativeTime(unix1, unix2) {
  const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  const rtf = new Intl.RelativeTimeFormat("en", { style: "short", numeric: "always" });
  const diff = new Date(unix1) - (unix2 || new Date());

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units) {
    if (Math.abs(diff) > units[u] || u == "second") {
      return rtf.format(Math.round(diff / units[u]), u);
    }
  }
  return "---";
}
