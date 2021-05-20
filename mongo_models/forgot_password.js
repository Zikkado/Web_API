const mongoose = require('mongoose');

const forgot_password = new mongoose.Schema({
    uuid: String,
    token: String,
    expire: Number,
    use: Boolean
});

module.exports = forgot_password;