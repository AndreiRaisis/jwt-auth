const insertUser = async (connection, email, salt, hash) => {
    return await connection.query(
        "INSERT INTO users (email, salt, hash) VALUES (?,?,?);",
        [email, salt, hash]
    )
};

const emailExist = async (connection, email) => {
    const count = await connection.query(
        "SELECT COUNT(*) FROM users WHERE email = ?",
        [email]
    );

    return count[0]["COUNT(*)"] > 0;
};

const getUserByEmail = async (connection, email) => {
    return await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
};

const getUserById = async (connection, id) => {
    return await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );
};

module.exports = {
    insertUser,
    emailExist,
    getUserByEmail,
    getUserById
}
