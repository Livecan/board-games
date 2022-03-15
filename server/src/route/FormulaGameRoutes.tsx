import express, { NextFunction, Request, Response } from "express";
import expressWebSocket from "express-ws";
import { games } from "../models/games";
import { foCars } from "../models/foCars";
import { users, usersAttributes } from "../models/users";
import {
  authenticate,
  authenticateToken,
} from "../service/authentication.service";
import {
  add,
  editCarSetup,
  editGameSetup,
  gameSetup,
  getGameSetup,
  view,
} from "../service/formulaGame.service";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { foDamagesAttributes } from "../models/foDamages";

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
      .then((game) => res.redirect(`${req.baseUrl}/${game.id}/setup`))
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

const canEditGameSetup = async (
  req: Request & { user: usersAttributes }
): Promise<Boolean> => {
  const game = await games.findByPk(req.params.gameId);
  return game.gameStateId == newGameStateId && game.creatorId == req.user.id;
};

router.post("/:gameId/setup", [
  (req, res, next) => authenticate(req, res, next),
  (
    req: Request & {
      params: { gameId: string };
      app: { pubSub: PubSubJS.Base };
    },
    res: Response
  ) => {
    const gameId = parseInt(req.params.gameId);
    const payload: gameSetup = req.body;
    authorize(req, res, canEditGameSetup).then(async () => {
      await editGameSetup(gameId, payload);
      // @todo Add the setup edit functionality first
      const gameSetup = await getGameSetup(gameId);
      console.log(gameSetup);
      req.app.pubSub.publish(setupSubscription + req.params.gameId, gameSetup);
      res.send(gameSetup);
    });
  },
]);

const canEditCarSetup = async (
  req: Request & { user: usersAttributes }
): Promise<Boolean> => {
  const game = await games.findByPk(req.params.gameId);
  if (game.gameStateId != newGameStateId) {
    return false;
  }
  // @todo Move this hard-coded value in a const
  const foCar = await foCars.findOne({
    where: { userId: req.user.id, id: req.params.foCarId, gameId: game.id },
  });
  return foCar != null;
};

router.post("/:gameId/setup-car/:foCarId", [
  (req, res, next) => authenticate(req, res, next),
  (req: Request & { app: { pubSub: PubSubJS.Base } }, res: Response) => {
    const gameId = parseInt(req.params.gameId);
    const foCarId = parseInt(req.params.foCarId);
    const payload: [foDamagesAttributes] = req.body;
    authorize(req, res, canEditCarSetup).then(async () => {
      await editCarSetup(gameId, foCarId, payload);
      // @todo Add the setup edit functionality first
      const gameSetup = await getGameSetup(gameId);
      console.log(gameSetup);
      req.app.pubSub.publish(setupSubscription + req.params.gameId, gameSetup);
      res.send(gameSetup);
    });
  },
]);

export default router;
