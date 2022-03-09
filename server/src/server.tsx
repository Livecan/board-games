import express from "express";
import cors from "cors";
import * as ReactDOMServer from "react-dom/server";
import React from "react";
import { authenticate, verifyToken } from "./service/authentication.service";
import formulaRouter from "./route/FormulaGameRoutes";
import App from "../../client/src/App";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const app = ReactDOMServer.renderToString(<App />);
  const html = `
    <html lang="en">
    <head>
      <script src="bundle.min.js" async defer></script>
    </head>
    <body>
      <div id="app">${app}</div>
    </body>
    </html>
  `;
  res.send(html);
});

app.all('*', (req, res, next) => {
  try {
    const jwt = req.headers?.authorization;
    if (jwt != null) {
      req.user = verifyToken(req.headers?.authorization);
    }
    next();
  }
  catch (e) {
    console.error(e);
    res.sendStatus(401).send("Authentication failed")
  }
});

app.post('/login', (req, res) => {
  authenticate(req.body.username, req.body.password)
    .then(token => res.send({jwt: token, user: req.body.username}))
    .catch(error => res.sendStatus(401).send("Authentication failed"));
});

app.use('/formula', formulaRouter);

app.use(express.static("./client-build"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
