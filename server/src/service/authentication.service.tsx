import md5 from "md5";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sqlConnection from "./db.service";
import initModels from "../models/init-models";

const secret = "135207ada809ed715ebff620106303ca3822225b8059a3ee7a7f7b194d074a08";
// @todo Return to randomly generated key later: crypto.randomBytes(32).toString('hex');
console.log(`Using secret: ${secret}`);

const authenticate = async (username : string, password : string) => {
  const user = await initModels(sqlConnection).users.findOne({where: {name: username, password: md5(password)}});
  // @todo what if db not accessible?
  if (user !== null) {
    const token = jwt.sign({ id: user.id, username: username }, secret, { algorithm: "HS256", expiresIn: "14 days" });
    return token;
  } else {
    throw new Error("Authentication failed");
  }

};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
}

export { authenticate, verifyToken };