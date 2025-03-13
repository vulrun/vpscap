import SqlService from "@/server/utils/sqlService";

export default eventHandler(async (event) => {
  const sql = new SqlService(event?.context?.cloudflare?.env.DB);

  return {
    count: await sql.countRows(),
    rows: await sql.selectData(),
  };
});
