export default eventHandler(async (event) => {
  try {
    return event.cronResponse("monthly cron executed.");
  } catch (err) {
     return event.cronResponse(null, err);
  }
});
