require("dotenv").config();

const fs = require("fs");
const { Client } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Client(dbParams);

const runSchemaFiles = async () => {
  // console.log("FINDING")
  const schemaFilenames = fs.readdirSync("./db/schema");
  console.log(schemaFilenames)
  for (const fn of schemaFilenames) {
    console.log(fn)
    const sql = fs.readFileSync(`./db/schema/${fn}`, "utf8");
    console.log(sql)
    await db.query(sql);
  }
};

// const runSeedFiles = async () => {
//   const schemaFilenames = fs.readdirSync("../db/seeds");

//   for (const fn of schemaFilenames) {
//     const sql = fs.readFileSync(`../db/seeds/${fn}`, "utf8");
//     await db.query(sql);
//   }
// };

const runResetDB = async () => {
  try {
    dbParams.host && console.log("Connecting to PG..host");
    dbParams.connectionString && console.log("Connecting to PG");
    await db.connect();
    await runSchemaFiles();
    // await runSeedFiles();
    db.end;
  } catch (err) {
    console.log("ERROR", err);
    db.end;
  }
};

runResetDB();