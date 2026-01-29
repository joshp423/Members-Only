const pool = require("./pool");

async function getAllMessages() {
    const { rows } = pool.query(
        'SELECT * FROM messages'
    )
    return rows;
}

async function getMessageSenderNames() {
    const { rows } = await pool.query(
        `SELECT users.firstname, users.lastname
            FROM messages
            JOIN users
            ON users.id = messages.userid;`,
    )
    return rows;
}

async function addNewUser(username, password) {
    await pool.query(
        `INSERT INTO users (username, password)
        VALUES ($1, $2);`,
        [username, password]
    )
    return;
}

async function userLookupUsername(username) {
    const { rows } = await pool.query(
        `SELECT * FROM users
        WHERE username = $1;`,
        [username]
    )
    return rows[0];
}

async function userLookupId(userid) {
    const { rows } = await pool.query(
        `SELECT * FROM users
        WHERE id = $1;`,
        [userid]
    )
    return rows[0];
}


module.exports = {
    getAllMessages,
    getMessageSenderNames,
    addNewUser,
    userLookupUsername,
    userLookupId
}