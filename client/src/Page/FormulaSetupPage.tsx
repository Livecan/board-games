import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import {
  Box,
  BoxProps,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import useWebSocket from "../Hook/UseWebSocketHook";
import commonConfig from "../../../common/src/config/config";
import loginContext from "../Context/LoginContext";
import { gamesAttributes } from "../../../common/src/models/generated/games";
import { foCarsAttributes } from "../../../common/src/models/generated/foCars";
import { gamesUsersAttributes } from "../../../common/src/models/generated/gamesUsers";
import { foGamesAttributes } from "../../../common/src/models/generated/foGames";
import { foDamages } from "../../../common/src/models/generated/foDamages";
import { usersAttributes } from "../../../common/src/models/generated/users";

interface fullGame extends gamesAttributes, foGamesAttributes {
  foCars: (foCarsAttributes & { foDamages: foDamages[] })[];
  gamesUsers: (gamesUsersAttributes & { user: usersAttributes })[];
}

const FlexBox = ({ sx = {}, children = {}, ...rest }: BoxProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Box>
);

const PositiveNumberValidator = (value: string) => parseInt(value) > 0;

type ValidatedNumberTextFieldProps = TextFieldProps & {
  onChange?: (value: string) => void;
  validate?: (value: string) => Boolean;
};

const ValidatedNumberTextField = ({
  sx = {},
  inputProps = {},
  style = {},
  onChange = null,
  validate = null,
  ...rest
}: ValidatedNumberTextFieldProps) => (
  <TextField
    sx={{ margin: ".1rem", ...sx }}
    inputProps={{
      style: { textAlign: "right" },
      type: "number",
      min: 0,
      step: 1,
      ...inputProps,
    }}
    style={{ width: "4rem", ...style }}
    onChange={(e) =>
      (validate == null || validate(e.target.value)) &&
      onChange?.(e.target.value)
    }
    {...rest}
  />
);

const UserReadyButton = ({
  isCurrentUser,
  isEnabled,
  currentState = false,
  onClick = null,
}: {
  isCurrentUser: boolean;
  isEnabled: boolean;
  currentState: boolean;
  onClick?: (isReady: boolean) => void;
}) =>
  isCurrentUser ? (
    <IconButton
      disabled={!isEnabled}
      onClick={() => isEnabled && onClick?.(!currentState)}
    >
      {!isEnabled ? (
        <CancelOutlinedIcon color="disabled" fontSize="large" />
      ) : currentState ? (
        <CheckCircleOutlinedIcon color="success" fontSize="large" />
      ) : (
        <CancelOutlinedIcon color="error" fontSize="large" />
      )}
    </IconButton>
  ) : currentState ? (
    <CheckCircleOutlinedIcon color="success" fontSize="large" />
  ) : (
    <CancelOutlinedIcon color="error" fontSize="large" />
  );

const FormulaSetupPage: React.FC = () => {
  const [userData] = useContext(loginContext);
  const { gameId } = useParams();
  const [game, setGame] = useState<fullGame>(null);
  const [gameUpdates, setGameUpdates] = useState<
    gamesAttributes & foGamesAttributes
  >(null);
  const [carUpdates, setCarUpdates] = useState<
    { carId: number; foDamages: { type: number; wearPoints: number }[] }[]
  >([]);
  const [updateReadyState, setUpdateReadyState] = useState<boolean>(null);

  const isUserCarsWearPointsAddUp = useMemo(() => {
    return (
      game != null &&
      game.foCars
        .filter((car) => car.userId == userData?.user.id)
        .slice(0, game.carsPerPlayer)
        .every(
          (car) =>
            car.foDamages.reduce(
              (carry, current) => carry + current.wearPoints,
              0
            ) == game.wearPoints
        )
    );
  }, [game, carUpdates]);

  // The !! is for casting Boolean -> boolean
  // @todo Move the readyState magic value in enum
  const isCurrentUserReady = () =>
    !!(
      updateReadyState ||
      (updateReadyState == null &&
        game.gamesUsers.find((gameUser) => gameUser.userId == userData?.user.id)
          .readyState == "R")
    );

  const updateCarDamage = (
    carId: number,
    damageType: number,
    wearPoints: number
  ) => {
    setCarUpdates((carUpdates) => {
      let updateValue = [...carUpdates];
      let currentCar = updateValue.find((car) => car.carId == carId);
      if (currentCar == null) {
        currentCar = { carId: carId, foDamages: [] };
        updateValue = [...updateValue, currentCar];
      }
      let currentDamage = currentCar.foDamages?.find(
        (damage) => damage.type == damageType
      );
      if (currentDamage == null) {
        currentDamage = { type: damageType, wearPoints: 0 };
        currentCar.foDamages = [...currentCar.foDamages, currentDamage];
      }
      currentDamage.wearPoints = wearPoints;

      return updateValue;
    });
  };

  const debouncedUpdate = useDebounce(gameUpdates, 1000);
  const debouncedCarUpdate = useDebounce(carUpdates, 1000);
  const debouncedReadyState = useDebounce(updateReadyState, 1000);

  useEffect(() => {
    axios.post(
      `/${commonConfig.apiBaseUrl}formula/${gameId}/setup`,
      debouncedUpdate,
      {
        headers: {
          Authorization: userData.jwt,
          accept: "application/json",
        },
      }
    );
  }, [debouncedUpdate]);

  useEffect(() => {
    for (const carUpdate of debouncedCarUpdate) {
      axios.post(
        `/${commonConfig.apiBaseUrl}formula/${gameId}/setup/car/${carUpdate.carId}`,
        carUpdate.foDamages.map((damage) => {
          return { type: damage.type, wearPoints: damage.wearPoints };
        }),
        {
          headers: {
            Authorization: userData.jwt,
            accept: "application/json",
          },
        }
      );
      // @todo Consider removing update values that are current, to potentially save few server requests and writes?
    }
  }, [debouncedCarUpdate]);

  useEffect(() => {
    axios.post(
      `/${commonConfig.apiBaseUrl}formula/${gameId}/setup/ready`,
      {
        isReady: debouncedReadyState,
      },
      {
        headers: {
          Authorization: userData.jwt,
          accept: "application/json",
        },
      }
    );
  }, [debouncedReadyState]);

  useWebSocket(
    // @todo Move the url elsewhere???
    // @todo Change server routes - don't use setup, but use auto-routing
    // on server and the client decides how to display the data
    `ws://localhost:5000/${commonConfig.apiBaseUrl}formula/${gameId}/setup`,
    (msg: fullGame) => setGame(msg),
    {
      token: userData.jwt,
    }
  );

  const isCreator = userData?.user.id == game?.creatorId;

  return (
    game != null && (
      <Grid container>
        <Grid item xs={12} padding={2}>
          <Typography variant="h3">{game.name}</Typography>
        </Grid>
        <Grid container item xs={12}>
          {/** Car damages panel */}
          <Grid item xs={12} md={8} lg={9} padding={2}>
            <Stack spacing={2}>
              {game.gamesUsers.map((gameUser) => (
                <Paper key={gameUser.userId} elevation={4} sx={{ padding: 2 }}>
                  <FlexBox>
                    <Typography variant="h6">{`${gameUser.user.name}'s cars`}</Typography>
                    {/* @todo Move the readyState magic value in enum */}
                    <UserReadyButton
                      isCurrentUser={gameUser.userId == userData?.user.id}
                      isEnabled={isUserCarsWearPointsAddUp}
                      currentState={
                        (gameUser.userId == userData?.user.id &&
                          updateReadyState) ??
                        gameUser.readyState == "R"
                      }
                      onClick={(isReady) => setUpdateReadyState(isReady)}
                    />
                  </FlexBox>
                  <Stack spacing={2} padding={2}>
                    {game.foCars
                      .filter((car) => car.userId == gameUser.userId)
                      .slice(0, game.carsPerPlayer)
                      .map((car) => (
                        <Paper
                          key={car.id}
                          elevation={8}
                          sx={{ padding: 2, width: "fit-content" }}
                        >
                          <FlexBox
                            sx={{
                              justifyContent: "flexStart",
                              flexWrap: "wrap",
                            }}
                          >
                            {car.foDamages.map((damage) => (
                              /* @todo Use validation rules to avoid invalid numbers, validation test on backend */
                              /* @todo Only allow the user to change his/her own cars' damages */
                              <ValidatedNumberTextField
                                key={damage.type}
                                value={
                                  carUpdates
                                    ?.find((_car) => _car.carId == car.id)
                                    ?.foDamages?.find(
                                      (_damage) => _damage.type == damage.type
                                    )?.wearPoints ?? damage.wearPoints
                                }
                                validate={PositiveNumberValidator}
                                onChange={(value) =>
                                  updateCarDamage(
                                    car.id,
                                    damage.type,
                                    parseInt(value)
                                  )
                                }
                                disabled={gameUser.userId != userData.user.id}
                              />
                            ))}
                          </FlexBox>
                        </Paper>
                      ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>
          {/** Game setup panel */}
          <Grid item xs={12} md={4} lg={3} padding={2}>
            <Paper elevation={4} sx={{ padding: 2 }}>
              <Stack spacing={2}>
                <Select defaultValue={game.foTrackId}>
                  <MenuItem value={1}>Monaco</MenuItem>
                </Select>
                <FlexBox>
                  <Typography display="inline" sx={{ flexGrow: 1 }}>
                    Players
                  </Typography>
                  <ValidatedNumberTextField
                    placeholder="min"
                    value={gameUpdates?.minPlayers ?? game.minPlayers ?? ""}
                    validate={(value) =>
                      PositiveNumberValidator(value) &&
                      parseInt(value) <
                        (gameUpdates?.maxPlayers ?? game.maxPlayers)
                    }
                    onChange={(value) =>
                      setGameUpdates((game) => {
                        return { ...game, minPlayers: parseInt(value) };
                      })
                    }
                  />
                  <Typography display="inline">-</Typography>
                  <ValidatedNumberTextField
                    placeholder="max"
                    value={gameUpdates?.maxPlayers ?? game.maxPlayers ?? ""}
                    validate={(value) =>
                      PositiveNumberValidator(value) &&
                      parseInt(value) >
                        (gameUpdates?.minPlayers ?? game.minPlayers ?? 1)
                    }
                    onChange={(value) =>
                      setGameUpdates((game) => {
                        return { ...game, maxPlayers: parseInt(value) };
                      })
                    }
                  />
                </FlexBox>
                <FlexBox>
                  <Typography display="inline">Laps</Typography>
                  <ValidatedNumberTextField
                    value={gameUpdates?.laps ?? game.laps}
                    validate={PositiveNumberValidator}
                    onChange={(value) =>
                      setGameUpdates((game) => {
                        return { ...game, laps: parseInt(value) };
                      })
                    }
                  />
                </FlexBox>
                <FlexBox>
                  <Typography display="inline">Wear Points</Typography>
                  <ValidatedNumberTextField
                    value={gameUpdates?.wearPoints ?? game.wearPoints}
                    validate={PositiveNumberValidator}
                    onChange={(value) =>
                      setGameUpdates((game) => {
                        return { ...game, wearPoints: parseInt(value) };
                      })
                    }
                  />
                </FlexBox>
                <FlexBox>
                  <Typography display="inline">Cars per player</Typography>
                  <ValidatedNumberTextField
                    value={gameUpdates?.carsPerPlayer ?? game.carsPerPlayer}
                    validate={PositiveNumberValidator}
                    onChange={(value) =>
                      setGameUpdates((game) => {
                        return { ...game, carsPerPlayer: parseInt(value) };
                      })
                    }
                  />
                </FlexBox>
                {/* @todo Move constant to an enum somewhere */}
                <Button
                  variant="contained"
                  disabled={
                    !game.gamesUsers.every(
                      (gameUser) => gameUser.readyState == "R"
                    )
                  }
                >
                  Start
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    )
  );
};

export default FormulaSetupPage;
