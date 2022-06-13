const path = require("path");
const ENV = process.env.NODE_ENV || "development";

// require("dotenv").config({ path: PATH });
require("dotenv").config()

const { Client } = require('pg');

// console.log("test", process.env.PGPORT)
const client = new Client({
  // user: 'coding_buddy',
  // host: 'localhost',
  // database: 'coding_buddy',
  // password: '123',
  // port: 5432,
  connectionString: process.env.DATABASE_URL || "",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  // env 하면 authenticated failed...
  // user: process.env.PGUSER,
  // host: process.env.PGHOST,
  // database: process.env.PGDATABASE,
  // password: process.env.PGPASSWORD,
  // port: process.env.PGPORT
});

client
  .connect()
  .catch(e => console.log("Error connecting to psql server:", e));

//   // CREATE TABLE newuser (id serial PRIMARY KEY);
// client.query(`SELECT * FROM users;`, (err, res) => {
//   if (err) {
//     console.log(err.message);
//   }
//   console.log(res);
//   client.end;
// });

module.exports = client;