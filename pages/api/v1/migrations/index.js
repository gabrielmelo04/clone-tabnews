import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"), // Caminho para a pasta de migrações para windwos, linux e mac - para não dar erro coloco o join do node path
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations", // Nome da tabela onde as migrações serão registradas
  };

  if (request.method === "GET") {
    const paddingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();
    return response.status(200).json(paddingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end(); // Retorna 405 para métodos não permitidos
}
