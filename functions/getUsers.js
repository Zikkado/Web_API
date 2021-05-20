const mongoose = require('mongoose');
const user_model = require('../mongo_models/user_model');
const TimeFormat = require('../Utils/Convertions/UnixConverter')

const reg_db = mongoose.model('users', user_model)

let ListUsers = [];

class Users {

    async Loadusers() {
        reg_db.find({}).then(result => {

            if (ListUsers.length > 0)
                ListUsers = [];

            result.forEach(a => {
                ListUsers.push({
                    username: a.realname,
                    email: a.email,
                    hwid: a.hwid,
                    register: TimeFormat(a.register / 1000),
                    expire: a.expire > new Date().getTime() / 1000 ? TimeFormat(a.expire) : 'Freezed',
                    status: a.expire > new Date().getTime() / 1000 ? 'Active' : 'Inactive',
                    uuid: a._id
                })
            });
            
        })
    }

    GetUsersList(adm) {
        if(!adm) return;
        this.Loadusers();
        return ListUsers;
    }

    

    




    
}

module.exports = new Users();