const crypto = require("crypto");
import config from "../config";
import { User } from "../resources/user/user.model";
import jwt from "jsonwebtoken";

export const generateNewToken = user => {
  return new Promise((resolve, reject) => {
    generateFindHash(user)
      .then(findHash => {
        resolve(
          jwt.sign({ token: findHash }, config.secrets.jwt, {
            expiresIn: config.secrets.jwtExp
          })
        );
      })
      .catch(err => reject(err));
  });
};

export const generateFindHash = user => {
  return new Promise((resolve, reject) => {
    _generateFindHash(user);
    function _generateFindHash(user) {
      user.findHash = crypto.randomBytes(32).toString("hex");
      user
        .save()
        .then(() => {
          resolve(user.findHash);
        })
        .catch(err => {
          return reject(err);
        });
    }
  });
};

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  try {
    const user = await User.create(req.body);
    generateNewToken(user).then(token => {
      return res.status(201).send({ token });
    });
  } catch (e) {
    console.error("error: ", e);
    return res.status(500).end();
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  const invalid = { message: "Invalid email and password combination" };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("email password")
      .exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = generateNewToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await User.findOne({ findHash: payload.token })
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    console.error("no user");
    return res.status(401).end();
  }

  console.log("got em:", user);

  req.user = user;
  next();
};
