import finiteStateMachine from "../../../utils/finiteStateMachine";
import { foCarsAttributes } from "../generated/foCars";
import {
  fullFormulaGame,
  fullPosition,
  fullTrack,
  moveOption,
} from "../interfaces/formula";

enum DirectionEnum {
  left,
  right,
}

class Mo {
  foPositionId: number;
  foCurveId: number;
  curveStops: number;
  isNextLap: boolean = false;
  movesLeft: number;
  isAllowedLeft: boolean = true;
  isAllowedRight: boolean = true;
  isOvershootingCurve: boolean = false;
  damages: {
    tire: number,
    brakes: number,
    chassis: number,
    shocks: number,
  };
  traverse: number[] = []; // array of foPositionId
  overtakeLeft: number = 0;
  overtakeHistory: DirectionEnum = null;
  slipstream: {
    isSlipstreaming: boolean;
    isDraftedInCurve: boolean;
  } = null;

  getClone() {
    return new Mo(this);
  }

  constructor(previousMo: Mo);
  constructor(
    foPositionId: number,
    foCurveId: number,
    curveStop: number,
    movesLeft: number
  );
  constructor(
    previousMoOrFoPositionId: Mo | number,
    foCurveId?: number,
    curveStop?: number,
    movesLeft?: number
  ) {
    if (typeof previousMoOrFoPositionId === "number") {
      this.foPositionId = previousMoOrFoPositionId;
      this.foCurveId = foCurveId;
      this.curveStops = curveStop;
      this.movesLeft = movesLeft;
      this.damages = {
        tire: 0,
        brakes: 0,
        chassis: 0,
        shocks: 0,
      };
      this.traverse.push(previousMoOrFoPositionId);
    } else {
      Object.assign(this, previousMoOrFoPositionId);
      this.damages = {...previousMoOrFoPositionId.damages};
      this.traverse = [...previousMoOrFoPositionId.traverse];
      this.slipstream = { ...previousMoOrFoPositionId.slipstream };
    }
  }

  export(): moveOption {
    return {
      foPositionId: this.foPositionId,
      foCurveId: this.foCurveId,
      isNextLap: this.isNextLap,
      damages: this.damages,
      traverse: this.traverse,
    };
  }
}

type MovementState =
  | "START"
  | "1_STOP"
  | "2_STOP"
  | "LEFTY"
  | "RIGHTY"
  | "STRAIGHT"
  | "OVERSHOOT"
  | "OVERTAKE"
  | "OVERTAKE_1"
  | "OVERTAKE_L"
  | "OVERTAKE_R"
  | "ONE_MORE_DIRECTION";

type MovementTransition = "S" | "L" | "R" | "C0" | "C1" | "C2" | "O";

const movementStateMachineRules: [
  MovementState,
  MovementTransition,
  MovementState
][] = [
  // The rules assume that the route is clear - i.e. if the car would have
  // straight direction behind another car, this would have been caught
  // earlier already.
  ["START", "S", "START"],
  ["START", "C1", "1_STOP"],
  ["START", "C2", "2_STOP"],
  ["START", "L", "LEFTY"],
  ["START", "R", "RIGHTY"],
  ["START", "O", "OVERSHOOT"],
  ["1_STOP", "C1", "1_STOP"],
  ["1_STOP", "S", "OVERSHOOT"],
  ["2_STOP", "C2", "2_STOP"],
  ["LEFTY", "S", "LEFTY"],
  ["LEFTY", "C1", "1_STOP"],
  ["LEFTY", "C2", "2_STOP"],
  ["LEFTY", "L", "STRAIGHT"],
  // This rule is to avoid a car going into an overtaking position and
  // returning into a lane to make shorter move on a straight
  ["LEFTY", "O", "OVERTAKE_L"],
  ["RIGHTY", "S", "RIGHTY"],
  ["RIGHTY", "C1", "1_STOP"],
  ["RIGHTY", "C2", "2_STOP"],
  ["RIGHTY", "R", "STRAIGHT"],
  // This rule is to avoid a car going into an overtaking position and
  // returning into a lane to make shorter move on a straight
  ["RIGHTY", "O", "OVERTAKE_R"],
  ["OVERSHOOT", "S", "OVERSHOOT"],
  ["OVERSHOOT", "C1", "2_STOP"],
  ["OVERSHOOT", "C2", "2_STOP"],
  ["STRAIGHT", "S", "STRAIGHT"],
  ["STRAIGHT", "C1", "1_STOP"],
  ["STRAIGHT", "C2", "2_STOP"],
  ["OVERTAKE_1", "L", "STRAIGHT"],
  ["OVERTAKE_1", "R", "STRAIGHT"],
  ["OVERTAKE", "L", "OVERTAKE_L"],
  ["OVERTAKE", "R", "OVERTAKE_R"],
  ["OVERTAKE_L", "L", "STRAIGHT"],
  ["OVERTAKE_L", "S", "ONE_MORE_DIRECTION"],
  ["OVERTAKE_R", "R", "STRAIGHT"],
  ["OVERTAKE_R", "S", "ONE_MORE_DIRECTION"],
  ["ONE_MORE_DIRECTION", "S", "ONE_MORE_DIRECTION"],
  ["ONE_MORE_DIRECTION", "L", "STRAIGHT"],
  ["ONE_MORE_DIRECTION", "R", "STRAIGHT"],
  ["ONE_MORE_DIRECTION", "O", "OVERTAKE_1"],
  ["ONE_MORE_DIRECTION", "C1", "1_STOP"],
  ["ONE_MORE_DIRECTION", "C2", "2_STOP"],
];

