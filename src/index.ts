import express from "express";
// import { PORT } from "@config/minha-config";

const app = express();

app.get("/", (req, resp) => {
  resp.send(`Hello World ${process.env.DB_HOST}: ${process.env.DB_PORT}`);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server runnig on http://localhost:${process.env.SERVER_PORT} 
    environment: ${process.env.ENVIRONMENT}
    database: ${process.env.DB_HOST}`
  );
});
