import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log("\n Erro dentro do catch do database.js:");
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client?.end(); // Certifique-se de que o cliente seja encerrado mesmo em caso de erro, se existir ele finaliza , se não existir ele não executa essa função
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production" ? true : false, // Pelo docker false -> pelo neon true
    // channelBinding: process.env.PGCHANNELBINDING,
    // pgSslMode: process.env.PGSSLMODE,
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
