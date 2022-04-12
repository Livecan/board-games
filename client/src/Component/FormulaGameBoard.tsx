import {
  Box,
  Button,
  ClickAwayListener,
  Radio,
  SxProps,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { damageTypeEnum as damageTypeE } from "../../../common/src/models/enums/formula";
import { foPositionsAttributes } from "../../../common/src/models/generated/foPositions";
import {
  fullFormulaGame,
  fullTrack,
  moveOption,
} from "../../../common/src/models/interfaces/formula";

const getCarImageSrc = (carIndex: number) =>
  `${Math.trunc(carIndex / 2) + 1}${carIndex % 2 == 0 ? "a" : "b"}.png`;

// @todo Create an svg component instead of this
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

const moveOptionDamageTableColumnDefinition: GridColumns = [
  {
    field: "selection",
    headerName: "",
    flex: 1,
    renderCell: ({
      value,
    }: {
      value: { isSelected: boolean; onClick: () => void };
    }) => (
      <Radio size="small" checked={value.isSelected} onClick={value.onClick} />
    ),
  },
  {
    field: "tires",
    headerAlign: "center",
    renderHeader: () => (
      <Box
        sx={{
          display: "block",
          transform: `rotate(-${Math.PI / 4}rad)`,
        }}
      >
        Tires
      </Box>
    ),
    align: "center",
    flex: 2,
  },
  {
    field: "brakes",
    headerAlign: "center",
    renderHeader: () => (
      <Box
        sx={{
          display: "block",
          transform: `rotate(-${Math.PI / 4}rad)`,
        }}
      >
        Brakes
      </Box>
    ),
    align: "center",
    flex: 2,
  },
  {
    field: "shocks",
    headerAlign: "center",
    renderHeader: () => (
      <Box
        sx={{
          display: "block",
          transform: `rotate(-${Math.PI / 4}rad)`,
        }}
      >
        Shocks
      </Box>
    ),
    align: "center",
    flex: 2,
  },
].map((column) => ({
  ...column,
  disableColumnMenu: true,
  hideSortIcons: true,
})) as GridColumns;

const MoveOptionDamageTable = ({
  mos,
  selected,
  onSelect,
  onDeselect,
  onConfirm,
}: {
  mos: moveOption[];
  selected: moveOption;
  onSelect: (selected: moveOption) => void;
  onDeselect?: () => void;
  onConfirm: (selected: moveOption) => void;
}) => (
  <Box>
    <DataGrid
      autoHeight
      sx={{ width: 240 }}
      hideFooter
      columns={moveOptionDamageTableColumnDefinition}
      rows={mos.map((mo) => ({
        id: mo.traverse.join("."),
        selection: { isSelected: mo === selected, onClick: () => onSelect(mo) },
        tires: mo.foDamages.find((dmg) => dmg.type == damageTypeE.tire)
          .wearPoints,
        brakes: mo.foDamages.find((dmg) => dmg.type == damageTypeE.brakes)
          .wearPoints,
        shocks: mo.foDamages.find((dmg) => dmg.type == damageTypeE.shocks)
          .wearPoints,
      }))}
    />
    {/* @todo Consider what to do about this styling here. It's a very specific component, so maybe ok */}
    <Box sx={{ display: "flex" }}>
      <Button
        sx={{ flexBasis: 1, flexGrow: 1 }}
        // @todo Consider if this Component should not rather receive a callback without parameter
        onClick={() => onConfirm(selected)}
      >
        OK
      </Button>
      <Button sx={{ flexBasis: 1, flexGrow: 1 }} onClick={onDeselect}>
        Cancel
      </Button>
    </Box>
  </Box>
);

const MoveOption = ({
  mos,
  selected,
  position,
  onSelect,
  onDeselect,
  onConfirm,
}: {
  mos: moveOption[];
  selected: moveOption | null;
  position: foPositionsAttributes;
  onSelect: (selected: moveOption) => void;
  onDeselect: () => void;
  onConfirm: (selected: moveOption) => void;
}) => {
  const hasDamaged = useMemo(
    () => mos[0].foDamages.some((dmg) => dmg.wearPoints > 0),
    [mos]
  );
  const isSelected = selected?.foPositionId == position.id;
  return (
    <ClickAwayListener onClickAway={() => onDeselect()}>
      {/* The div helps handling ClickAwayListener properly, otherwise clicking the tootlip would trigger onClickAway */}
      <div>
        <Tooltip
          // @todo How to confirm selection if no damage MOs? Consider either rendering the damage table anyway, but only having the buttons or double click (but double click could happen by mistake)
          open={isSelected && hasDamaged}
          title={
            <MoveOptionDamageTable
              mos={mos}
              selected={selected}
              onSelect={onSelect}
              onDeselect={onDeselect}
              onConfirm={onConfirm}
            />
          }
        >
          <CarSprite
            src={`/resources/formula/move-options/${getMoImageSrc(
              isSelected,
              // @todo If MO will only contains traverse (& movesLeft?), will need to calculate the damage, probably do it in useMemo prior to here
              // If there are multiple MOs selected or if only one selected and it has damage, use damage MO icon
              hasDamaged
            )}`}
            position={position}
            onClick={() => onSelect(mos[0])}
            sx={{ cursor: "pointer" }}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

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
            // If a MO is selected, display only it, otherwise display all
            (selected == null || selected.foPositionId == positionId) && (
              <MoveOption
                key={positionId}
                mos={mos}
                position={track.foPositions.find((pos) => pos.id == positionId)}
                selected={selected}
                onSelect={setSelected}
                onDeselect={() => setSelected(null)}
                // @todo Consider how to do these callbacks. There is a bit of props drilling, but it might make sense here
                onConfirm={(mo: moveOption) =>
                  console.log(`selected: [${mo.traverse.join(" ")}]`)
                }
              />
            )
        )}
      </Box>
    )
  );
};

export default FormulaGameBoard;
