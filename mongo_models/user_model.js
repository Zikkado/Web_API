const mongoose = require('mongoose');

const user_model = new mongoose.Schema({
    //Real
    realname: String, 
    username: String, 
    email: String,
    password: String,
    discord: String,
    //Registros
    register: Number,

    //Subs
    expire: Number,
    newreset: Number,
    hwid: Number,
    ban: Boolean,
    admin: Boolean
});

module.exports = user_model;