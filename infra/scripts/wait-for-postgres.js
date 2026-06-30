// Executar comandos dentro de um scripts é necessário usar o módulo child_process do Node.js. Abaixo está um exemplo de como você pode implementar a função `checkPostgres` para verificar se o PostgreSQL está aceitando conexões:
const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn); // o docker exec postgres-dev pg_isready é o comando que verifica se o Postgres está pronto para aceitar conexões. O nome do container deve ser o mesmo definido no arquivo infra/compose.yaml. Passar a opção do TCP está pronta -> --host localhost(pode ser outro)

  function handleReturn(error, stdout) {
    // error, stdout, stderr -> são os parametros que o exec retorna
    // stdout -> usado para saida padrão do comando, stderr -> usado para saída de erro do comando
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres(); // Recursividade para sempre que der erro, tentar novamente
      return;
    }

    console.log("\n🟢 Postgres está pronto e aceitando conexões");
  }
}

process.stdout.write("\n\n🟡 Aguardando Postgres aceitar conexões");
checkPostgres();

//docker system prune -a -> remove todos os containers, imagens e volumes não utilizados. Use com cuidado, pois pode resultar na perda de dados se houver volumes não montados ou containers em execução.
