const Pool = require('pg').Pool; //postgres
require("dotenv").config();
// export default queryMethos = {getOneUserLanguages}

// const poolGroup = () => {
/** USE THIS DB */
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

/** FOR REGISTERATION */

/** FOR LOGIN */



// when user login, pass essential data
const filterEssentials = function (currentUsers) {
  pool.query(
    "SELECT id, username, email, avatar_id FROM users",
    (err, res) => {
      // res.rows => {id: , username: , email: , avatar_id}
      const allUsersObj = res.rows;
      pool.query(
        "SELECT languages.id, user_id, language_name FROM user_language JOIN languages ON language_id=languages.id",
        (err, res_1) => {
          // res.rows_1 => {id(languageID): , user_id: , language_name: }
          const userIDAndLang = res_1.rows;
          allUsersObj.map(user => {
            if (currentUsers[user.username]) {

            }
          });
        }
      );
    }
  );
};

/** GET to get all users from DB */
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
    // console.log("result.rows - coding_buddy_db.js", result.rows)
    return result.rows;
  });
};

/** GET to identify user information */
const getUserInfo = (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const id = parseInt(req.params.id);

  // pool.query('SELECT * FROM users WHERE id = $1 AND password = $2', [email, password], (err, result) => {
    pool.query('SELECT * FROM users JOIN user_language ON users.id = user_language.user_id WHERE users.email = $1 AND password = $2', [email, password], (err, result) => {
    if (err) {
      /** SEND STATUS 409 */
      console.log("ERROR", err)
      res.status(409)
    } else {
      console.log("SUCCESS", result.rows)
      res.status(200).json(result.rows);
    }
  });
};

/** POST to register a new user */
const createUser = (req, res) => {
  const { username, password, email, avatar_id, languages } = req.body;
  pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, email, avatar_id], (err, result) => {
    if (err) throw err;
    res.status(201).send(`User added with ID: ${result.rows[0].id}`);
  });
  pool.query("INSERT INTO user_language (user_id, language_id) VALUES ($1) RETURNING *", [languages], (err, result) => {
    if (err) throw err;
    res.status(201).send(`User added with `);
  });
};

// PUT : updated data in an existing user
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id],
    (err, result) => {
      if (err) throw err;
    });
  res.status(200).send(`User modified with ID: ${id}`);
};

// DELETE : delete a user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
    if (err) throw err;
    res.status(200).send(`User deleted with ID: ${id}`);
  });
};

/** REQUIRE poolGroup OBJ inside Server */
const poolGroup = {
  pool,
  filterEssentials,
  getUserInfo,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};

/** EXPORT poolGroup as a MODULE */
module.exports = poolGroup;