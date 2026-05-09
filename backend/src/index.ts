import { createApp } from "./server.js";

const port = Number(process.env.PORT ?? 8080);
const app = createApp();

app.listen(port, () => {
  console.log(`AskMaps backend listening on http://localhost:${port}`);
});
