export default function TtlCache() {
  const data = new Map();
  const timers = new Map();

  this.has = (k) => data.has(k);
  this.get = (k) => data.get(k);
  this.set = (k, v, ttl = 0) => {
    ttl = String(ttl || "0");
    if (timers.has(k)) clearTimeout(timers.get(k));
    const timer = setTimeout(() => this.delete(k), ms(ttl));
    timers.set(k, timer);
    data.set(k, v);
    return v;
  };
  this.delete = (k) => {
    if (timers.has(k)) clearTimeout(timers.get(k));
    timers.delete(k);
    data.delete(k);
    return;
  };
  this.clear = () => {
    timers.values().forEach(clearTimeout);
    timers.clear();
    data.clear();
    return;
  };

  return this;
}
