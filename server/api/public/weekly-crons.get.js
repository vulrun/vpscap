export default eventHandler(async (event) => {
  try {
    return event.cronResponse("weekly cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
