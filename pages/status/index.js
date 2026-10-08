import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key); // key -> vai ser a URL "/api/v1/status" que foi passada para o useSWR
  const responseBody = await response.json();
  return responseBody;
}

// A patir desse componente quero que renderize a página
export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  //const response = useSWR("status", fetchStatus);
  const { data, error } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000, // Atualiza a cada 5 segundos
    dedupingInterval: 2000, // Evita chamadas duplicadas em um intervalo de 1 segundo, por padrão vem 2000ms, mas como o refreshInterval é menor que o dedupingInterval, ele não vai fazer chamadas duplicadas
  }); // {data, isLoading, error}

  if (error) {
    return <div>Failed to load status</div>;
  }

  if (!data) {
    return <div>Carregando...</div>;
  }

  // JSON.stringify(data, null, 2) é usado para formatar o objeto data em uma string JSON legível, com indentação de 2 espaços. Isso facilita a visualização dos dados no navegador.
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
