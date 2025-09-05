export default eventHandler((event) => {
  try {
    runCronJobTask("monitored_certs_hourly_retry").then();

    return event.cronResponse("hourly cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
