const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT 
      messages.*, 
      users.firstname, 
      users.lastname
    FROM messages
    JOIN users ON users.id = messages.userid
    ORDER BY messages.timeadded DESC;`
  );
  return rows;
}

async function addNewUser(firstName, lastName, username, password) {
  await pool.query(
    `INSERT INTO users (firstname, lastname, username, password, membershipstatus)
        VALUES ($1, $2, $3, $4, false);`,
    [firstName, lastName, username, password],
  );
  return;
}

async function userLookupUsername(username) {
  const { rows } = await pool.query(
    `SELECT * FROM users
        WHERE username = $1;`,
    [username],
  );
  return rows[0];
}

async function userLookupId(userid) {
  const { rows } = await pool.query(
    `SELECT * FROM users
        WHERE id = $1;`,
    [userid],
  );
  return rows[0];
}

async function submitNewMessage(title, text, userid) {
    await pool.query(
        `INSERT INTO messages(title, text, userid, timeadded)
            VALUES ($1, $2, $3, $4);`,
        [title, text, userid, new Date()]
    );
    return;
}

module.exports = {
  getAllMessages,
  addNewUser,
  userLookupUsername,
  userLookupId,
  submitNewMessage
};
