import { createRouter } from "next-connect";
import controller from "../../../../infra/controller";
import migrator from "../../../../models/migrator";

const router = createRouter();

router.get(getHandler).post(postHandler); //handle cada métodos vai retornar as configurações ( posso colocar, post, delete, patch ...)

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
