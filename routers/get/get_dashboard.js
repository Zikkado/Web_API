const mongoose = require('mongoose');
const getUsers = require('../../functions/getUsers');
const user_model = require('../../mongo_models/user_model');
const TimeFormat = require('../../Utils/Convertions/UnixConverter')
const reg_db = mongoose.model('users', user_model);

const get_Dashboard = (req, res) => {

    if (req.session.user == undefined)
        return res.redirect('/login')

    
    reg_db.findOne({ '_id': req.session.user.uuid }).then(u_result => {

        res.render("painel/dashboard", {
            user: req.session.user.username,
            admin: req.session.user.admin,
            notify: req.session.user.script,
            sub: u_result.expire > new Date().getTime() / 1000 ? true : false,
            status: u_result.expire > new Date().getTime() / 1000 ? 'Active' : 'Inactive',
            expire: u_result.expire > new Date().getTime() / 1000 ? TimeFormat(u_result.expire) : 'Freezed',
            users: getUsers.GetUsersList(u_result.admin)
        })
    }).catch(erro => console.log(erro))
}

module.exports =  get_Dashboard;