import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  let dbClient = await database.getNewClient();

  try {
    const defaultMigrationsOptions = {
      dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"), // Caminho para a pasta de migrações para windwos, linux e mac - para não dar erro coloco o join do node path
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations", // Nome da tabela onde as migrações serão registradas
    };

    if (request.method === "GET") {
      const paddingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(paddingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw Error("Error running migrations");
  } finally {
    await dbClient.end();
  }
}
