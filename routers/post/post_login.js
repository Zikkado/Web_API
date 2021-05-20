const mongoose = require('mongoose');
const user_model = require('../../mongo_models/user_model');
const bcrypt = require('bcryptjs')

const reg_db = mongoose.model('users', user_model);


const post_Login = (req, res) => {
    var _username = req.body.username;
    var _password = req.body.password;


    reg_db.findOne({ 'username': _username.toLowerCase() }).then(result => {


        if (!result) {
            res.render('index/NoAnimated/login', {
                title: "Control Cheats | Login",
                notify: `<script> demo.showNotification('top', 'right', 'Invalid Username!', 4, 'icon-simple-remove'); </script>`,
            })
        }

        if (bcrypt.compareSync(`${_password}`, `${result.password}`)) {

            req.session.user = {
                username: result.realname,
                uuid: result._id,
                admin: result.admin,
                expire: result.expire,
                script: `<script> demo.showNotification('top', 'right', 'Login successfuly! ${_username}', 2, 'icon-check-2'); </script>`
            }

            res.redirect('/dashboard');
        }
        else {
            res.render('index/NoAnimated/login', {
                title: "Control Cheats | Login",
                notify: `<script> demo.showNotification('top', 'right', 'Incorrect password!', 4, 'icon-simple-remove'); </script>`,
            })
        }

    }).catch(err => console.log('Erro :( ' + err));

}

module.exports = post_Login;