import {
  Box,
  Grid,
  Stack,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
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

const CarSprite = ({
  src,
  position,
  onClick,
}: {
  src: string;
  position: foPositionsAttributes;
  onClick?: () => void;
}) => (
  <Box
    component="img"
    src={src}
    height="1.2%"
    width="1.2%"
    position={"absolute"}
    // @todo If these are used, can I use it in Game Panel?
    left={`${position.posX / 1000 - 0.6}%`}
    top={`${position.posY / 1000 - 0.6}%`}
    // @todo How to do this styling?
    sx={{
      transform: `rotate(${position.angle}rad)`,
      // @todo Figure out if we want all these
      cursor: "pointer",
    }}
    onClick={onClick}
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
      {/* @todo Move the following into a separate Game Panel info component */}
      <Stack>
        {game.foCars.map((car) => (
          <React.Fragment key={car.id}>
            <Typography>
              {game.gamesUsers.find((u) => (u.id = car.userId)).user.name}
            </Typography>
            <Stack direction="row">
              {car.foDamages.map((damage) => (
                <TextField
                  // @todo This much styling here in code looks like an antipattern and might clash with other styling, think of some single source of truth
                  inputProps={{
                    style: {
                      paddingLeft: 0,
                      paddingRight: 0,
                      textAlign: "center",
                    },
                  }}
                  value={damage.wearPoints}
                />
              ))}
            </Stack>
          </React.Fragment>
        ))}
      </Stack>
    </Grid>
  </Grid>
);

export default FormulaGamePlay;
