import express from "express";
import { PORT } from "@config/minha-config";

const app = express();

app.get("/", (req, resp) => {
  resp.send("Hello World");
});

app.listen(PORT, () => {
  console.log(
    `Server runnig on http://localhost:${PORT} in ${process.env.NODE_ENV}`
  );
});
