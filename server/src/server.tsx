import express from "express";
import cors from "cors";
import * as ReactDOMServer from "react-dom/server";
import React from "react";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import App from "../../client/src/App";

let secret = crypto.randomBytes(32).toString('hex');
console.log(`Using secret: ${secret}`);

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

app.post('/login', (req, res) => {
  console.log(req.body.username);
  const token = jwt.sign({ username: req.body.username }, secret, { algorithm: "HS256", expiresIn: "14 days" });
  res.send({
    jwt: token,
    user: req.body.username
  });
});

app.use(express.static("./client-build"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
