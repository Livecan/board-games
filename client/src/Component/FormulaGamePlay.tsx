import { Box, Grid, Theme, useMediaQuery } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  fullFormulaGame,
  fullTrack,
} from "../../../common/src/models/interfaces/formula";
import commonConfig from "../../../common/src/config/config";

const getCarImageSrc = (carIndex: number) =>
  `${Math.trunc(carIndex / 2) + 1}${carIndex % 2 == 0 ? "a" : "b"}.png`;

const FormulaGamePlay = ({
  gameId,
  game,
}: {
  gameId: number;
  game: fullFormulaGame;
}) => {
  const [track, setTrack] = useState<fullTrack>(null);

  useEffect(() => {
    axios
      .get(`/${commonConfig.apiBaseUrl}formula/${gameId}/track`)
      .then((res) => setTrack(res.data));
  }, [game.foTrackId]);

  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  return (
    <Grid container>
      <Grid item xs={12} sm={9} height="100vh" overflow="auto">
        {track != null && (
          <Box sx={{ position: "relative" }} width={isMd ? "300%" : "400%"}>
            <Box
              component="img"
              src="/resources/formula/tracks/monaco.jpg"
              width="100%"
            />
            {game.foCars.map((car, index) => {
              const position = track.foPositions.find(
                (position) => position.id == car.foPositionId
              );
              return (
                <Box
                  component="img"
                  src={`/resources/formula/cars/${getCarImageSrc(index)}`}
                  width="0.8%"
                  height="2%"
                  position="absolute"
                  left={`${position.posX / 1000 - 0.4}%`}
                  top={`${position.posY / 1000 - 1}%`}
                  sx={{
                    transform: `rotate(${position.angle - Math.PI / 2}rad)`,
                  }}
                />
              );
            })}
          </Box>
        )}
      </Grid>
      <Grid item xs={12} sm={3}>
        <div>Control panel</div>
      </Grid>
    </Grid>
  );
};

export default FormulaGamePlay;
