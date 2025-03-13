import SqlBricks from "sql-bricks";
import mysql from "mysql2/promise";

const pool = mysql.createPool(process?.env?.NUXT_MYSQL_URL);
const SQL_TABLE_NAME = "shortener";
const SQL_COLUMNS = "url, slug, hash, comment, createdAt, updatedAt, expiration";

const SQL = SqlBricks._extension();
SQL.select.prototype.execute =
  SQL.insert.prototype.execute =
  SQL.update.prototype.execute =
  SQL.delete.prototype.execute =
    async function (...args) {
      const connection = await pool.getConnection();
      try {
        const query = this.toString() + " " + (args ? args.join(" ") : "");

        console.log("🚀 ~ sqlQuery ~ :", query);
        const [rows] = await connection.execute(query);
        return rows;
      } finally {
        connection.release();
      }
    };

export async function sqlQuery(query, params) {
  if (String(query) === String({}) && typeof query?.text === "string" && Array.isArray(query?.values)) {
    params = query?.values;
    query = query?.text;
  }

  const connection = await pool.getConnection();
  try {
    // console.log("🚀 ~ sqlQuery ~ :", String(query), params || []);
    const [rows] = await connection.execute(String(query), params || []);
    return rows;
  } finally {
    connection.release();
  }
}

export function useSqlHelper() {
  return {
    createTable,
    countRows,
    selectOne,
    selectData,
    insertData,
    updateData,
    deleteData,
  };
}

// todo: update isDeleted status based on expiration, otherwise need to remove the unique indexing
// helper sub-functions
function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS ${SQL_TABLE_NAME} (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(2048) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      hash CHAR(64) NOT NULL,
      comment TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      expiration TIMESTAMP NULL,
      isDeleted BOOLEAN DEFAULT FALSE NOT NULL,
      INDEX (slug),
      INDEX (hash)
    );
  `;

  return sqlQuery(query)
    .then((res) => console.log(`Table '${SQL_TABLE_NAME}' is created`))
    .catch((err) => {
      if (/already\sexists/.test(err?.message)) console.log(err?.message);
      else console.error("Error creating table:", err?.message);
    });
}

function countRows() {
  return SQL.select("COUNT(slug)")
    .from(SQL_TABLE_NAME)
    .where({ isDeleted: false })
    .and(SQL.or({ expiration: null }, SQL.gte("expiration", toMysqlTimestamp("now"))))
    .execute()
    .then((rows) => +rows?.[0]?.["COUNT(slug)"]);
}

function selectOne() {
  return selectData(...arguments).then((rows) => rows?.[0]);
}

function selectData(where, options) {
  return SQL.select(SQL_COLUMNS)
    .from(SQL_TABLE_NAME)
    .where({ ...where, isDeleted: false })
    .and(SQL.or({ expiration: null }, SQL.gte("expiration", toMysqlTimestamp("now"))))
    .orderBy(options?.orderBy || "id")
    .execute(
      //
      options?.limit ? `LIMIT ${+options?.limit}` : undefined,
      options?.offset ? `OFFSET ${+options?.offset}` : undefined
    )
    .then((rows) => {
      if (!Array.isArray(rows)) return [];
      if (rows.length <= 0) return [];

      return rows.map((row) => makeJsCompatible(row));
    });
}

function insertData(data) {
  return SQL.insert(SQL_TABLE_NAME, makeSqlCompatible(data)).execute();
}

function updateData(data, where) {
  return SQL.update(SQL_TABLE_NAME, makeSqlCompatible(data)).where(where).execute();
}

function deleteData(where) {
  return SQL.delete().from(SQL_TABLE_NAME).where(where).execute();
}

function makeSqlCompatible(data) {
  if (!data) return null;
  if (data?.createdAt) data.createdAt = toMysqlTimestamp(data.createdAt);
  if (data?.updatedAt) data.updatedAt = toMysqlTimestamp(data.updatedAt);
  if (data?.expiration) data.expiration = toMysqlTimestamp(data.expiration);
  else data.expiration = null;

  return data;
}

function makeJsCompatible(data) {
  if (!data) return null;
  if (data?.createdAt) data.createdAt = new Date(data.createdAt).valueOf();
  if (data?.updatedAt) data.updatedAt = new Date(data.updatedAt).valueOf();
  if (data?.expiration) data.expiration = new Date(data.expiration).valueOf();
  else data.expiration = null;

  return data;
}
