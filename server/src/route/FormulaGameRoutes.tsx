import express from "express";
import { authenticate } from "../service/authentication.service";
import { add } from "../service/formulaGame.service";
import { AuthenticationFailedError } from "../utils/errors";

const router = express.Router();

router.route("/add").post((req, res, next) => {
  authenticate(req)
    .then((user) => {
      add(user.id)
        .then((gameId) => res.send({ id: gameId }))
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
