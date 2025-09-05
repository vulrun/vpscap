export default eventHandler(async (event) => {
  try {
    Promise.allSettled([
      runCronJobTask("installed_certs_daily_renew"),
      runCronJobTask("monitored_certs_daily_refresh"),
      runCronJobTask("installed_certs_daily_alerts"),
      runCronJobTask("monitored_certs_daily_alerts"),
    ]).then();

    return event.cronResponse("daily cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
