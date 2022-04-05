import {
  Box,
  ClickAwayListener,
  SxProps,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { foPositionsAttributes } from "../../../common/src/models/generated/foPositions";
import {
  fullFormulaGame,
  fullTrack,
  moveOption,
} from "../../../common/src/models/interfaces/formula";

const getCarImageSrc = (carIndex: number) =>
  `${Math.trunc(carIndex / 2) + 1}${carIndex % 2 == 0 ? "a" : "b"}.png`;

const getMoImageSrc = (isSelected: boolean, isDamaged: boolean) =>
  `car-outline-${
    isSelected ? "selected" : isDamaged ? "damage" : "nodamage"
  }.svg`;

const CarSprite = React.forwardRef(
  (
    {
      src,
      position,
      onClick,
      sx,
      ...props
    }: {
      src: string;
      position: foPositionsAttributes;
      onClick?: () => void;
      sx?: SxProps;
    },
    ref
  ) => (
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
      {...props}
      ref={ref}
    />
  )
);

// @todo Create TS interface for MO
const FormulaGameBoard = ({
  game,
  track,
  availableMOs,
  onSelectMO,
}: {
  game: fullFormulaGame;
  track: fullTrack;
  availableMOs?: moveOption[];
  onSelectMO?: (mo: moveOption) => void;
}) => {
  const [selected, setSelected] = useState<moveOption>(null);

  useEffect(() => {
    setSelected(null);
  }, [availableMOs]);

  const mosByPositionId = useMemo(() => {
    const positionIds = new Set(availableMOs?.map((mo) => mo.foPositionId));
    const mosByPositionId = new Map<number, moveOption[]>();
    for (const positionId of positionIds) {
      mosByPositionId.set(
        positionId,
        availableMOs.filter((mo) => mo.foPositionId == positionId)
      );
    }
    return mosByPositionId;
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
        {game.foDebris.map((debris) => (
          <CarSprite
            key={debris.id}
            src="/resources/formula/track-objects/oil.png"
            position={track.foPositions.find(
              (position) => position.id == debris.foPositionId
            )}
            sx={{ opacity: 0.8 }}
          />
        ))}
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
        {selected?.traverse?.map((positionId) => (
          <CarSprite
            key={positionId}
            src="/resources/formula/move-options/car-outline-top-view.svg"
            position={track.foPositions.find(
              (position) => position.id == positionId
            )}
          />
        ))}
        {[...mosByPositionId.entries()].map(
          ([positionId, mos]) =>
            (selected == null || selected.foPositionId == positionId) && (
              <ClickAwayListener
                key={positionId}
                onClickAway={() => setSelected(null)}
              >
                <Tooltip
                  open={
                    selected?.foPositionId == positionId &&
                    !!selected?.foDamages?.some((dmg) => dmg.wearPoints > 0)
                  }
                  title="Damage table!"
                >
                  <CarSprite
                    src={`/resources/formula/move-options/${getMoImageSrc(
                      selected?.foPositionId == positionId,
                      // @todo If MO will only contains traverse, will need to calculate the damage, probably do it in useMemo prior to here
                      // If there are multiple MOs selected or if only one selected and it has damage, use damage MO icon
                      mos.some((mo) =>
                        mo.foDamages.some((dmg) => dmg.wearPoints > 0)
                      )
                    )}`}
                    position={track.foPositions.find(
                      (pos) => pos.id == positionId
                    )}
                    onClick={() => setSelected(mos[0])}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </ClickAwayListener>
            )
        )}
      </Box>
    )
  );
};

export default FormulaGameBoard;
