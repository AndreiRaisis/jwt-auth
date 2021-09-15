const database = require('../../config/database');
const authHelper = require('../../utils/auth');
const userServices = require('../../services/user');

module.exports = async (req, res) => {
    const connection = await database.connection();

    try {
        const {
            email,
            password
        } = req.body;

        console.log("sessionId:", req.sessionID);
        const { salt, hash } = authHelper.generateHashAndSalt(password);

        const userExist = await userServices.emailExist(connection, email);

        if (userExist) {
            res.status(400).send({ message: `User with the email ${email} already exists!` });
        } else {
            const data = await userServices.insertUser(connection, email, salt, hash);
            res.status(201).send({ message: `The user with ${email} was created!`, insertId: data.insertId });
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        await connection.release();
    }
};
