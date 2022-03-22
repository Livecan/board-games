import express, { Request, Response } from "express";
import expressWebSocket from "express-ws";
import { games } from "../../../common/src/models/generated/games";
import {
  authenticate,
  authenticateToken,
} from "../service/authentication.service";
import gameSvc from "../service/game.service";
import formulaSvc from "../service/formulaGame.service";
import { NotFoundError } from "../utils/errors";
import { usersAttributes } from "../../../common/src/models/generated/users";

const router = express.Router();

// @ts-ignore
expressWebSocket(router);

const newGamesSubscription = "game/";

// @todo Rewrite this subscriber to a simpler version,
// as no bi-directional messaging is expected after authentication
router.ws(
  "/",
  (ws, req: Request & { app: { pubSub: PubSubJS.Base; gameWatch: Date } }) => {
    ws.on("message", async (msg: string) => {
      const data = JSON.parse(msg);
      try {
        await authenticateToken(data.token, req);
        const subscriptionToken = req.app.pubSub.subscribe(
          newGamesSubscription,
          (topic, data) => ws.send(JSON.stringify(data))
        );
        ws.send(JSON.stringify(await gameSvc.getNewGames()));
        ws.on("close", () => req.app.pubSub.unsubscribe(subscriptionToken));
      } catch (e) {
        ws.close(4000, "Authentication Failed");
      }
    });

    if (req.app.gameWatch == null) {
      req.app.gameWatch = new Date();
      setInterval(async () => {
        const recentGameModified = await gameSvc.getRecentNewGameModified();
        if (
          req.app.gameWatch == null ||
          req.app.gameWatch < recentGameModified
        ) {
          req.app.gameWatch = recentGameModified;
          req.app.pubSub.publish(
            newGamesSubscription,
            await gameSvc.getNewGames()
          );
        }
      }, 3000);
    }
  }
);

router.route("/:gameId").get((req, res) => {
  gameSvc
    .view(parseInt(req.params.gameId))
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

router.route("/:gameId/join").post([
  (req, res, next) => authenticate(req, res, next),
  (
    req: Request & { params: { gameId: string }; user: usersAttributes },
    res: Response
  ) => {
    const gameId = parseInt(req.params.gameId);
    games.findByPk(gameId).then((game) => {
      switch (game.gameTypeId) {
        // @todo Move hard coded Game Types into const enum - 2 is for Formula game
        case 2:
          formulaSvc.join({ gameId: gameId, userId: req.user.id });
          break;
        default:
          gameSvc.join(gameId, req.user.id);
          break;
      }
      gameSvc.view(gameId).then(game => res.send(game));
    });
  },
]);

export default router;
