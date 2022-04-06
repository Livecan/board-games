import type { Sequelize } from "sequelize";
import { drResults as _drResults } from "./drResults";
import type { drResultsAttributes, drResultsCreationAttributes } from "./drResults";
import { drTokenStates as _drTokenStates } from "./drTokenStates";
import type { drTokenStatesAttributes, drTokenStatesCreationAttributes } from "./drTokenStates";
import { drTokens as _drTokens } from "./drTokens";
import type { drTokensAttributes, drTokensCreationAttributes } from "./drTokens";
import { drTokensGames as _drTokensGames } from "./drTokensGames";
import type { drTokensGamesAttributes, drTokensGamesCreationAttributes } from "./drTokensGames";
import { drTurns as _drTurns } from "./drTurns";
import type { drTurnsAttributes, drTurnsCreationAttributes } from "./drTurns";
import { foCars as _foCars } from "./foCars";
import type { foCarsAttributes, foCarsCreationAttributes } from "./foCars";
import { foCurves as _foCurves } from "./foCurves";
import type { foCurvesAttributes, foCurvesCreationAttributes } from "./foCurves";
import { foDamages as _foDamages } from "./foDamages";
import type { foDamagesAttributes, foDamagesCreationAttributes } from "./foDamages";
import { foDebris as _foDebris } from "./foDebris";
import type { foDebrisAttributes, foDebrisCreationAttributes } from "./foDebris";
import { foEDamageTypes as _foEDamageTypes } from "./foEDamageTypes";
import type { foEDamageTypesAttributes, foEDamageTypesCreationAttributes } from "./foEDamageTypes";
import { foGames as _foGames } from "./foGames";
import type { foGamesAttributes, foGamesCreationAttributes } from "./foGames";
import { foLogs as _foLogs } from "./foLogs";
import type { foLogsAttributes, foLogsCreationAttributes } from "./foLogs";
import { foPosition2Positions as _foPosition2Positions } from "./foPosition2Positions";
import type { foPosition2PositionsAttributes, foPosition2PositionsCreationAttributes } from "./foPosition2Positions";
import { foPositions as _foPositions } from "./foPositions";
import type { foPositionsAttributes, foPositionsCreationAttributes } from "./foPositions";
import { foTracks as _foTracks } from "./foTracks";
import type { foTracksAttributes, foTracksCreationAttributes } from "./foTracks";
import { foTurns as _foTurns } from "./foTurns";
import type { foTurnsAttributes, foTurnsCreationAttributes } from "./foTurns";
import { gameStates as _gameStates } from "./gameStates";
import type { gameStatesAttributes, gameStatesCreationAttributes } from "./gameStates";
import { gameTypes as _gameTypes } from "./gameTypes";
import type { gameTypesAttributes, gameTypesCreationAttributes } from "./gameTypes";
import { games as _games } from "./games";
import type { gamesAttributes, gamesCreationAttributes } from "./games";
import { gamesUsers as _gamesUsers } from "./gamesUsers";
import type { gamesUsersAttributes, gamesUsersCreationAttributes } from "./gamesUsers";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _drResults as drResults,
  _drTokenStates as drTokenStates,
  _drTokens as drTokens,
  _drTokensGames as drTokensGames,
  _drTurns as drTurns,
  _foCars as foCars,
  _foCurves as foCurves,
  _foDamages as foDamages,
  _foDebris as foDebris,
  _foEDamageTypes as foEDamageTypes,
  _foGames as foGames,
  _foLogs as foLogs,
  _foPosition2Positions as foPosition2Positions,
  _foPositions as foPositions,
  _foTracks as foTracks,
  _foTurns as foTurns,
  _gameStates as gameStates,
  _gameTypes as gameTypes,
  _games as games,
  _gamesUsers as gamesUsers,
  _users as users,
};

