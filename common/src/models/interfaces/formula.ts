import { foCarsAttributes } from "../generated/foCars";
import { foCurvesAttributes } from "../generated/foCurves";
import { foDebrisAttributes } from "../generated/foDebris";
import { foGamesAttributes } from "../generated/foGames";
import { foPosition2PositionsAttributes } from "../generated/foPosition2Positions";
import { foPositionsAttributes } from "../generated/foPositions";
import { foTracksAttributes } from "../generated/foTracks";
import { foTurnsAttributes } from "../generated/foTurns";
import { gamesAttributes } from "../generated/games";
import { gamesUsersAttributes } from "../generated/gamesUsers";
import { usersAttributes } from "../generated/users";

interface fullPosition extends foPositionsAttributes {
  foPosition2Positions: foPosition2PositionsAttributes[];
  foPositionToFoPosition2Positions: foPosition2PositionsAttributes[];
}

interface fullTrack extends foTracksAttributes {
  foCurves: foCurvesAttributes[];
  foPositions: fullPosition[];
}

interface formulaGame extends gamesAttributes, foGamesAttributes {}

interface fullFormulaGame extends formulaGame {
  foCars: foCarsAttributes[];
  foDebris?: foDebrisAttributes[];
  gamesUsers: (gamesUsersAttributes & { user: usersAttributes })[];
  lastTurn?: foTurnsAttributes;
}

interface moveOption {
  foPositionId: number;
  foCurveId: number;
  isNextLap: boolean;
  damages: {
    tire: number;
    brakes: number;
    chassis: number;
    shocks: number;
  };
  traverse: number[];
}

export { fullPosition, fullTrack, formulaGame, fullFormulaGame, moveOption };