const validateMo = (
  traverse: number[],
  game: fullFormulaGame,
  track: fullTrack
) => {
  const movesLeft = game.lastTurn.roll;
  const currentCar = game.foCars.find((car) => car.id == game.lastTurn.foCarId);

  const traversePositions = traverse.map((positionId) =>
    track.foPositions.find((pos) => pos.id == positionId)
  );

  const traverseDirections: MovementTransition[] = [];
  // Check that the traverse route exists and create traverse directions for
  // the state machine
  if (traverse.length > 0) {
    let previousPos = track.foPositions.find(
      (pos) => pos.id == currentCar.foPositionId
    );
    for (const position of traversePositions) {
      // Getting a p2p entry to figure out what sort of movement the car is doing
      const p2p = track.foPositions
        .find((from) => from.id == previousPos.id)
        .foPosition2Positions.find((p2p) => p2p.foPositionToId == position.id);

      // If a car is in front of this position, can overtake
      const canOvertake = game.foCars.some(
        (car) =>
          car.foPositionId ==
          track.foPositions
            .find((pos) => pos.id == position.id)
            .foPosition2Positions.find((p2p) => p2p.isStraight)?.foPositionToId
      );

      if (canOvertake) {
        traverseDirections.push("O");
      }

      // Entering a corner
      if (previousPos.foCurveId == null && position.foCurveId != null) {
        traverseDirections.push(p2p.isLeft ? "L" : p2p.isStraight ? "S" : "R");
        traverseDirections.push(
          track.foCurves.find((curve) => curve.id == position.foCurveId)
            .stops == 1
            ? "C1"
            : "C2"
        );
        // Moving thru the initial corner & no stops left
      } else if (
        currentCar.foCurveId != null &&
        currentCar.foCurveId == position.foCurveId &&
        track.foCurves.find((curve) => curve.id == currentCar.foCurveId)
          .stops <= currentCar.stops
      ) {
        traverseDirections.push("S");
        // Leaving a corner
      } else if (previousPos.foCurveId != null && position.foCurveId == null) {
        traverseDirections.push("S");
        // Staying in the corner
      } else if (previousPos.foCurveId != null && position.foCurveId != null) {
        traverseDirections.push(
          traverseDirections[traverseDirections.length - 1]
        );
      } else if (p2p.isLeft) {
        traverseDirections.push("L");
      } else if (p2p.isRight) {
        traverseDirections.push("R");
      } else if (p2p.isStraight) {
        traverseDirections.push("S");
      } else {
        // @todo For practise purposes, this should check that new features are
        // sanitized and data is consistent
        throw new Error(
          "Unreachable condition hit - inconsistent data or new features not implemented,"
        );
      }

      previousPos = position;
    }

    // Check slipstreaming is correct if the car needs to slipstream here
    for (
      let slipstreamCount = 0;
      movesLeft < traverse.length + slipstreamCount * 3;
      slipstreamCount++
    ) {
      const isCarInFront = game.foCars.some(
        (car) =>
          car.foPositionId ==
          track.foPositions
            .find(
              (pos) => pos.id == traverse[movesLeft + slipstreamCount * 3 - 1]
            )
            .foPosition2Positions.find((p2p) => p2p.isStraight)?.foPositionToId
      );
      if (!isCarInFront) {
        return false;
      }
    }

    // Run the state machine to check that the maneuvre is ok
    const movementCheckMachine = finiteStateMachine(
      "START",
      movementStateMachineRules
    );
    for (const movementTransition of traverseDirections) {
      if (movementCheckMachine.dispatch(movementTransition) == null) {
        console.log(movementCheckMachine.getState());
        return false;
      }
    }
  }

  const damages = {
    tire: 0,
    brake: 0,
    shocks: 0,
    chassis: [],
  };

  // Checking if not braking too much
  if (movesLeft - traverse.length > 6) {
    console.log("Too much breaking");
    return false;
  }

  // Checking braking damage
  if (traverse.length < movesLeft) {
    damages.brake += Math.min(movesLeft - traverse.length, 3);
    damages.tire += Math.max(movesLeft - traverse.length - 3, 0);
  } else if (traverse.length < movesLeft) {
    // Checking braking while slipstreaming
    damages.brake += (3 - ((traverse.length - movesLeft) % 3)) % 3;
    // Checking if damage from slipstreaming into a corner
    const enteredCurveInSlipstream = traversePositions
      .slice(movesLeft)
      .some((pos) => pos.foCurveId != null);
    if (enteredCurveInSlipstream) {
      damages.brake++;
    }
  }

  // Checking tire damage for corner overshooting
  // Needs to find the first corner where the car still has at least one stop
  // left
  const firstCurveId = traversePositions.find(
    (position) =>
      position.foCurveId != null &&
      (position.foCurveId != currentCar.foCurveId ||
        (position.foCurveId == currentCar.foCurveId &&
          track.foCurves.find((curve) => curve.id == position.foCurveId).stops -
            currentCar.stops >
            0))
  )?.foCurveId;
  // If the route contains a corner where the car could overshoot, needs to add
  // the overshooting tire damage
  if (firstCurveId != null) {
    // Getting the last index of the overshooting corner position in traverse
    let lastIndex = traverse.length - 1;
    while (traversePositions[lastIndex].foCurveId != firstCurveId) {
      lastIndex--;
    }
    // Needs to add number of moves left in the traverse after leaving the
    // corner and add them to the tire damage
    damages.tire += traverse.length - lastIndex - 1;
  }

  // After dealing the tire damage, the car cannot go under 0 wear points;
  // 0 means the car flips and needs to continue in the first gear
  if (currentCar.wpTire - damages.tire < 0) {
    console.log("Too much tire damage");
    return false;
  }

  // After dealing the brake damage, the car cannot go under 1 wear point.
  if (currentCar.wpBrakes - damages.brake < 1) {
    console.log("Too much brake damage");
    return false;
  }

  // Add the suspension damage based on passed debris - this damage will be
  // determined by a dice roll
  for (const debris of game.foDebris) {
    if (traverse.includes(debris.foPositionId)) {
      damages.shocks++;
    }
  }

  // Figure out potential collision damage to chassis - needs to get number of
  // cars on the adjacents positions (adjacentPositionIds) to the final
  // position (finalPositionId)
  const finalPositionId =
    traverse.length > 0
      ? traverse[traverse.length - 1]
      : currentCar.foPositionId;
  const adjacentPositionIds = [
    ...track.foPositions
      .find((pos) => pos.id == finalPositionId)
      .foPosition2Positions.filter((p2p) => p2p.isAdjacent)
      .map((p2p) => p2p.foPositionToId),
    ...track.foPositions
      .find((pos) => pos.id == finalPositionId)
      .foPositionToFoPosition2Positions.filter((p2p) => p2p.isAdjacent)
      .map((p2p) => p2p.foPositionFromId),
  ];
  for (const car of game.foCars.filter((car) => car.id != currentCar.id)) {
    if (adjacentPositionIds.includes(car.foPositionId)) {
      damages.chassis.push(car.id);
    }
  }
  return damages;
};

