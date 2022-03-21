import express from "express";
import cors from "cors";
import * as ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import React from "react";
import expressWebSocket from "express-ws";
import PubSub from "pubsub-js";
import sqlConnection from "./service/db.service";
import { login } from "./service/authentication.service";
import gameRoutes from "./route/GameRoutes";
import formulaRoutes from "./route/FormulaGameRoutes";
import App from "../../client/src/App";
import { AuthenticationFailedError } from "./utils/errors";
import { initModels } from "./models/init-models";
import commonConfig from "../../common/src/config/config";

const app = express();

app.use(cors());

// Transforms request body to JSON
app.use(express.json());

// Puts Publisher-Subscriber in global app, so that requests in imported routes can share messages
// @ts-ignore
app.pubSub = PubSub;

expressWebSocket(app);

// Initializes DB connection making it available when using models in services
initModels(sqlConnection);

app.get(/^\/(?!api|resources).*/, (req, res) => {
  const app = ReactDOMServer.renderToString(<StaticRouter location={req.url}><App /></StaticRouter>);
  const html = `
    <html lang="en">
    <head>
      <script src="/resources/bundle.min.js" async defer></script>
    </head>
    <body>
      <div id="app">${app}</div>
    </body>
    </html>
  `;
  res.send(html);
});

app.post(`/${commonConfig.apiBaseUrl}login`, (req, res) => {
  login(req.body.username, req.body.password)
    .then((token) => res.send({ jwt: token, user: req.body.username }))
    .catch((e) => {
      if (e instanceof AuthenticationFailedError) {
        res.sendStatus(401).send("Authentication failed");
      } else {
        res.sendStatus(500).send();
        throw e;
      }
    });
});

app.use(`/${commonConfig.apiBaseUrl}game`, gameRoutes);
app.use(`/${commonConfig.apiBaseUrl}formula`, formulaRoutes);

app.use('/resources', express.static("./client-build"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
