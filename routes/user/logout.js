const sessionServices = require('../../services/sessions');
const database = require('../../config/database');
const userServices = require('../../services/user');

module.exports = async (req, res) => {
    const connection = await database.connection();
    console.log(req.user)
    try {
        const userEntry = await userServices.getUserById(connection, req.user.id);
        await sessionServices.logUserSessionAction(connection, userEntry[0].id, "LOGOUT");

        res.status(200).send({ message: "You have been logout!" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        await connection.release();
    }
}
