import React, { useContext, useEffect, useMemo } from "react";
import axios from "axios";
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
import commonConfig from "../../../common/src/config/config";
import LoginContext from "../Context/LoginContext";
import { gamesAttributes } from "../../../common/src/models/generated/games";
import { gamesUsersAttributes } from "../../../common/src/models/generated/gamesUsers";
import { foGamesAttributes } from "../../../common/src/models/generated/foGames";
import useDebouncedState from "../Hook/UseDebouncedState";
import { car, formulaGame, fullFormulaGame } from "../Page/FormulaPage";

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

const PositiveNumberValidator = (value: number) => value > 0;

type ValidatedNumberTextFieldProps = TextFieldProps & {
  onChange?: (value: number) => void;
  validate?: (value: number) => Boolean;
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
      (validate == null || validate(new Number(e.target.value).valueOf())) &&
      onChange?.(new Number(e.target.value).valueOf())
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
  const [userData] = useContext(LoginContext);
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
      // @todo Use this for the deep copy insted: structuredClone(cars);
      // Only released recently - Feb/Mar 2022, so no wide support yet.
      let updatedCars = cars.map(car => {
        const updatedCar = {...car};
        updatedCar.foDamages = car.foDamages.map(damage => { return {...damage} });
        return updatedCar;
      });
      updatedCars
        .find((car) => car.id == carId)
        .foDamages.find((damage) => damage.type == damageType).wearPoints =
        wearPoints;

      return updatedCars;
    });
  };

  // Whenever the user changes car damages new diff is calculated. This is
  // triggered by the debounced value of cars and will serve as a trigger for
  // making the server request for changing cars
  // If in future expected changes of cars via changed props, need to make a
  // useEffect(do setCars(props.cars), [props.cars])
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
    }
  }, [diffCars]);

  // Ready state change needs to be triggered by a props.readyState. This is in
  // case when e.g. game setup changes and all users' ready states were
  // automatically reset.
  useEffect(() => {
    setReadyState(props.readyState && readyState);
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
          currentState={props.readyState || readyState}
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
                    updateCarDamage(car.id, damage.type, value)
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

const GameSetup = (props: {
  game: formulaGame;
  gameUsers: gamesUsersAttributes[];
}) => {
  const [userData] = useContext(LoginContext);
  const [debouncedGame, setGame, game] = useDebouncedState<
    gamesAttributes & foGamesAttributes
  >(props.game);

  const isCreator = userData?.user?.id == game.creatorId;

  const startGame = () => {
    axios.post(
      `/${commonConfig.apiBaseUrl}formula/${props.game.id}/start`,
      {},
      {
        headers: {
          Authorization: userData.jwt,
          accept: "application/json",
        },
      }
    );
  };

  useEffect(() => {
    if (debouncedGame != props.game) {
      axios.post(
        `/${commonConfig.apiBaseUrl}formula/${props.game.id}/setup`,
        debouncedGame,
        {
          headers: {
            Authorization: userData.jwt,
            accept: "application/json",
          },
        }
      );
    }
  }, [debouncedGame]);

  return (
    <Paper elevation={4} sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Select defaultValue={props.game.foTrackId} disabled={!isCreator}>
          <MenuItem value={1}>Monaco</MenuItem>
        </Select>
        <FlexBox>
          <Typography display="inline" sx={{ flexGrow: 1 }}>
            Players
          </Typography>
          <ValidatedNumberTextField
            placeholder="min"
            value={(isCreator ? game : props.game).minPlayers ?? ""}
            validate={(value) =>
              PositiveNumberValidator(value) && value < game.maxPlayers
            }
            onChange={(value) =>
              setGame((game) => {
                return { ...game, minPlayers: value };
              })
            }
            disabled={!isCreator}
          />
          <Typography display="inline">-</Typography>
          <ValidatedNumberTextField
            placeholder="max"
            value={(isCreator ? game : props.game).maxPlayers ?? ""}
            validate={(value) =>
              PositiveNumberValidator(value) && value > (game.minPlayers ?? 1)
            }
            onChange={(value) =>
              setGame((game) => {
                return { ...game, maxPlayers: value };
              })
            }
            disabled={!isCreator}
          />
        </FlexBox>
        <FlexBox>
          <Typography display="inline">Laps</Typography>
          <ValidatedNumberTextField
            value={(isCreator ? game : props.game).laps}
            validate={PositiveNumberValidator}
            onChange={(value) =>
              setGame((game) => {
                return { ...game, laps: value };
              })
            }
            disabled={!isCreator}
          />
        </FlexBox>
        <FlexBox>
          <Typography display="inline">Wear Points</Typography>
          <ValidatedNumberTextField
            value={(isCreator ? game : props.game).wearPoints}
            validate={PositiveNumberValidator}
            onChange={(value) =>
              setGame((game) => {
                return { ...game, wearPoints: value };
              })
            }
            disabled={!isCreator}
          />
        </FlexBox>
        <FlexBox>
          <Typography display="inline">Cars per player</Typography>
          <ValidatedNumberTextField
            value={(isCreator ? game : props.game).carsPerPlayer}
            validate={PositiveNumberValidator}
            onChange={(value) =>
              setGame((game) => {
                return { ...game, carsPerPlayer: value };
              })
            }
            disabled={!isCreator}
          />
        </FlexBox>
        {/* @todo Move constant to an enum somewhere */}
        {isCreator && (
          <Button
            variant="contained"
            onClick={startGame}
            disabled={
              !props.gameUsers.every((gameUser) => gameUser.readyState == "R")
            }
          >
            Start
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

const FormulaSetup = ({
  gameId,
  game,
}: {
  gameId: number;
  game: fullFormulaGame;
}) =>
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
          <GameSetup game={game} gameUsers={game.gamesUsers} />
        </Grid>
      </Grid>
    </Grid>
  );

export default FormulaSetup;
