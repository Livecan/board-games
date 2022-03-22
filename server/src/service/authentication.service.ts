import md5 from "md5";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { users } from "../../../common/src/models/generated/init-models";
import { AuthenticationFailedError } from "../utils/errors";
import { NextFunction } from "express";

interface UserToken {
  id: number;
  username: string;
}

const secret =
  "135207ada809ed715ebff620106303ca3822225b8059a3ee7a7f7b194d074a08";
// @todo Return to randomly generated key later: crypto.randomBytes(32).toString('hex');
console.log(`Using secret: ${secret}`);

const login = async (username: string, password: string) => {
  // @todo Read about promise rejection problems here
  const user = await users.findOne({
    where: { name: username, password: md5(password) },
  });
  if (user !== null) {
    const tokenPayload: UserToken = { id: user.id, username: username };
    const token = jwt.sign(tokenPayload, secret, {
      algorithm: "HS256",
      expiresIn: "14 days",
    });
    return {jwt: token, user: {name: user.name, id: user.id}};
  } else {
    throw new AuthenticationFailedError();
  }
};

const authenticateToken = async (jwtToken: string, req: any = null) => {
  try {
    const userId = jwt.verify(jwtToken, secret)["id"];
    console.log(`User ID: ${userId}`);
    const user = await users.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (req != null) {
      req.user = user;
    }
    return user;
  } catch (e) {
    throw new AuthenticationFailedError();
  }
};

const authenticate = async (
  req,
  res,
  next: NextFunction,
  throwsOnAuthenticationFailedError = true
): Promise<void> => {
  try {
    const jwtToken = req.headers?.authorization;
    await authenticateToken(jwtToken, req);
    next();
  } catch (e) {
    // @todo Is this always correct?
    if (throwsOnAuthenticationFailedError === true) {
      res.sendStatus(401).send("Authentication failed");
    }
    throw e;
  }
};

export { login, authenticate, authenticateToken };
