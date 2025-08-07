export default eventHandler(async (event) => {
  try {
    return event.cronResponse("yearly cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
