import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
})

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString(); // Verifica se é uma data válida
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt); // Verifica se a data retornada é a mesma que foi gerada

  expect(responseBody.dependencies.database.version).toEqual("16.0"); // Verifica se a versão do banco de dados é a esperada
  expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(0); // Verifica se o número de conexões máximas é um valor positivo
  expect(responseBody.dependencies.database.max_connections).toEqual(100); // Verifica se o número de conexões máximas é 100
  expect(responseBody.dependencies.database.open_connections).toEqual(1); // Verifica se o número de conexões abertas é 1
});
