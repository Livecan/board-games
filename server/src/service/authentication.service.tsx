import md5 from "md5";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sqlConnection from "./db.service";
import { initModels, users } from "../models/init-models";
import { AuthenticationFailedError } from "../utils/errors";

initModels(sqlConnection);

const secret = "135207ada809ed715ebff620106303ca3822225b8059a3ee7a7f7b194d074a08";
// @todo Return to randomly generated key later: crypto.randomBytes(32).toString('hex');
console.log(`Using secret: ${secret}`);

const authenticate = async (username : string, password : string) => {
  // @todo Read about promise rejection problems here
  const user = await users.findOne({where: {name: username, password: md5(password)}});
  if (user !== null) {
    const token = jwt.sign({ id: user.id, username: username }, secret, { algorithm: "HS256", expiresIn: "14 days" });
    return token;
  } else {
    throw new AuthenticationFailedError();
  }

};

const verifyToken = (token : string) => {
  return jwt.verify(token, secret);
}

export { authenticate, verifyToken };