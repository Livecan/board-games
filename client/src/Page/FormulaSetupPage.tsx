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
import useDebouncedState from "../Hook/UseDebouncedState";

interface car extends foCarsAttributes {
  foDamages: foDamages[];
}

interface formulaGame extends gamesAttributes, foGamesAttributes {
  foCars: car[];
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

const UserCars = (props: {
  userId: number;
  name: string;
  readyState: boolean;
  cars: car[];
  game: gamesAttributes & foGamesAttributes;
}) => {
  const [userData] = useContext(loginContext);
  const [debouncedCars, setCars, cars] = useDebouncedState<car[]>(
    props.cars,
    1000
  );
  const [debouncedReadyState, setReadyState, readyState] = useDebouncedState(
    props.readyState,
    1000
  );

  const isUserCarsWearPointsAddUp = useMemo(() => {
    return props.cars
      .slice(0, props.game.carsPerPlayer)
      .every(
        (car) =>
          car.foDamages.reduce(
            (carry, current) => carry + current.wearPoints,
            0
          ) == props.game.wearPoints
      );
  }, [props.cars, cars]);

  const updateCarDamage = (
    carId: number,
    damageType: number,
    wearPoints: number
  ) => {
    setCars((cars) => {
      let updatedCars = [...cars];
      updatedCars
        .find((car) => car.id == carId)
        .foDamages.find((damage) => damage.type == damageType).wearPoints =
        wearPoints;

      return updatedCars;
    });
  };

  const diffCars = useMemo(() => {
    const diff: car[] = [];
    for (const debouncedCar of debouncedCars) {
      for (const debouncedDamage of debouncedCar.foDamages) {
        const originalWearPoints = props.cars
          .find((car) => car.id == debouncedCar.id)
          .foDamages.find(
            (damage) => damage.type == debouncedDamage.type
          ).wearPoints;
        if (debouncedDamage.wearPoints != originalWearPoints) {
          let diffCar = diff.find((car) => car.id == debouncedCar.id);
          if (diffCar == null) {
            diffCar = { ...debouncedCar };
            diffCar.foDamages = [];
            diff.push(diffCar);
          }
          diffCar.foDamages.push(debouncedDamage);
        }
      }
    }
    return diff;
  }, [debouncedCars]);

  useEffect(() => {
    for (const carUpdate of diffCars) {
      axios.post(
        `/${commonConfig.apiBaseUrl}formula/${props.game.id}/setup/car/${carUpdate.id}`,
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
  }, [diffCars]);

  useEffect(() => {
    setReadyState(props.readyState);
  }, [props.readyState]);

  useEffect(() => {
    if (
      debouncedReadyState != null &&
      debouncedReadyState != props.readyState
    ) {
      axios.post(
        `/${commonConfig.apiBaseUrl}formula/${props.game.id}/setup/ready`,
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
    }
  }, [debouncedReadyState]);

  return (
    <Paper key={props.userId} elevation={4} sx={{ padding: 2 }}>
      <FlexBox>
        <Typography variant="h6">
          {props.userId === userData?.user?.id
            ? "Your cars"
            : `${props.name}'s cars`}
        </Typography>
        {/* @todo Move the readyState magic value in enum */}
        <UserReadyButton
          isCurrentUser={props.userId == userData?.user.id}
          isEnabled={isUserCarsWearPointsAddUp}
          currentState={readyState}
          onClick={(isReady) =>
            props.userId == userData?.user?.id && setReadyState(isReady)
          }
        />
      </FlexBox>
      <Stack spacing={2} padding={2}>
        {cars.slice(0, props.game.carsPerPlayer).map((car) => (
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
                // @todo Validate on backend
                <ValidatedNumberTextField
                  key={damage.type}
                  value={damage.wearPoints}
                  validate={PositiveNumberValidator}
                  onChange={(value) =>
                    props.userId == userData?.user?.id &&
                    updateCarDamage(car.id, damage.type, parseInt(value))
                  }
                  disabled={props.userId != userData.user.id}
                />
              ))}
            </FlexBox>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};

const FormulaSetupPage: React.FC = () => {
  const [userData] = useContext(loginContext);
  const { gameId } = useParams();
  const [game, setGame] = useState<formulaGame>(null);
  const [gameUpdates, setGameUpdates] = useState<
    gamesAttributes & foGamesAttributes
  >(null);

  const debouncedUpdate = useDebounce(gameUpdates, 1000);

  useEffect(() => {
    // @todo Consider doing diff between game and debouncedUpdate - less likely extra request calls
    if (debouncedUpdate != null) {
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
    }
  }, [debouncedUpdate]);

  useWebSocket(
    // @todo Move the url elsewhere???
    // @todo Change server routes - don't use setup, but use auto-routing
    // on server and the client decides how to display the data
    `ws://localhost:5000/${commonConfig.apiBaseUrl}formula/${gameId}/setup`,
    (msg: formulaGame) => setGame(msg),
    {
      token: userData.jwt,
    }
  );

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
                <UserCars
                  key={gameUser.userId}
                  userId={gameUser.userId}
                  name={gameUser.user.name}
                  // @todo Move magic constant into enums
                  readyState={gameUser.readyState == "R"}
                  cars={game.foCars.filter(
                    (car) => car.userId == gameUser.userId
                  )}
                  game={game}
                />
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
