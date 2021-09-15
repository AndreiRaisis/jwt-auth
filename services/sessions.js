const logUserSessionAction = async (connection, userId, action) => {
    connection.query(
        'INSERT INTO sessions (userId, action, createAt) VALUES (?,?,?)',
        [userId, action, new Date()]
    )
};

module.exports = {
    logUserSessionAction
};