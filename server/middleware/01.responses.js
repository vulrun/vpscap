export default eventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event);

  event.sendResponse = (data, statusCode, statusText) => {
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
