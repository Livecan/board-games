import { damageTypeEnum as damageTypeE } from "../enums/formula";
import { foDamagesCreationAttributes } from "../generated/foDamages";
import {
  car,
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
  foDamages: foDamagesCreationAttributes[];
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
      this.foDamages = [
        damageTypeE.tire,
        damageTypeE.gearbox,
        damageTypeE.brakes,
        damageTypeE.engine,
        damageTypeE.chassis,
        damageTypeE.shocks,
      ].map((damageType) => ({ type: damageType, wearPoints: 0 }));
      this.traverse.push(previousMoOrFoPositionId);
    } else {
      Object.assign(this, previousMoOrFoPositionId);
      this.foDamages = previousMoOrFoPositionId.foDamages.map((damage) => ({
        ...damage,
      }));
      this.traverse = [...previousMoOrFoPositionId.traverse];
      this.slipstream = { ...previousMoOrFoPositionId.slipstream };
    }
  }

  export(): moveOption {
    return {
      foPositionId: this.foPositionId,
      foCurveId: this.foCurveId,
      isNextLap: this.isNextLap,
      foDamages: this.foDamages,
      traverse: this.traverse,
    };
  }
}

const validateMo = (
  traverse: number[],
  game: fullFormulaGame,
  track: fullTrack
) => {
  const movesLeft = game.lastTurn.roll;
  const currentCar = game.foCars.find((car) => car.id == game.lastTurn.foCarId);
  const traverseDirections = [];
  if (traverse.length > 0) {
    let previous = currentCar.foPositionId;
    for (const positionId of traverse) {
      const p2p = track.foPositions
        .find((from) => from.id == previous)
        .foPosition2Positions.find((p2p) => p2p.foPositionToId == positionId);
      if (p2p.isLeft) {
        // @todo Use enum and also in the following ifs
        traverseDirections.push("L");
      } else if (p2p.isRight) {
        traverseDirections.push("R");
      } else if (p2p.isStraight) {
        traverseDirections.push("S");
      } else if (p2p.isCurve) {
        traverseDirections.push("C");
      } else if (p2p.isPitlaneMove) {
        traverseDirections.push("P");
      } else {
        return false;
      }
      previous = positionId;
    }
  }

  // @todo Check route is clear - no cars
  // @todo Check going through curve is correct
  // @todo Check if overtaking and create traverse with pruned away overtakes
  // @todo Check that pruned traverse does not contain zig-zagging
  // @todo Check if any slipstreaming and that it's valid
  // @todo Check that enough moves, take slipstreaming into account
  // @todo Calculate damage and return damage
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
    brakingMo.foDamages.find(
      (damage) => damage.type == damageTypeE.brakes
    ).wearPoints = Math.min(brakingMoves, 3);
    if (brakingMoves > 3) {
      brakingMo.foDamages.find(
        (damage) => damage.type == damageTypeE.tire
      ).wearPoints = Math.min(brakingMoves - 3, 3);
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
      let shocks = nextMo.foDamages.find(
        (damage) => damage.type == damageTypeE.shocks
      );
      if (shocks == null) {
        shocks = { type: damageTypeE.shocks, wearPoints: 0 };
        nextMo.foDamages.push(shocks);
      }
      shocks.wearPoints += shocksDamageCount;
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
      if (
        checkedMo.foDamages.every(
          (checkDamage) =>
            checkDamage.wearPoints <=
            newMo.foDamages.find(
              (newDamage) => newDamage.type == checkDamage.type
            ).wearPoints
        )
      ) {
        return;
      }
      // If the newMoveOption deals less or equal to the checkMoveOption, we
      // remove checkMoveOption from moveOptions.
      if (
        checkedMo.foDamages.every(
          (checkDamage) =>
            checkDamage.wearPoints >=
            newMo.foDamages.find(
              (newDamage) => newDamage.type == checkDamage.type
            ).wearPoints
        )
      ) {
        mos.splice(index, 1);
      }
    }
  }
  mos.push(newMo);
};

const isDamageOk = (car: car, mo: Mo) => {
  for (const damage of mo.foDamages) {
    const carWearPoints = car.foDamages.find(
      (_damage) => _damage.type == damage.type
    ).wearPoints;
    if (
      damage.type == damageTypeE.tire &&
      carWearPoints - damage.wearPoints < 0
    ) {
      return false;
    }
    if (
      damage.type == damageTypeE.brakes &&
      carWearPoints - damage.wearPoints < 1
    ) {
      return false;
    }
  }
  return true;
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
      mo.foDamages.find((damage) => damage.type == damageTypeE.tire)
        .wearPoints++;
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
    mo.foDamages.find((damage) => damage.type == damageTypeE.tire).wearPoints++;
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