const getMos = (game: fullFormulaGame, track: fullTrack, movesLeft: number) => {
  // @todo use game.lastTurn.foCarId here for simplicity?
  const currentCar = game.foCars
    .filter((car) => car.order != null)
    .sort((a, b) => a.order - b.order)[0];
  const initialMo = new Mo(
    currentCar.foPositionId,
    currentCar.foCurveId,
    currentCar.stops,
    movesLeft
  );

  const mos: Mo[] = [initialMo];

  // Adding braking damage to the move options initially, it does not need to
  // be considered later
  mos.push(...getInitialBrakingOptions(initialMo));

  while (
    mos.length > 0 &&
    mos.some((mo) => mo.movesLeft > 0 || !mo.slipstream)
  ) {
    const currentMo = mos.shift();
    const nextMos = getNextMos(game, track, currentMo);
    for (const nextMo of nextMos) {
      addUniqueMo(mos, nextMo);
    }
    mos.sort((mo1, mo2) => mo2.movesLeft - mo1.movesLeft);
    // @todo Slipstream is only allowed if the player didn't have to brake to
    // get in the slipstream - so braking damage means no slipstream; do
    // slipstream when all the remaining MoveOptions have no moves left.
  }
  return mos.map((mo) => mo.export());
};

const getInitialBrakingOptions = (initialMo: Mo) => {
  const mos = [];
  for (
    let brakingMoves = 1;
    brakingMoves <= Math.min(6, initialMo.movesLeft);
    brakingMoves++
  ) {
    const brakingMo = initialMo.getClone();
    brakingMo.movesLeft -= brakingMoves;
    brakingMo.damages.brakes = Math.min(brakingMoves, 3);
    if (brakingMoves > 3) {
      brakingMo.damages.tire = Math.min(brakingMoves - 3, 3);
    }
    mos.push(brakingMo);
  }
  return mos;
};

