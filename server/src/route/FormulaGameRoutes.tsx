import express from "express";
import { authenticate } from "../service/authentication.service";
import { add } from "../service/formulaGame.service";
import { AuthenticationFailedError } from "../utils/errors";

const router = express.Router();

router.route("/add").post([
  (req, res, next) => authenticate(req, res, next),
  (req, res, next) => {
    add(req.user.id)
      .then((game) => res.send(game))
      // @todo Figure out if want to do anything about duplicate entries
      // here, currently does not respond here
      .catch((e) => {
        throw e;
      });
  },
]);

export default router;
