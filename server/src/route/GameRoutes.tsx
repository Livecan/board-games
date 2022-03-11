import express from "express";
import { authenticate } from "../service/authentication.service";
import { view, join } from "../service/game.service";
import { AuthenticationFailedError, NotFoundError } from "../utils/errors";

const router = express.Router();

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
