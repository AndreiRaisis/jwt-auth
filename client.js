const readline = require('readline');
const prompt = require('prompt');
const axios = require('axios');

const apiUrl = 'http://localhost:3000';

let selectedOptions = null;
let token = null;
let loginTime = null;
let showSessionTime = false;

const clearScreen = () => {
    process.stdout.write('\033c');
};

const properties = [
    {
        name: 'email',
        validator: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        warning: 'Enter a valid email!'
    },
    {
        name: 'password',
        hidden: true
    }
];

const options = [
    {
        name: 'option',
        validator: /([1-3])/,
        warning: 'You can select only on of the above options!'
    }
]

const login = async (email, password) => {
    try {
        const result = await axios.post(`${apiUrl}/api/login`, {
            email,
            password
        });

        token = result.data.token;
    } catch (error) {
        console.error(error);
    }
};

const logout = async () => {
    try {
        await axios.post(`${apiUrl}/api/logout`, {}, {
            headers: {
                Authorization: token
            }
        });

        token = null;
    } catch (error) {
        console.error(error);
    }
};

const register = async (email, password) => {
    try {
        const result = await axios.post(`${apiUrl}/api/register`, {
            body: {
                email,
                password
            }
        });

        token = result.data.token;
    } catch (error) {
        console.error(error);
    }
};

const onErr = (err) => {
    console.log(err);
    return 1;
}

const mainLoop = async () => {
    clearScreen();
    prompt.start();

    if (!token) {
        switch (selectedOptions) {
            case '1':
                console.log('Selected the login');
                prompt.get(properties, async (err, result) => {
                    if (err) { return onErr(err); }
                    await login(result.email, result.password);
                    selectedOptions = null;
                    loginTime = new Date();
                    mainLoop();
                })
                break;
            case '2':
                console.log('Selected the register');
                prompt.get(properties, async (err, result) => {
                    if (err) { return onErr(err); }
                    await register(result.email, result.password);
                    selectedOptions = null;
                    mainLoop();
                })
                break;
            case '3':
                break;
            default:
                console.log('==============MENU===========');
                console.log(`1. Login`);
                console.log(`2. Register`);
                console.log(`3. Exit`);
                console.log('=============================\n');
                prompt.get(options, (err, result) => {
                    if (err) { return onErr(err); }
                    selectedOptions = result.option
                    mainLoop();
                })
        }
    } else {
        if (showSessionTime && loginTime) {
            let seconds = (new Date().getTime() - loginTime.getTime()) / 1000;
            console.log('==============SESSION TIME===========');
            console.log(`The user is login for ${seconds} seconds`);
        }
        switch (selectedOptions) {
            case '1':
                showSessionTime = true;
                selectedOptions = null;
                mainLoop();
                break;
            case '2':
                await logout();
                selectedOptions = null;
                mainLoop();
                break;
            case '3':
                break;
            default:
                console.log('==============MENU===========');
                console.log(`1. Session Time`);
                console.log(`2. Logout`);
                console.log(`3. Exit`);
                console.log('=============================\n');
                prompt.get(options, (err, result) => {
                    if (err) { return onErr(err); }
                    selectedOptions = result.option
                    mainLoop();
                })
        }
    }
}

mainLoop();