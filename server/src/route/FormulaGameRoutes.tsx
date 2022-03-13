import express, { NextFunction, Request, Response } from "express";
import expressWebSocket from "express-ws";
import { users } from "../models/users";
import {
  authenticate,
  authenticateToken,
} from "../service/authentication.service";
import { add, view } from "../service/formulaGame.service";
import { NotFoundError } from "../utils/errors";

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
  // First message contains token. If successfully verified, subscribes to messages.
  ws.on("message", (token: string) =>
    authenticateToken(token, req)
      .then(() => {
        const publisherSubscriber: PubSubJS.Base = req.app.pubSub;
        const topic = req.url;

        const subscriptionToken = publisherSubscriber.subscribe(
          req.url,
          (topic, msg) => ws.send(msg)
        );

        ws.removeAllListeners("message");
        ws.on("message", (msg) => {
          // @todo editSetup
          // @todo getSetup
          // @todo return game setup in following command
          publisherSubscriber.publish(topic, msg);
        });

        ws.on("close", () =>
          publisherSubscriber.unsubscribe(subscriptionToken)
        );
      })
      .catch(() => {
        ws.close(4000, "Authentication Failed");
      })
  );
});

export default router;
