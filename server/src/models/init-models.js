var DataTypes = require("sequelize").DataTypes;
var _dr_results = require("./dr_results");
var _dr_token_states = require("./dr_token_states");
var _dr_tokens = require("./dr_tokens");
var _dr_tokens_games = require("./dr_tokens_games");
var _dr_turns = require("./dr_turns");
var _fo_cars = require("./fo_cars");
var _fo_curves = require("./fo_curves");
var _fo_damages = require("./fo_damages");
var _fo_debris = require("./fo_debris");
var _fo_e_damage_types = require("./fo_e_damage_types");
var _fo_games = require("./fo_games");
var _fo_logs = require("./fo_logs");
var _fo_move_options = require("./fo_move_options");
var _fo_position2positions = require("./fo_position2positions");
var _fo_positions = require("./fo_positions");
var _fo_tracks = require("./fo_tracks");
var _fo_traverses = require("./fo_traverses");
var _game_states = require("./game_states");
var _game_types = require("./game_types");
var _games = require("./games");
var _games_users = require("./games_users");
var _users = require("./users");

function initModels(sequelize) {
  var dr_results = _dr_results(sequelize, DataTypes);
  var dr_token_states = _dr_token_states(sequelize, DataTypes);
  var dr_tokens = _dr_tokens(sequelize, DataTypes);
  var dr_tokens_games = _dr_tokens_games(sequelize, DataTypes);
  var dr_turns = _dr_turns(sequelize, DataTypes);
  var fo_cars = _fo_cars(sequelize, DataTypes);
  var fo_curves = _fo_curves(sequelize, DataTypes);
  var fo_damages = _fo_damages(sequelize, DataTypes);
  var fo_debris = _fo_debris(sequelize, DataTypes);
  var fo_e_damage_types = _fo_e_damage_types(sequelize, DataTypes);
  var fo_games = _fo_games(sequelize, DataTypes);
  var fo_logs = _fo_logs(sequelize, DataTypes);
  var fo_move_options = _fo_move_options(sequelize, DataTypes);
  var fo_position2positions = _fo_position2positions(sequelize, DataTypes);
  var fo_positions = _fo_positions(sequelize, DataTypes);
  var fo_tracks = _fo_tracks(sequelize, DataTypes);
  var fo_traverses = _fo_traverses(sequelize, DataTypes);
  var game_states = _game_states(sequelize, DataTypes);
  var game_types = _game_types(sequelize, DataTypes);
  var games = _games(sequelize, DataTypes);
  var games_users = _games_users(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  dr_tokens_games.belongsTo(dr_token_states, { as: "dr_token_state", foreignKey: "dr_token_state_id"});
  dr_token_states.hasMany(dr_tokens_games, { as: "dr_tokens_games", foreignKey: "dr_token_state_id"});
  dr_tokens_games.belongsTo(dr_tokens, { as: "dr_token", foreignKey: "dr_token_id"});
  dr_tokens.hasMany(dr_tokens_games, { as: "dr_tokens_games", foreignKey: "dr_token_id"});
  fo_damages.belongsTo(fo_cars, { as: "fo_car", foreignKey: "fo_car_id"});
  fo_cars.hasMany(fo_damages, { as: "fo_damages", foreignKey: "fo_car_id"});
  fo_logs.belongsTo(fo_cars, { as: "fo_car", foreignKey: "fo_car_id"});
  fo_cars.hasMany(fo_logs, { as: "fo_logs", foreignKey: "fo_car_id"});
  fo_move_options.belongsTo(fo_cars, { as: "fo_car", foreignKey: "fo_car_id"});
  fo_cars.hasMany(fo_move_options, { as: "fo_move_options", foreignKey: "fo_car_id"});
  fo_cars.belongsTo(fo_curves, { as: "fo_curve", foreignKey: "fo_curve_id"});
  fo_curves.hasMany(fo_cars, { as: "fo_cars", foreignKey: "fo_curve_id"});
  fo_curves.belongsTo(fo_curves, { as: "fo_next_curve", foreignKey: "fo_next_curve_id"});
  fo_curves.hasMany(fo_curves, { as: "fo_curves", foreignKey: "fo_next_curve_id"});
  fo_move_options.belongsTo(fo_curves, { as: "fo_curve", foreignKey: "fo_curve_id"});
  fo_curves.hasMany(fo_move_options, { as: "fo_move_options", foreignKey: "fo_curve_id"});
  fo_positions.belongsTo(fo_curves, { as: "fo_curve", foreignKey: "fo_curve_id"});
  fo_curves.hasMany(fo_positions, { as: "fo_positions", foreignKey: "fo_curve_id"});
  fo_damages.belongsTo(fo_logs, { as: "fo_log", foreignKey: "fo_log_id"});
  fo_logs.hasMany(fo_damages, { as: "fo_damages", foreignKey: "fo_log_id"});
  fo_damages.belongsTo(fo_move_options, { as: "fo_move_option", foreignKey: "fo_move_option_id"});
  fo_move_options.hasMany(fo_damages, { as: "fo_damages", foreignKey: "fo_move_option_id"});
  fo_traverses.belongsTo(fo_move_options, { as: "fo_move_option", foreignKey: "fo_move_option_id"});
  fo_move_options.hasMany(fo_traverses, { as: "fo_traverses", foreignKey: "fo_move_option_id"});
  fo_cars.belongsTo(fo_positions, { as: "fo_position", foreignKey: "fo_position_id"});
  fo_positions.hasMany(fo_cars, { as: "fo_cars", foreignKey: "fo_position_id"});
  fo_debris.belongsTo(fo_positions, { as: "fo_position", foreignKey: "fo_position_id"});
  fo_positions.hasMany(fo_debris, { as: "fo_debris", foreignKey: "fo_position_id"});
  fo_logs.belongsTo(fo_positions, { as: "fo_position", foreignKey: "fo_position_id"});
  fo_positions.hasMany(fo_logs, { as: "fo_logs", foreignKey: "fo_position_id"});
  fo_move_options.belongsTo(fo_positions, { as: "fo_position", foreignKey: "fo_position_id"});
  fo_positions.hasMany(fo_move_options, { as: "fo_move_options", foreignKey: "fo_position_id"});
  fo_position2positions.belongsTo(fo_positions, { as: "fo_position_from", foreignKey: "fo_position_from_id"});
  fo_positions.hasMany(fo_position2positions, { as: "fo_position2positions", foreignKey: "fo_position_from_id"});
  fo_position2positions.belongsTo(fo_positions, { as: "fo_position_to", foreignKey: "fo_position_to_id"});
  fo_positions.hasMany(fo_position2positions, { as: "fo_position_to_fo_position2positions", foreignKey: "fo_position_to_id"});
  fo_traverses.belongsTo(fo_positions, { as: "fo_position", foreignKey: "fo_position_id"});
  fo_positions.hasMany(fo_traverses, { as: "fo_traverses", foreignKey: "fo_position_id"});
  fo_curves.belongsTo(fo_tracks, { as: "fo_track", foreignKey: "fo_track_id"});
  fo_tracks.hasMany(fo_curves, { as: "fo_curves", foreignKey: "fo_track_id"});
  fo_games.belongsTo(fo_tracks, { as: "fo_track", foreignKey: "fo_track_id"});
  fo_tracks.hasMany(fo_games, { as: "fo_games", foreignKey: "fo_track_id"});
  fo_positions.belongsTo(fo_tracks, { as: "fo_track", foreignKey: "fo_track_id"});
  fo_tracks.hasMany(fo_positions, { as: "fo_positions", foreignKey: "fo_track_id"});
  games.belongsTo(game_states, { as: "game_state", foreignKey: "game_state_id"});
  game_states.hasMany(games, { as: "games", foreignKey: "game_state_id"});
  games.belongsTo(game_types, { as: "game_type", foreignKey: "game_type_id"});
  game_types.hasMany(games, { as: "games", foreignKey: "game_type_id"});
  dr_results.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasMany(dr_results, { as: "dr_results", foreignKey: "game_id"});
  dr_tokens_games.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasMany(dr_tokens_games, { as: "dr_tokens_games", foreignKey: "game_id"});
  dr_turns.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasMany(dr_turns, { as: "dr_turns", foreignKey: "game_id"});
  fo_cars.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasMany(fo_cars, { as: "fo_cars", foreignKey: "game_id"});
  fo_debris.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasMany(fo_debris, { as: "fo_debris", foreignKey: "game_id"});
  fo_games.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasOne(fo_games, { as: "fo_game", foreignKey: "game_id"});
  games_users.belongsTo(games, { as: "game", foreignKey: "game_id"});
  games.hasMany(games_users, { as: "games_users", foreignKey: "game_id"});
  dr_results.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(dr_results, { as: "dr_results", foreignKey: "user_id"});
  dr_tokens_games.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(dr_tokens_games, { as: "dr_tokens_games", foreignKey: "user_id"});
  dr_turns.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(dr_turns, { as: "dr_turns", foreignKey: "user_id"});
  fo_cars.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(fo_cars, { as: "fo_cars", foreignKey: "user_id"});
  games.belongsTo(users, { as: "creator", foreignKey: "creator_id"});
  users.hasMany(games, { as: "games", foreignKey: "creator_id"});
  games_users.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(games_users, { as: "games_users", foreignKey: "user_id"});
  games_users.belongsTo(users, { as: "next_user", foreignKey: "next_user_id"});
  users.hasMany(games_users, { as: "next_user_games_users", foreignKey: "next_user_id"});

  return {
    dr_results,
    dr_token_states,
    dr_tokens,
    dr_tokens_games,
    dr_turns,
    fo_cars,
    fo_curves,
    fo_damages,
    fo_debris,
    fo_e_damage_types,
    fo_games,
    fo_logs,
    fo_move_options,
    fo_position2positions,
    fo_positions,
    fo_tracks,
    fo_traverses,
    game_states,
    game_types,
    games,
    games_users,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
