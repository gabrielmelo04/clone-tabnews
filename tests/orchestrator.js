import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, { retries: 100, maxTimeout: 10000 }); // retries -> quantidade de tentativas, 100 -> 100 tentativas

    async function fetchStatusPage(bail, tryNumber) {
      // bail -> se o erro for diferente de 200, cancela a tentativa tryNumber -> número da tentativa
      console.log(`Trying to connect to web server... (${tryNumber})`);
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
