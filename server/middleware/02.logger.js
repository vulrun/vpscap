import { defineEventHandler, getRequestURL, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const url = getRequestURL(event).pathname;
  const method = event.node.req.method || "GET";

  // Execute the next handler
  await event.node.res.on("finish", () => {
    const status = event.node.res.statusCode || 200;
    const duration = Date.now() - startTime;

    // Log request details
    logRequest(method, url, status, duration);
  });

  // Optional: Add response header for request timing
  setResponseHeader(event, "X-Response-Time", `${Date.now() - startTime}ms`);
});
