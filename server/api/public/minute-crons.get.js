export default eventHandler(async (event) => {
  try {
    return event.cronResponse(`minute cron executed.`);
  } catch (err) {
        return event.cronResponse(null, err);
  }
});
