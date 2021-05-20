const mongoose = require('mongoose');
const user_model = require('../../mongo_models/user_model');
const bcrypt = require('bcryptjs')

const reg_db = mongoose.model('users', user_model);


const post_Forgot = (req, res) => {

}

module.exports = post_Forgot;