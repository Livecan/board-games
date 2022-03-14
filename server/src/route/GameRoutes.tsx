import express from "express";
import expressWebSocket from "express-ws";
import { authenticate } from "../service/authentication.service";
import {
  view,
  join,
  getRecentNewGameModified,
  getNewGames,
} from "../service/game.service";
import { NotFoundError } from "../utils/errors";
import { establishWebSocketConnection } from "../utils/webSocketUtils";

const router = express.Router();

// @ts-ignore
expressWebSocket(router);

// @ts-ignore
router.ws("/", (ws, req) => {
  establishWebSocketConnection(
    async (req, data, publish) => {
      // Need to start one instance of game watch. Game watch sends the list of
      // games to the client when a new game is created or updated.
      if (req.app.gameWatch == null) {
        req.app.gameWatch = { state: "started" };
        // @todo Do I want to run this forever or do I want to keep the value
        // of interval and when no subscribers, stop?
        setInterval(async () => {
          const recentGameModified = await getRecentNewGameModified();
          if (
            req.app.gameWatch.recentGameModified == null ||
            req.app.gameWatch.recentGameModified < recentGameModified
          ) {
            req.app.gameWatch.recentGameModified = recentGameModified;
            publish(await getNewGames());
          }
        }, 1000);
      }
      // When client subscribes to gameWatch, he only receives updates. This
      // list is therefore sent automatically during initiation of Socket.
      ws.send(JSON.stringify(await getNewGames()));
    },
    // the data published by the gameWatch are sent straight to clients
    (data) => data,
    { ws: ws, req: req, publisherSubscriber: req.app.pubSub }
  );
});

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

router.route("/:gameId/join").post([
  (req, res, next) => authenticate(req, res, next),
  (req, res) => {
    join(req.params.gameId, req.user.id)
      .then((game) => res.send(game))
      .catch((e) => {
        throw e;
      });
  },
]);

export default router;
