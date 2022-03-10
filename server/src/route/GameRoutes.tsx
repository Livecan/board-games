import express from "express";
import { authenticate } from "../service/authentication.service";
import { view } from "../service/game.service";
import { NotFoundError } from "../utils/errors";

const router = express.Router();

router.route('/:gameId')
  .get((req, res) => {
    view(parseInt(req.params.gameId))
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

router.route('/:gameId/join')
  .post((req, res) => {
    authenticate(req)
      .then(user => {
        console.log(user);
        res.send(user);
      });
  })

export default router;
