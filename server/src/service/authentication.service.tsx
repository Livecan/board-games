import md5 from "md5";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sqlConnection from "./db.service";
import { initModels, users, usersAttributes } from "../models/init-models";
import { AuthenticationFailedError } from "../utils/errors";

initModels(sqlConnection);

interface UserToken {
  id: number,
  username: string
}

const secret = "135207ada809ed715ebff620106303ca3822225b8059a3ee7a7f7b194d074a08";
// @todo Return to randomly generated key later: crypto.randomBytes(32).toString('hex');
console.log(`Using secret: ${secret}`);

const login = async (username : string, password : string) => {
  // @todo Read about promise rejection problems here
  const user = await users.findOne({where: {name: username, password: md5(password)}});
  if (user !== null) {
    const tokenPayload : UserToken = { id: user.id, username: username }
    const token = jwt.sign(tokenPayload, secret, { algorithm: "HS256", expiresIn: "14 days" });
    return token;
  } else {
    throw new AuthenticationFailedError();
  }

};

const authenticate = async (req : Request) : Promise<usersAttributes> => {
  try {
    const jwtToken = req.headers['authorization'];
    const userId = jwt.verify(jwtToken, secret)['id'];
    console.log(userId);
    req['user'] = await users.findByPk(userId, { attributes: { exclude: [ "password" ] } });
    return req['user'];
  }
  catch (e) {
    // @todo Is this always correct?
    throw new AuthenticationFailedError();
  }
}

export { login, authenticate };