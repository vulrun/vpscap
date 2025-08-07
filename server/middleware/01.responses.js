export default eventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event);

  event.cronResponse = (data, err) => {
    setResponseHeaders(event, { "Content-Type": "text/plain" });
    err ? setResponseStatus(event, 400, "ERROR") : setResponseStatus(event, 200, "OK");

    const errorMessage = err?.message || err?.statusMessage || err?.statusText || "oops, something went wrong";
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    return `[${timestamp}] ${err ? errorMessage : data}\n`;
  };

  event.sendResponse = (data, statusCode, statusText) => {
    setResponseHeaders(event, { "Content-Type": "application/json" });
    setResponseStatus(event, statusCode || 200, cleanStatusText(statusText));
    return JSON.parse(JSON.stringify(data));
  };

  event.errorResponse = (err, statusCode, statusText) => {
    console.error(`[${new Date().toISOString()}] ${event.node.req.method || "GET"} ${getRequestURL(event).pathname}`, "🚀", err);

    const errorMessage = err?.message || err?.statusMessage || err?.statusText || statusText || "oops, something went wrong";
    const statusMessage = err?.statusMessage || err?.statusText || statusText || "OOPS";

    setResponseStatus(event, err?.statusCode || statusCode || 500, cleanStatusText(statusMessage));

    if (runtimeConfig?.appEnv.startsWith("dev")) {
      return {
        error: errorMessage,
        stack: extractStackTrace(err),
      };
    }

    return { error: errorMessage };
  };
});

function extractStackTrace(error) {
  if (!(error instanceof Error)) {
    throw new Error("Input must be an instance of Error");
  }

  if (!error?.stack) return ["Error: No stack trace available"];

  const stackLines = error.stack.split("\n");
  const cleanedStack = stackLines.map((line) => line.trim()).filter((line) => line !== "");

  if (cleanedStack.length === 0) {
    return ["Error: No valid stack trace available"];
  }

  return cleanedStack;
}
