import express, { Request, Response } from "express";
import expressWebSocket from "express-ws";
import { games } from "../../../common/src/models/generated/games";
import { foCars } from "../../../common/src/models/generated/foCars";
import {
  users,
  usersAttributes,
} from "../../../common/src/models/generated/users";
import {
  authenticate,
  authenticateToken,
} from "../service/authentication.service";
import formulaSvc, { gameSetup } from "../service/formulaGame.service";
import { PreconditionRequiredError, UnauthorizedError } from "../utils/errors";
import { foDamagesAttributes } from "../../../common/src/models/generated/foDamages";
import { gamesStateIdEnum as gamesStateIdE } from "../../../common/src/models/enums/game";

const router = express.Router();

// @ts-ignore
expressWebSocket(router);

const setupSubscription = "formula/setup/";

const postAddGameRoute = router.route("/add").post([
  (req, res, next) => authenticate(req, res, next),
  (req: Request & { user: users }, res: Response) => {
    formulaSvc
      .add({ user: req.user, name: req.body.name })
      .then((gameId) =>
        formulaSvc
          .getGame({ gameId: gameId })
          .then((game) => res.send(game))
      )
      .catch((e) => {
        throw e;
      });
  },
]);

const getGameSubscriptionRoute = router.ws(
  "/:gameId",
  (ws, req: Request & { app: { pubSub: PubSubJS.Base } }) => {
    const gameId = parseInt(req.params.gameId);
    ws.on("message", async (msg: string) => {
      const data = JSON.parse(msg);
      try {
        await authenticateToken(data.token, req);
        const subscriptionToken = req.app.pubSub.subscribe(
          setupSubscription + gameId,
          (topic, data) => ws.send(JSON.stringify(data))
        );
        formulaSvc
          .getGame({ gameId: gameId })
          .then((gameSetup) => ws.send(JSON.stringify(gameSetup)));
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
  return game.gameStateId == gamesStateIdE.new && game.creatorId == req.user.id;
};

const postGameSetupRoute = router.post("/:gameId/setup", [
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
      await formulaSvc.editGameSetup({ gameId: gameId, gameSetup: payload });
      // @todo Add the setup edit functionality first
      const gameSetup = await formulaSvc.getGame({ gameId: gameId });
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
  if (game.gameStateId != gamesStateIdE.new) {
    return false;
  }
  const foCar = await foCars.findOne({
    where: { userId: req.user.id, id: req.params.foCarId, gameId: game.id },
  });
  return foCar != null;
};

const postCarSetupRoute = router.post("/:gameId/setup/car/:foCarId", [
  (req, res, next) => authenticate(req, res, next),
  (
    req: Request & { app: { pubSub: PubSubJS.Base }; user: usersAttributes },
    res: Response
  ) => {
    const gameId = parseInt(req.params.gameId);
    const foCarId = parseInt(req.params.foCarId);
    const payload: [foDamagesAttributes] = req.body;
    authorize(req, res, canEditCarSetup).then(async () => {
      await formulaSvc.editCarSetup({
        userId: req.user.id,
        gameId: gameId,
        foCarId: foCarId,
        foCarDamages: payload,
      });
      // @todo Add the setup edit functionality first
      const gameSetup = await formulaSvc.getGame({ gameId: gameId });
      console.log(gameSetup);
      req.app.pubSub.publish(setupSubscription + req.params.gameId, gameSetup);
      res.send(gameSetup);
    });
  },
]);

const postSetUserReady = router.post("/:gameId/setup/ready", [
  (req, res, next) => authenticate(req, res, next),
  (
    req: Request & { app: { pubSub: PubSubJS.Base }; user: usersAttributes },
    res: Response
  ) => {
    const gameId = parseInt(req.params.gameId);
    const payload: { isReady: boolean } = req.body;
    formulaSvc
      .setUserReady({
        gameId: gameId,
        userId: req.user.id,
        isReady: payload.isReady,
      })
      .then(async () => {
        const gameSetup = await formulaSvc.getGame({ gameId: gameId });
        req.app.pubSub.publish(
          setupSubscription + req.params.gameId,
          gameSetup
        );
        res.send(gameSetup);
      });
  },
]);

const postStart = router.post("/:gameId/start", [
  (req, res, next) => authenticate(req, res, next),
  (
    req: Request & { app: { pubSub: PubSubJS.Base }; user: usersAttributes },
    res: Response
  ) => {
    const gameId = parseInt(req.params.gameId);
    authorize(req, res, canEditGameSetup).then(async () => {
      formulaSvc
        .start({ gameId: gameId })
        .then((game) => {
          res.send(game);
          formulaSvc
            .getGame({ gameId: gameId })
            .then((game) =>
              req.app.pubSub.publish(
                setupSubscription + req.params.gameId,
                game
              )
            );
        })
        .catch((e) => {
          if (e instanceof PreconditionRequiredError) {
            res.sendStatus(PreconditionRequiredError.code).send(e.message);
          }
          throw e;
        });
    });
  },
]);

const getTrack = router.get("/:gameId/track", async (req, res) => {
  const gameId = parseInt(req.params.gameId);
  formulaSvc
    .getTrack({ gameId: gameId })
    .then((track) => res.send(track))
    .catch((e) => {
      res.sendStatus(500);
      throw e;
    });
});

export default router;
