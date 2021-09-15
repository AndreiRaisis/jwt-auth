const database = require('../../config/database');
const userServices = require('../../services/user');
const auth = require('../../utils/auth');
const sessionServices = require('../../services/sessions');

module.exports = async (req, res) => {
    const connection = await database.connection();
    console.log(req.body)
    try {
        const {
            email,
            password
        } = req.body;

        const userEntry = await userServices.getUserByEmail(connection, email);

        if (userEntry[0]) {
            const isValid = auth.validatePassword(password, userEntry[0].hash, userEntry[0].salt);

            if (isValid) {
                const jwtToken = auth.issueJWT(userEntry[0]);

                await sessionServices.logUserSessionAction(connection, userEntry[0].id, "LOGIN");

                res.status(200).send({ message: "You are login!", ...jwtToken });
            } else {
                res.status(404).send({ message: "The email or the password is wrong!" });
            }

        } else {
            res.sendStatus(404);
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        await connection.release();
    }
}
