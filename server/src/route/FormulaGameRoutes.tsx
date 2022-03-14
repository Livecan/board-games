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

const setupSubscription = "formula/setup/";

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
router.ws(
  "/:gameId/setup",
  (ws, req: Request & { app: { pubSub: PubSubJS.Base } }) => {
    ws.on("message", async (msg: string) => {
      const data = JSON.parse(msg);
      try {
        await authenticateToken(data.token, req);
        const subscriptionToken = req.app.pubSub.subscribe(
          setupSubscription + req.params.gameId,
          (topic, data) => ws.send(JSON.stringify(data))
        );
        ws.on("close", () => req.app.pubSub.unsubscribe(subscriptionToken));
      } catch (e) {
        ws.close(4000, "Authentication Failed");
        throw e;
      }
    });
  }
);

router.post("/:gameId/setup", [
  (req, res, next) => authenticate(req, res, next),
  (req: Request & { app: { pubSub: PubSubJS.Base } }, res) => {
    // @todo Add the setup adit functionality first
    req.app.pubSub.publish(setupSubscription + req.params.gameId, {
      data: "data",
    });
    res.send(null);
  },
]);

export default router;
