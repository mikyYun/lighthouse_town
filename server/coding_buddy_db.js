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

// when user login, pass essential data
// const filterEssentials = function (currentUsers) {
//   pool.query(
//     "SELECT id, username, email, avatar_id FROM users",
//     (err, res) => {
//       // res.rows => {id: , username: , email: , avatar_id}
//       const allUsersObj = res.rows;
//       pool.query(
//         "SELECT languages.id, user_id, language_name FROM user_language JOIN languages ON language_id=languages.id",
//         (err, res_1) => {
//           // res.rows_1 => {id(languageID): , user_id: , language_name: }
//           const userIDAndLang = res_1.rows;
//           allUsersObj.map(user => {
//             if (currentUsers[user.username]) {

//             }
//           });
//         }
//       );
//     }
//   );
// };

/** LANGUAGES MATCHING WITH ID AND LANGUAGE_NAME */
/** ONLY ONCE */
const langIDAndName = {};

const getLanguages = () => {
  pool.query(`
    SELECT id, language_name FROM languages
  `, (err, result) => {
    result.rows.map(idAndName => {
      langIDAndName[idAndName.id] = idAndName.language_name;
    });
    return langIDAndName;
  }
  );
};
/** LANG_ID : LANG_NAME */
getLanguages();

/** GET to get all users from DB */
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
    // console.log("result.rows - coding_buddy_db.js", result.rows)
    return result.rows;
  });
};

const getFriends = (userID) => {
  pool.query(`
    SELECT username FROM users 
      JOIN favorites 
        ON users.id = favorites.added
      WHERE favorites.added_by = $1
      RETURNING *
  `, [userID]);
};

/** GET to identify user information */
const getUserInfo = (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  pool.query(`
    SELECT users.id, avatar_id, users.username, language_name FROM languages
    JOIN user_language
    ON languages.id = user_language.language_id
    JOIN users
    ON users.id = user_language.user_id
    WHERE (users.email = $1 AND users.password = $2)
    `, [email, password])
    .then((result) => {
      const userName = result.rows[0].username;
      const avatar = result.rows[0].avatar_id;
      const userID = result.rows[0].id;
      const userFriendsList = [];
      const userLanguages = [];
      pool.query(`
        SELECT username FROM users 
          JOIN favorites 
            ON users.id = favorites.added
          WHERE favorites.added_by = $1
        `, [userID])
        .then((res) => {
          res.rows.forEach(friendName => {
            userFriendsList.push(friendName.username);
          });
        })
        .then(() => {
          result.rows.forEach((userData) => {
            userLanguages.push(userData.language_name);
            userFriendsList.push(userData.added);
          });
        })
        .then(() => {
          const loginUserData = {
            userName,
            avatar,
            userLanguages,
            userID,
            userFriendsList
          };
          res.status(200).send(loginUserData);
        })
        .catch(err => {
          res.status(409).send("Invalid information. Please try again");
        });
    })
    .catch((err) => {
      res.status(409).send("Invalid information. Please try again");
    });
};


/** POST REGISTER NEW USER */
const createUser = (req, res) => {
  console.log(req)
  const userName = req.body.userInfo.userName;
  const userPassword = req.body.userInfo.userPassword;
  const userEmail = req.body.userInfo.userEmail;
  const userLanguages = req.body.userInfo.userLanguages;
  const avatar = req.body.userInfo.userAvatar;
  /** CHECK UNIQUE */
  pool.query(`
    SELECT * FROM users WHERE username = $1 OR email = $2
  `, [username, userEmail])
  .then(response => {
    /** GIVEN username OR email IS ALREADY IN DB */
    // if (response.rows[0]) res.status(409).send(false);
    if (response.rows[0]) console.log(response.rows);
    console.log()
  })
  .catch(err => {
    console.log(err)
  })

  /** INSERT NEW USER's DATA USING TRANSACTION */
  // pool.query(`
  //   BEGIN TRANSACTION
  //     INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4);
  //     INSERT INTO user_language (user_id, language_id) VALUES ($5, $6);
  //   COMMIT
  // `, [])

  // const { username, password, email, avatar_id, languages } = req.body;
  // pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, email, avatar_id], (err, result) => {
  //   if (err) throw err;
  //   res.status(201).send(`User added with ID: ${result.rows[0].id}`);
  // });
  // pool.query("INSERT INTO user_language (user_id, language_id) VALUES ($1) RETURNING *", [languages], (err, result) => {
  //   if (err) throw err;
  //   res.status(201).send(`User added with `);
  // });
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
  getUserInfo,
  createUser,
  // filterEssentials,
  // getUsers,
  // updateUser,
  // deleteUser
};

/** EXPORT poolGroup as a MODULE */
module.exports = poolGroup;