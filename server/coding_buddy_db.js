const Pool = require('pg').Pool; //postgres
require("dotenv").config();
// export default queryMethos = {getOneUserLanguages}

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});



// when user login, pass essential data
const filterEssentials = function (currentUsers) {
  pool.query(
    // this query does not include user who doesn't have languages
    // "SELECT users.id AS user_id, users.username AS username, email, avatar_id, languages.id AS language_id, language_name FROM users INNER JOIN user_language ON users.id=user_language.user_id INNER JOIN languages ON languages.id=user_language.language_id ORDER BY user_language.id", 
    // res.rows ==> {user_id:, username: , email:, avatar_id:, language_id:, language_name: }
    
    "SELECT id, username, email, avatar_id FROM users",
    (err, res) => {
      // res.rows => {id: , username: , email: , avatar_id}
      const allUsersObj = res.rows
      pool.query(
        "SELECT languages.id, user_id, language_name FROM user_language JOIN languages ON language_id=languages.id",
        (err, res_1) => {
          // res.rows_1 => {id(languageID): , user_id: , language_name: }
          const userIDAndLang = res_1.rows
          allUsersObj.map(user => {
            if (currentUsers[user.username]) {
              
            }
          })
        }
      )
    }
    // "SELECT * FROM languages", (err, res) => {
  
    // }
    // "SELECT * FROM languages JOIN user_language ON language_id=languages.id", 
    // (err, res) => {
  
    // }
  )

}









// user id 로 languages data 불러오기
// const getOneUserLanguages = (id, username) => {
//   pool.query("SELECT * FROM user_language WHERE user_id=$1", [id],
//   (err, res) => {
//     const userLanguageTable = res.rows
//     userLanguageTable.map(row => {
//       return changeToLanguageName(row.id)
//     })
//     return userLanguageTable
//   })
// }

// const changeToLanguageName = (id) => {
//   pool.query("SELECT * FROM languages WHERE id=$1", [id],
//   (err, res) => {
//     return res.rows[0].languageName
//   })
// }

// 데이터베이스 관리...
// GET : get all users
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
    console.log("result.rows - coding_buddy_db.js", result.rows)
    return result.rows
  });
};

// GET : get a user
const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      throw err
    }
    res.status(200).json(result.rows)

  })
}

// POST a new user
const createUser = (req, res) => {
  const { username, password, email, avatar_id, languages } = req.body;
  pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, email, avatar_id], (err, result) => {
    if (err) throw err;
    res.status(201).send(`User added with ID: ${result.rows[0].id}`)
  });
  pool.query("INSERT INTO user_language (user_id, language_id) VALUES ($1) RETURNING *", [languages], (err, result) => {
    if (err) throw err;
    res.status(201).send(`User added with `)
  })
};

// PUT : updated data in an existing user
const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body
  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id],
    (err, result) => {
      if (err) throw err
    })
  res.status(200).send(`User modified with ID: ${id}`)
}

// DELETE : delete a user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
    if (err) throw err
    res.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser }