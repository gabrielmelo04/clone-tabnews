function status(request, response) {
  response.status(200).json({ status: "OK", test: "São acima da média" });
}

export default status;
