import express, { Request, Response } from "express";
import expressWebSocket from "express-ws";
import { games } from "../models/games";
import { authenticate } from "../service/authentication.service";
import gameSvc from "../service/game.service";
import formulaSvc from "../service/formulaGame.service";
import { NotFoundError } from "../utils/errors";
import { establishWebSocketConnection } from "../utils/webSocketUtils";
import { usersAttributes } from "../models/users";

const router = express.Router();

// @ts-ignore
expressWebSocket(router);

// @todo Rewrite this subscriber to a simpler version,
// as no bi-directional messaging is expected after authentication
router.ws("/", (ws, req) => {
  // @todo rewrite this in simpler fashion, see FormulaGameRoutes->getGameSubscriptionRoute
  establishWebSocketConnection(
    async (req, data, publish) => {
      // Need to start one instance of game watch. Game watch sends the list of
      // games to the client when a new game is created or updated.
      if (req.app.gameWatch == null) {
        req.app.gameWatch = { state: "started" };
        // @todo Do I want to run this forever or do I want to keep the value
        // of interval and when no subscribers, stop?
        setInterval(async () => {
          const recentGameModified = await gameSvc.getRecentNewGameModified();
          if (
            req.app.gameWatch.recentGameModified == null ||
            req.app.gameWatch.recentGameModified < recentGameModified
          ) {
            req.app.gameWatch.recentGameModified = recentGameModified;
            publish(await gameSvc.getNewGames());
          }
        }, 1000);
      }
      // When client subscribes to gameWatch, he only receives updates. This
      // list is therefore sent automatically during initiation of Socket.
      ws.send(JSON.stringify(await gameSvc.getNewGames()));
    },
    // the data published by the gameWatch are sent straight to clients
    (data) => data,
    { ws: ws, req: req, publisherSubscriber: req.app.pubSub }
  );
});

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
      res.send(gameSvc.view(gameId));
    });
  },
]);

export default router;
