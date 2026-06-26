const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Começa na raiz do projeto
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"], // Permite resolver módulos a partir da raiz do projeto
  testTimeout: 60000, // 60 segundos ele espera para que o teste termine
});

module.exports = jestConfig;
