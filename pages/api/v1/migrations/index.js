import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "../../../../infra/controller";

const router = createRouter();

router.get(getHandler).post(postHandler); //handle cada métodos vai retornar as configurações ( posso colocar, post, delete, patch ...)

export default router.handler(controller.errorHandlers);

const defaultMigrationsOptions = {
  dryRun: false,
  dir: resolve(process.cwd(), "infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations", // Nome da tabela onde as migrações serão registradas
};

async function getHandler(request, response) {
  let dbClient = await database.getNewClient();

  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient = await database.getNewClient();

  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
