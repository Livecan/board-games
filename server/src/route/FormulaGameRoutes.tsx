import express, { NextFunction, Request, Response } from "express";
import expressWebSocket from "express-ws";
import { games } from "../models/games";
import { foCars } from "../models/foCars";
import { users } from "../models/users";
import {
  authenticate,
  authenticateToken,
} from "../service/authentication.service";
import {
  add,
  editCarSetup,
  editGameSetup,
  getGameSetup,
  view,
} from "../service/formulaGame.service";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

// @todo Move to constants enum, see the hard-coded value in GameRoutes.tsx
const newGameStateId = 1;

const router = express.Router();

// @ts-ignore
expressWebSocket(router);

const setupSubscription = "formula/setup/";

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

// @ts-ignore
router.ws(
  "/:gameId/setup",
  (ws, req: Request & { app: { pubSub: PubSubJS.Base } }) => {
    ws.on("message", async (msg: string) => {
      const data = JSON.parse(msg);
      try {
        await authenticateToken(data.token, req);
        const subscriptionToken = req.app.pubSub.subscribe(
          setupSubscription + req.params.gameId,
          (topic, data) => ws.send(JSON.stringify(data))
        );
        ws.on("close", () => req.app.pubSub.unsubscribe(subscriptionToken));
      } catch (e) {
        ws.close(4000, "Authentication Failed");
        throw e;
      }
    });
  }
);

// @todo Move this to utils and use elsewhere too as needed
const authorize = async (
  req: Request,
  res: Response,
  auth: (req: Request) => Promise<Boolean>
): Promise<void> => {
  if (!(await auth(req))) {
    res.sendStatus(UnauthorizedError.code).send(UnauthorizedError.message);
    throw new UnauthorizedError();
  }
};

const canEditSetup = async (req: Request): Promise<Boolean> => {
  const game = await games.findByPk(req.params.gameId);
  if (game.gameStateId != newGameStateId) {
    return false;
  }
  const isCreator = game.creatorId == req.user.id;
  if (isCreator) {
    return true;
  }
  // @todo Move this hard-coded value in a const
  if (req.body.type === "edit-car") {
    const foCar = await foCars.findOne({
      where: { userId: req.user.id, id: req.body.foCar.id, gameId: game.id },
    });
    if (foCar != null) {
      return true;
    }
  }
  return false;
};

router.post("/:gameId/setup", [
  (req, res, next) => authenticate(req, res, next),
  (req: Request & { app: { pubSub: PubSubJS.Base } }, res: Response) => {
    const payload: editCarSetup | editGameSetup = req.body;
    authorize(req, res, canEditSetup).then(async () => {
      // @todo Move this hard-coded value in a const
      if (payload.type === "edit-car") {
        // await editCarSetup(req.params.gameId, payload.foCar);
      }
      // @todo Move this hard-coded value in a const
      else if (payload.type === "edit-setup") {
        await editGameSetup(req.params.gameId, payload.gameSetup);
      }
      // @todo Add the setup adit functionality first
      const gameSetup = await getGameSetup(req.params.gameId);
      console.log(gameSetup);
      req.app.pubSub.publish(setupSubscription + req.params.gameId, gameSetup);
      res.send(gameSetup);
    });
  },
]);

export default router;
