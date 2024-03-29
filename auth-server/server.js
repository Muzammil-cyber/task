const express = require("express");
const cors = require("cors");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pg = require("pg");
require("dotenv").config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database", err);
    return;
  }
  console.log("Connected to database");
  db.query(
    "CREATE TABLE IF NOT EXISTS users (email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)"
  )
    .then(() => {
      console.log("Table created");
    })
    .catch((err) => {
      console.error("Error creating table", err);
    });
});

const user = {
  findByEmail: async (email) => {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
  },
  create: async ({ email, password }) => {
    return db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      password,
    ]);
  },
};

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await user.findByEmail(email);

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bycrypt.compare(password, rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Registration route
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await user.findByEmail(email);
    if (rows.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bycrypt.hash(password, 10);

    await user.create({ email, password: hashPassword });
    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 3000");
});

// Protected route example
