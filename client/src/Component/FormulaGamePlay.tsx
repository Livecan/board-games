import { Box, Grid, Theme, useMediaQuery } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  fullFormulaGame,
  fullTrack,
} from "../../../common/src/models/interfaces/formula";
import commonConfig from "../../../common/src/config/config";
import LoginContext from "../Context/LoginContext";
import { foPositionsAttributes } from "../../../common/src/models/generated/foPositions";

const getCarImageSrc = (carIndex: number) =>
  `${Math.trunc(carIndex / 2) + 1}${carIndex % 2 == 0 ? "a" : "b"}.png`;

const getMoImageSrc = (isSelected: boolean, isDamaged: boolean) =>
  `car-outline-${
    isSelected ? "selected" : isDamaged ? "damage" : "nodamage"
  }.svg`;

const CarSprite = (props: {
  src: string;
  position: foPositionsAttributes;
  onClick?: () => void;
}) => (
  <Box
    component="img"
    src={props.src}
    height="1.2%"
    width="1.2%"
    position="absolute"
    left={`${props.position.posX / 1000 - 0.6}%`}
    top={`${props.position.posY / 1000 - 0.6}%`}
    sx={{
      transform: `rotate(${props.position.angle}rad)`,
      cursor: "pointer",
    }}
    onClick={props.onClick}
  />
);

const FormulaTrackBoard = ({ game }: { game: fullFormulaGame }) => {
  const [userData] = useContext(LoginContext);
  const [track, setTrack] = useState<fullTrack>(null);
  const [availableMOs, setAvailableMOs] = useState(null);
  const [selectedMO, setSelectedMO] = useState(null);

  useEffect(() => {
    axios
      .get(`/${commonConfig.apiBaseUrl}formula/${game.id}/track`)
      .then((res) => setTrack(res.data));
  }, [game.foTrackId]);

  useEffect(() => {
    const nextCar = game.foCars.find((car) => car.id == game.lastTurn.foCarId);
    if (nextCar.userId == userData.user.id && game.lastTurn.roll != null) {
      axios
        .get(
          `/${commonConfig.apiBaseUrl}formula/${game.id}/car/${nextCar.id}/moveOptions`,
          {
            headers: {
              Authorization: userData.jwt,
              accept: "application/json",
            },
          }
        )
        .then((response) => setAvailableMOs(response.data));
    } else {
      setAvailableMOs(null);
    }
  }, [game.foCars]);

  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  return (
    track != null && (
      <Box sx={{ position: "relative" }} width={isMd ? "300%" : "400%"}>
        <Box
          component="img"
          src="/resources/formula/tracks/monaco.jpg"
          width="100%"
        />
        {game.foCars.map((car, index) => (
          <CarSprite
            key={index}
            src={`/resources/formula/cars/${getCarImageSrc(index)}`}
            position={track.foPositions.find(
              (position) => position.id == car.foPositionId
            )}
          />
        ))}
        {availableMOs?.map((mo, index) => (
          <CarSprite
            key={index}
            src={`/resources/formula/move-options/${getMoImageSrc(
              mo == selectedMO,
              mo.foDamages.some((damage) => damage.wearPoints > 0)
            )}`}
            position={track.foPositions.find(
              (position) => position.id == mo.foPositionId
            )}
            onClick={() => setSelectedMO(mo)}
          />
        ))}
      </Box>
    )
  );
};

const FormulaGamePlay = ({
  gameId,
  game,
}: {
  gameId: number;
  game: fullFormulaGame;
}) => (
  <Grid container>
    <Grid item xs={12} sm={9} height="100vh" overflow="auto">
      <FormulaTrackBoard game={game} />
    </Grid>
    <Grid item xs={12} sm={3}>
      <div>Control panel</div>
    </Grid>
  </Grid>
);

export default FormulaGamePlay;
