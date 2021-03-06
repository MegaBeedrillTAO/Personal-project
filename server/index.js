require('dotenv').config();
const express = require('express');
const app = express();
const massive = require('massive');
const session = require('express-session');
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env;
const {login, logout, register,deleteUser} = require('./Controllers/authController');
const {addCommand} = require('./Controllers/commandController');
const {editSettings, getSettings, getCurrentSettings} = require('./Controllers/settingController');
const {translateText, getSupportedLang} = require('./Controllers/translate');
const {getWeather} = require('./Controllers/weatherController');
const {getCountries} = require('./Controllers/countryController');


app.use(express.json());

app.use( express.static( `${__dirname}/../build` ) );

massive(CONNECTION_STRING).then(dbInst => {
    app.set("db", dbInst);
    console.log('Connected to Database');
})

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
})) 


app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.post('/auth/register', register);
app.delete('/auth/delete', deleteUser);

app.post('/command/add', addCommand);


app.get('/settings/get', getSettings);
app.put('/settings/edit', editSettings);
app.get('/settings/current', getCurrentSettings);

app.post(`/translate`, translateText);
app.get('/languages', getSupportedLang);

app.get('/weather', getWeather);

app.get('/countries', getCountries);

app.listen(SERVER_PORT, () =>{
    console.log(`Listening on port ${SERVER_PORT}`);
})