export type {
  drResultsAttributes,
  drResultsCreationAttributes,
  drTokenStatesAttributes,
  drTokenStatesCreationAttributes,
  drTokensAttributes,
  drTokensCreationAttributes,
  drTokensGamesAttributes,
  drTokensGamesCreationAttributes,
  drTurnsAttributes,
  drTurnsCreationAttributes,
  foCarsAttributes,
  foCarsCreationAttributes,
  foCurvesAttributes,
  foCurvesCreationAttributes,
  foDamagesAttributes,
  foDamagesCreationAttributes,
  foDebrisAttributes,
  foDebrisCreationAttributes,
  foEDamageTypesAttributes,
  foEDamageTypesCreationAttributes,
  foGamesAttributes,
  foGamesCreationAttributes,
  foLogsAttributes,
  foLogsCreationAttributes,
  foPosition2PositionsAttributes,
  foPosition2PositionsCreationAttributes,
  foPositionsAttributes,
  foPositionsCreationAttributes,
  foTracksAttributes,
  foTracksCreationAttributes,
  foTurnsAttributes,
  foTurnsCreationAttributes,
  gameStatesAttributes,
  gameStatesCreationAttributes,
  gameTypesAttributes,
  gameTypesCreationAttributes,
  gamesAttributes,
  gamesCreationAttributes,
  gamesUsersAttributes,
  gamesUsersCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const drResults = _drResults.initModel(sequelize);
  const drTokenStates = _drTokenStates.initModel(sequelize);
  const drTokens = _drTokens.initModel(sequelize);
  const drTokensGames = _drTokensGames.initModel(sequelize);
  const drTurns = _drTurns.initModel(sequelize);
  const foCars = _foCars.initModel(sequelize);
  const foCurves = _foCurves.initModel(sequelize);
  const foDamages = _foDamages.initModel(sequelize);
  const foDebris = _foDebris.initModel(sequelize);
  const foEDamageTypes = _foEDamageTypes.initModel(sequelize);
  const foGames = _foGames.initModel(sequelize);
  const foLogs = _foLogs.initModel(sequelize);
  const foPosition2Positions = _foPosition2Positions.initModel(sequelize);
  const foPositions = _foPositions.initModel(sequelize);
  const foTracks = _foTracks.initModel(sequelize);
  const foTurns = _foTurns.initModel(sequelize);
  const gameStates = _gameStates.initModel(sequelize);
  const gameTypes = _gameTypes.initModel(sequelize);
  const games = _games.initModel(sequelize);
  const gamesUsers = _gamesUsers.initModel(sequelize);
  const users = _users.initModel(sequelize);

  drTokensGames.belongsTo(drTokenStates, { as: "drTokenState", foreignKey: "drTokenStateId"});
  drTokenStates.hasMany(drTokensGames, { as: "drTokensGames", foreignKey: "drTokenStateId"});
  drTokensGames.belongsTo(drTokens, { as: "drToken", foreignKey: "drTokenId"});
  drTokens.hasMany(drTokensGames, { as: "drTokensGames", foreignKey: "drTokenId"});
  foDamages.belongsTo(foCars, { as: "foCar", foreignKey: "foCarId"});
  foCars.hasMany(foDamages, { as: "foDamages", foreignKey: "foCarId"});
  foLogs.belongsTo(foCars, { as: "foCar", foreignKey: "foCarId"});
  foCars.hasMany(foLogs, { as: "foLogs", foreignKey: "foCarId"});
  foTurns.belongsTo(foCars, { as: "foCar", foreignKey: "foCarId"});
  foCars.hasMany(foTurns, { as: "foTurns", foreignKey: "foCarId"});
  foCars.belongsTo(foCurves, { as: "foCurve", foreignKey: "foCurveId"});
  foCurves.hasMany(foCars, { as: "foCars", foreignKey: "foCurveId"});
  foCurves.belongsTo(foCurves, { as: "foNextCurve", foreignKey: "foNextCurveId"});
  foCurves.hasMany(foCurves, { as: "foCurves", foreignKey: "foNextCurveId"});
  foPositions.belongsTo(foCurves, { as: "foCurve", foreignKey: "foCurveId"});
  foCurves.hasMany(foPositions, { as: "foPositions", foreignKey: "foCurveId"});
  foDamages.belongsTo(foLogs, { as: "foLog", foreignKey: "foLogId"});
  foLogs.hasMany(foDamages, { as: "foDamages", foreignKey: "foLogId"});
  foCars.belongsTo(foPositions, { as: "foPosition", foreignKey: "foPositionId"});
  foPositions.hasMany(foCars, { as: "foCars", foreignKey: "foPositionId"});
  foDebris.belongsTo(foPositions, { as: "foPosition", foreignKey: "foPositionId"});
  foPositions.hasMany(foDebris, { as: "foDebris", foreignKey: "foPositionId"});
  foLogs.belongsTo(foPositions, { as: "foPosition", foreignKey: "foPositionId"});
  foPositions.hasMany(foLogs, { as: "foLogs", foreignKey: "foPositionId"});
  foPosition2Positions.belongsTo(foPositions, { as: "foPositionFrom", foreignKey: "foPositionFromId"});
  foPositions.hasMany(foPosition2Positions, { as: "foPosition2Positions", foreignKey: "foPositionFromId"});
  foPosition2Positions.belongsTo(foPositions, { as: "foPositionTo", foreignKey: "foPositionToId"});
  foPositions.hasMany(foPosition2Positions, { as: "foPositionToFoPosition2Positions", foreignKey: "foPositionToId"});
  foTurns.belongsTo(foPositions, { as: "foPosition", foreignKey: "foPositionId"});
  foPositions.hasMany(foTurns, { as: "foTurns", foreignKey: "foPositionId"});
  foCurves.belongsTo(foTracks, { as: "foTrack", foreignKey: "foTrackId"});
  foTracks.hasMany(foCurves, { as: "foCurves", foreignKey: "foTrackId"});
  foGames.belongsTo(foTracks, { as: "foTrack", foreignKey: "foTrackId"});
  foTracks.hasMany(foGames, { as: "foGames", foreignKey: "foTrackId"});
  foPositions.belongsTo(foTracks, { as: "foTrack", foreignKey: "foTrackId"});
  foTracks.hasMany(foPositions, { as: "foPositions", foreignKey: "foTrackId"});
  games.belongsTo(gameStates, { as: "gameState", foreignKey: "gameStateId"});
  gameStates.hasMany(games, { as: "games", foreignKey: "gameStateId"});
  games.belongsTo(gameTypes, { as: "gameType", foreignKey: "gameTypeId"});
  gameTypes.hasMany(games, { as: "games", foreignKey: "gameTypeId"});
  drResults.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(drResults, { as: "drResults", foreignKey: "gameId"});
  drTokensGames.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(drTokensGames, { as: "drTokensGames", foreignKey: "gameId"});
  drTurns.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(drTurns, { as: "drTurns", foreignKey: "gameId"});
  foCars.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(foCars, { as: "foCars", foreignKey: "gameId"});
  foDebris.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(foDebris, { as: "foDebris", foreignKey: "gameId"});
  foGames.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasOne(foGames, { as: "foGame", foreignKey: "gameId"});
  foTurns.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(foTurns, { as: "foTurns", foreignKey: "gameId"});
  gamesUsers.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(gamesUsers, { as: "gamesUsers", foreignKey: "gameId"});
  drResults.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(drResults, { as: "drResults", foreignKey: "userId"});
  drTokensGames.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(drTokensGames, { as: "drTokensGames", foreignKey: "userId"});
  drTurns.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(drTurns, { as: "drTurns", foreignKey: "userId"});
  foCars.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(foCars, { as: "foCars", foreignKey: "userId"});
  games.belongsTo(users, { as: "creator", foreignKey: "creatorId"});
  users.hasMany(games, { as: "games", foreignKey: "creatorId"});
  gamesUsers.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(gamesUsers, { as: "gamesUsers", foreignKey: "userId"});
  gamesUsers.belongsTo(users, { as: "nextUser", foreignKey: "nextUserId"});
  users.hasMany(gamesUsers, { as: "nextUserGamesUsers", foreignKey: "nextUserId"});

  return {
    drResults: drResults,
    drTokenStates: drTokenStates,
    drTokens: drTokens,
    drTokensGames: drTokensGames,
    drTurns: drTurns,
    foCars: foCars,
    foCurves: foCurves,
    foDamages: foDamages,
    foDebris: foDebris,
    foEDamageTypes: foEDamageTypes,
    foGames: foGames,
    foLogs: foLogs,
    foPosition2Positions: foPosition2Positions,
    foPositions: foPositions,
    foTracks: foTracks,
    foTurns: foTurns,
    gameStates: gameStates,
    gameTypes: gameTypes,
    games: games,
    gamesUsers: gamesUsers,
    users: users,
  };
}
