import database from "../../../../infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersion = await database.query("SHOW server_version;");
  // console.log("Database version:", databaseVersion.rows[0].server_version);

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;
  // console.log("Database max connections:", databaseMaxConnectionsValue);

  const databaseName = process.env.POSTGRES_DB; // Substitua pelo nome do seu banco de dados
  const databaseOpenConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenConnectionsValue =
    databaseOpenConnectionsResult.rows[0].count;
  // console.log(
  //   "Database open connections:",
  //   databaseOpenConnectionsResult.rows.length,
  // );

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: parseInt(databaseMaxConnectionsValue),
        open_connections: databaseOpenConnectionsValue,
      },
    },
  });
}

export default status;
