const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const users = [];
const createToken = require("./auth/createToken");
app.use([bodyParser.urlencoded({ extended: false }), bodyParser.json()]);
app.use(cors());
app.use(morgan("tiny"));
// -------------------------------------------------------------
// Important
// -------------------------------------------------------
// Dont expose this
// use config files
const SECRET_JWT_KEY = "mysecret";
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "No token specified" });
  }

  //validate the token itself
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: "Token expired or not valid" });
    } else {
      console.log(decoded);
      // req.userId = decoded.userId;
      next();
    }
  });
  console.log(authHeader);
};
let pk = 0;
app.post("/auth/register", (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    res.status(400).send({ message: "Field missing" });
  }
  // verify unique username and email
  /*-----------------------------------------------------------
   * WAIT                                                     |
   *-----------------------------------------------------------
   * Verify against your database that the username and email doesnt already exist
   * Do it yourself
   */

  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) return res.status(500).send();
    const user = {
      userId: ++pk,
      email,
      username,
      password: hash
    };
    users.push(user);
    // Return Token?
    /*
     *----------------------------------------------------------------
     * Return Token after signup?
     * --------------------------------------------------------------
     * Depend on the app requirement ;)
     */
    const token = createToken(user);
    res.status(201).send({ token });
  });
});

app.post("/auth/login", (req, res) => {
  if (!email || !username || !password) {
    res.status(400).send({ message: "Field missing" });
  }
  const user = users.find(
    user => user.username === req.body.username || user.email === req.body.email
  );
  bcrypt.compare(req.body.password, user.password, (error, respose) => {
    if (!error) {
      // create token and send to client
      const token = createToken(user);
      res.status(200).send({ token });
    } else {
      res.status(401).send({ response: "wrong password" });
    }
  });
});

app.use("/api", auth);

/*
 *----------------------------------------------------------
 *Hardcoded data
 *----------------------------------------------------------
 */
const products = [
  {
    id: 1,
    name: "Shoe",
    user: 5
  },
  {
    id: 2,
    name: "Sweater",
    user: 2
  },
  {
    id: 3,
    name: "Pants",
    user: 3
  }
];
app.get("/api/products", (req, res) => {
  res.status(200).send(products);
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
