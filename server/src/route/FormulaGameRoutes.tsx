import express, { NextFunction, Request, Response } from "express";
import expressWebSocket from "express-ws";
import { users } from "../models/users";
import { authenticate } from "../service/authentication.service";
import { add, view } from "../service/formulaGame.service";
import { NotFoundError } from "../utils/errors";
import { establishWebSocketConnection } from "../utils/webSocketUtils";

const router = express.Router();

// @ts-ignore
expressWebSocket(router);

router.route("/add").post([
  (req, res, next) => authenticate(req, res, next),
  (req: Request & { user: users }, res: Response, next: NextFunction) => {
    add(req.user, req.body.name)
      .then((game) => res.redirect(`${req.baseUrl}/${game.id}`))
      .catch((e) => {
        throw e;
      });
  },
]);

router.route("/:gameId").get((req, res) => {
  view(parseInt(req.params.gameId))
    .then((response) => res.send(response))
    .catch((e) => {
      if (e instanceof NotFoundError) {
        res.sendStatus(404).send("Game not found");
      } else {
        res.sendStatus(500).send();
        throw e;
      }
    });
});

// @ts-ignore
router.ws("/:gameId/setup", (ws, req) => {
  establishWebSocketConnection(
    (req, data, publish) => publish(data),
    (data) => data,
    {
      ws: ws,
      req: req,
      publisherSubscriber: req.app.pubSub,
    }
  );
});

export default router;