const getNextMos = (game: fullFormulaGame, track: fullTrack, current: Mo) => {
  const currentCar = game.foCars
    .filter((car) => car.order != null)
    .sort((a, b) => a.order - b.order)[0];
  const currentPosition = track.foPositions.find(
    (position) => position.id == current.foPositionId
  );
  if (canOvertake(game, currentPosition)) {
    current.overtakeLeft = 3;
  }

  const availableNextPositions = getAvailableNextP2Ps(game, track, current);

  const nextMos = [];

  // @todo Pitlane option

  for (const p2p of availableNextPositions) {
    const positionTo = track.foPositions.find(
      (position) => position.id == p2p.foPositionToId
    );
    const nextMo = current.getClone();

    nextMo.movesLeft -= 1;
    nextMo.foPositionId = p2p.foPositionToId;
    nextMo.traverse.push(p2p.foPositionToId);

    nextMo.overtakeLeft = Math.max(current.overtakeLeft - 1, 0);

    // Allowed left and right have keep the value unless the car is changing
    // lane in opposite direction or is in the curve. In those cases it's
    // false.
    nextMo.isAllowedLeft &&= !p2p.isRight && !p2p.isCurve;
    nextMo.isAllowedRight &&= !p2p.isLeft && !p2p.isCurve;

    // If overtaking, need to keep track of previous
    if (current.overtakeLeft > 0 && p2p.isLeft) {
      nextMo.overtakeHistory = DirectionEnum.left;
    } else if (current.overtakeLeft > 0 && p2p.isRight) {
      nextMo.overtakeHistory = DirectionEnum.right;
    }

    const isCarAhead = game.foCars.find((car) =>
      positionTo.foPosition2Positions.some(
        (p2p) => !!p2p.isStraight && p2p.foPositionToId == car.foPositionId
      )
    );
    if (isCarAhead) {
      nextMo.overtakeHistory = null;
      nextMo.overtakeLeft = 3;
    }

    nextMo.isNextLap = !!(!currentPosition.isFinish && positionTo.isFinish);

    const shocksDamageCount = game.foDebris!.filter(
      (debris) => debris.foPositionId == currentPosition.id
    ).length;
    if (shocksDamageCount > 0) {
      nextMo.damages.shocks += shocksDamageCount;
    }

    if (addCurveHandling(track, nextMo) && isDamageOk(currentCar, nextMo)) {
      if (nextMo.slipstream.isSlipstreaming && nextMo.foCurveId != null) {
        nextMo.slipstream.isDraftedInCurve = true;
      }
      nextMos.push(nextMo);
    }
  }

  return nextMos;
};

