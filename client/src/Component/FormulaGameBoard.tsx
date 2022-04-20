import {
  Box,
  BoxProps,
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
import { foPositionsAttributes } from "../../../common/src/models/generated/foPositions";
import {
  fullFormulaGame,
  fullTrack,
  moveOption,
} from "../../../common/src/models/interfaces/formula";
import {
  SelectedMoSprite,
  DamageMoSprite,
  NoDamageMoSprite,
  TraverseMoSprite,
  CarSprite,
  DebrisSprite,
} from "./FormulaTrackObjectSprites";

interface TrackObjectWrapperProps extends BoxProps {
  foPosition: foPositionsAttributes;
  onClick?: () => void;
  sx?: SxProps;
}

const TrackObjectWrapper = React.forwardRef(
  ({ foPosition, onClick, sx, ...props }: TrackObjectWrapperProps, ref) => (
    <Box
      height="1.2%"
      width="1.2%"
      position={"absolute"}
      left={`${foPosition.posX / 1000 - 0.6}%`}
      top={`${foPosition.posY / 1000 - 0.6}%`}
      sx={{
        transform: `rotate(${foPosition.angle}rad)`,
        ...sx,
      }}
      onClick={onClick}
      {...props}
      ref={ref}
    ></Box>
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
        tires: mo.damages.tire,
        brakes: mo.damages.brakes,
        shocks: mo.damages.shocks,
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
    () =>
      mos[0].damages.tire > 0 ||
      mos[0].damages.brakes > 0 ||
      mos[0].damages.chassis > 0 ||
      mos[0].damages.shocks > 0,
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
          <TrackObjectWrapper
            foPosition={position}
            onClick={() => onSelect(mos[0])}
            sx={{ cursor: "pointer" }}
          >
            {isSelected ? (
              <SelectedMoSprite />
            ) : hasDamaged ? (
              <DamageMoSprite />
            ) : (
              <NoDamageMoSprite />
            )}
          </TrackObjectWrapper>
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
          <TrackObjectWrapper
            key={debris.id}
            foPosition={track.foPositions.find(
              (position) => position.id == debris.foPositionId
            )}
            sx={{ opacity: 0.8 }}
          >
            <DebrisSprite />
          </TrackObjectWrapper>
        ))}
        {game.foCars.map((car, index) => (
          <TrackObjectWrapper
            key={car.id}
            foPosition={track.foPositions.find(
              (position) => position.id == car.foPositionId
            )}
            // @todo When moving on board is functional, consider using sx transition on car's left and top
          >
            <CarSprite carIndex={index} />
          </TrackObjectWrapper>
        ))}
        {selected?.traverse?.map((positionId) => (
          <TrackObjectWrapper
            key={positionId}
            foPosition={track.foPositions.find(
              (position) => position.id == positionId
            )}
          >
            <TraverseMoSprite />
          </TrackObjectWrapper>
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
                // @todo Consider refactoring the MO object, it only needs traverse info, the moves left can be pulled from the lastMove on game object
                onConfirm={onSelectMO}
              />
            )
        )}
      </Box>
    )
  );
};

export default FormulaGameBoard;
