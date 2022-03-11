import express, { NextFunction, Request, Response } from "express";
import { users } from "../models/users";
import { authenticate } from "../service/authentication.service";
import { add, view } from "../service/formulaGame.service";
import { NotFoundError } from "../utils/errors";

const router = express.Router();

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

export default router;