const addUniqueMo = (mos: Mo[], newMo: Mo) => {
  // First need to find a MoveOption that is almost identical to the newMoveOption
  for (let index = mos.length - 1; index >= 0; index--) {
    const checkedMo = mos[index];
    if (
      checkedMo.foPositionId == newMo.foPositionId &&
      checkedMo.foCurveId == newMo.foCurveId &&
      checkedMo.curveStops == newMo.curveStops &&
      checkedMo.movesLeft == newMo.movesLeft &&
      checkedMo.isAllowedLeft == newMo.isAllowedLeft &&
      checkedMo.isAllowedRight == newMo.isAllowedRight &&
      checkedMo.overtakeLeft == newMo.overtakeLeft &&
      checkedMo.overtakeHistory == newMo.overtakeHistory &&
      checkedMo.slipstream?.isSlipstreaming == newMo.slipstream?.isSlipstreaming
    ) {
      // Now the only difference should be in damages.
      // If the checkMoveOption deals the same or less damage, we don't need to
      // add newMoveOption.
      if (checkedMo.damages.tire <= newMo.damages.tire &&
        checkedMo.damages.brakes <= newMo.damages.brakes &&
        checkedMo.damages.chassis <= newMo.damages.chassis &&
        checkedMo.damages.shocks <= newMo.damages.shocks
      ) {
        return;
      }
      // If the newMoveOption deals less or equal to the checkMoveOption, we
      // remove checkMoveOption from moveOptions.
      if (checkedMo.damages.tire >= newMo.damages.tire &&
        checkedMo.damages.brakes >= newMo.damages.brakes &&
        checkedMo.damages.chassis >= newMo.damages.chassis &&
        checkedMo.damages.shocks >= newMo.damages.shocks
      ) {
        mos.splice(index, 1);
      }
    }
  }
  mos.push(newMo);
};

const isDamageOk = (car: foCarsAttributes, mo: Mo) => {
  return car.wpTire >= mo.damages.tire || car.wpBrakes > mo.damages.brakes;
};

/**
 * Adds curve handling info in moveOption and returns whether it's valid.
 */
const addCurveHandling = (track: fullTrack, mo: Mo): boolean => {
  const nextPosition = track.foPositions.find(
    (position) => (position.id = mo.foPositionId)
  );

  // Entering the curve normally
  if (mo.foCurveId == null && nextPosition.foCurveId != null) {
    mo.foCurveId = nextPosition.foCurveId;
    mo.curveStops = 0;
    return true;
  }

  // Leaving a curve
  if (
    mo.foCurveId != null &&
    nextPosition.foCurveId == null &&
    !mo.isOvershootingCurve
  ) {
    const curve = track.foCurves.find((curve) => (curve.id = mo.foCurveId));
    // Leaving normally, without damage
    if (mo.curveStops >= curve.stops) {
      mo.foCurveId = null;
      mo.curveStops = null;
      return true;
    }
    // Leaving skipping one stop - getting tire damage
    if (mo.curveStops + 1 == curve.stops) {
      mo.damages.tire++;
      return true;
    }
    // Otherwise overshooting by more than one stop - invalid MoveOption
    return false;
  }

  // When overshooting the second curve within one turn - invalid MoveOption
  if (nextPosition.foCurveId == null && mo.isOvershootingCurve) {
    return false;
  }

  // When overshooting, incl. into the second curve within one turn
  if (mo.isOvershootingCurve) {
    // @todo Done some changes here, check it's correct
    if (nextPosition.foCurveId) {
      mo.foCurveId = nextPosition.foCurveId;
      mo.curveStops = -1;
    }
    mo.damages.tire++;
    return true;
  }

  return true;

  // @todo It might make things much better organized if some sort of state variable
  // was used here for the curve - curveHandlingState(noCurve, noStopsLeft,
  // oneStopLeft, onePlusStopLeft, ?)
};

/**
 * Returns true if there is a car right in front of the current position
 */
const canOvertake = (game: fullFormulaGame, currentPosition: fullPosition) => {
  const anyCarFront = game.foCars.find(
    (car) =>
      car.foPositionId ==
      currentPosition.foPosition2Positions.find((p2p) => p2p.isStraight)
        .foPositionToId
  );

  return anyCarFront;
};

const getAvailableNextP2Ps = (
  game: fullFormulaGame,
  track: fullTrack,
  current: Mo
) => {
  const currentPosition = track.foPositions.find(
    (position) => position.id == current.foPositionId
  );

  const availableNextP2Ps = currentPosition.foPosition2Positions.filter(
    (p2p) =>
      // The overtakeHistory prevents zig-zagging when overtaking
      ((p2p.isLeft &&
        (current.isAllowedLeft ||
          (current.overtakeLeft > 0 &&
            current.overtakeHistory != DirectionEnum.right))) ||
        p2p.isStraight ||
        (p2p.isRight &&
          (current.isAllowedRight ||
            (current.overtakeLeft > 0 &&
              current.overtakeHistory != DirectionEnum.left))) ||
        p2p.isCurve) &&
      game.foCars.every((car) => car.foPositionId != p2p.foPositionToId)
  );

  return availableNextP2Ps;
};

export { getMos, validateMo };
