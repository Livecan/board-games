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

router.route("/:gameId/join").post((req, res) => {
  authenticate(req)
    .then((user) => {
      join(req.params.gameId, user.id)
        .then(() => res.send("Joined the game!"))
        // @todo Figure out if want to do anything about duplicate entries
        // here, currently does not respond here
        .catch((e) => {
          throw e;
        });
    })
    .catch((e) => {
      if (e instanceof AuthenticationFailedError) {
        res.sendStatus(401).send("Authentication failed");
      } else {
        throw e;
      }
    });
});

export default router;
