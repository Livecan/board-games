import { Box, SxProps, Theme, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { foDamagesAttributes } from "../../../common/src/models/generated/foDamages";
import { foPositionsAttributes } from "../../../common/src/models/generated/foPositions";
import {
  fullFormulaGame,
  fullTrack,
} from "../../../common/src/models/interfaces/formula";

const getCarImageSrc = (carIndex: number) =>
  `${Math.trunc(carIndex / 2) + 1}${carIndex % 2 == 0 ? "a" : "b"}.png`;

const getMoImageSrc = (isSelected: boolean, isDamaged: boolean) =>
  `car-outline-${
    isSelected ? "selected" : isDamaged ? "damage" : "nodamage"
  }.svg`;

const CarSprite = ({
  src,
  position,
  onClick,
  sx,
}: {
  src: string;
  position: foPositionsAttributes;
  onClick?: () => void;
  sx?: SxProps;
}) => (
  <Box
    component="img"
    src={src}
    height="1.2%"
    width="1.2%"
    position={"absolute"}
    left={`${position.posX / 1000 - 0.6}%`}
    top={`${position.posY / 1000 - 0.6}%`}
    sx={{
      transform: `rotate(${position.angle}rad)`,
      ...sx,
    }}
    onClick={onClick}
  />
);

// @todo Create TS interface for MO
const FormulaGameBoard = <
  MO extends { foDamages: foDamagesAttributes[]; foPositionId: number }
>({
  game,
  track,
  availableMOs,
  onSelectMO,
}: {
  game: fullFormulaGame;
  track: fullTrack;
  availableMOs?: MO[];
  onSelectMO?: (mo: MO) => void;
}) => {
  const [selectedMOs, setSelectedMOs] = useState<MO | MO[]>(null);

  useEffect(() => {
    setSelectedMOs(null);
  }, [availableMOs]);

  // @todo Consider using width param?
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  return (
    track != null && (
      <Box sx={{ position: "relative" }} width={isMd ? "300%" : "400%"}>
        <Box
          component="img"
          src="/resources/formula/tracks/monaco.jpg"
          width="100%"
        />
        {game.foDebris.map(debris =>
          <CarSprite
            key={debris.id}
            src="/resources/formula/track-objects/oil.png"
            position={track.foPositions.find((position) => position.id == debris.foPositionId)}
            sx={{opacity: 0.8}} />
        )}
        {game.foCars.map((car, index) => (
          <CarSprite
            key={car.id}
            src={`/resources/formula/cars/${getCarImageSrc(index)}`}
            position={track.foPositions.find(
              (position) => position.id == car.foPositionId
            )}
            // @todo When moving on board is functional, consider using sx transition on car's left and top
          />
        ))}
        {/* @todo Need to do some sort of unique positions here and onClick
            should pick the MOs from the availableMOs */}
        {availableMOs?.map((mo, index) => (
          <CarSprite
            key={index}
            src={`/resources/formula/move-options/${getMoImageSrc(
              mo == selectedMOs,
              // @todo If MO will only contains traverse, will need to calculate the damage, probably do it in useMemo prior to here
              mo.foDamages.some((damage) => damage.wearPoints > 0)
            )}`}
            position={track.foPositions.find(
              (position) => position.id == mo.foPositionId
            )}
            // @todo Figure out how to do these internal state and how to
            // display traverse array. When this MO has no damage and is
            // selected, it should display traverse. If it gets clicked again
            // it should call props.onSelectMO(mo). If this MO has damage,
            // after selection, the user should have the option to choose which
            // damage and the relevant traverse should be displayed. The choice
            // of position prior to choosing the particular damage should be
            // stored in selectedMOs as array of MOs for that position. Then,
            // the user should be able to confirm the choice or choose the
            // other damage option or choose a whole another final position.
            // For choosing damages, use radio button.
            onClick={() => setSelectedMOs(mo)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>
    )
  );
};

export default FormulaGameBoard;
