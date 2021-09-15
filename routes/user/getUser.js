const database = require('../../config/database')

module.exports = async (req, res) => {
    const connection = await database.connection();

    try {
        const user = req.user;
        console.log(req.session.passport.user())
        res.status(200).send({ me: user });

    } catch (error) {
        res.sendStatus(500);
    } finally {
        await connection.release();
    }
}