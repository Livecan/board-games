import express from "express";
import { view } from "../service/game.service";
import { NotFoundError } from "../utils/errors";

const router = express.Router();

router.route('/:gameId')
  .get((req, res) => {
    view(req.params.gameId)
      .then(response => res.send(response))
      .catch(e => {
        if (e instanceof NotFoundError) {
          res.sendStatus(404).send("Game not found");
        }
        else {
          res.sendStatus(500).send();
          throw e;
        }
      });
  });

export default router;
