const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const user_model = require('../../mongo_models/user_model');

const reg_db = mongoose.model('users', user_model);

const post_Register = (req, res) => {
    var _senha = req.body.password;
    var _senha2 = req.body.c_password;
    var _username = req.body.username;
    var _email = req.body.email;

    if (_username.length <= 0 || _senha.length <= 0 || _senha2.length <= 0 || _email.length <= 0) {
        res.render('index/NoAnimated/register', {

            notify: `<script> demo.showNotification('top', 'right', 'Fill in all the fields!', 4, 'icon-simple-remove')</script>`
        })
        return;
    }

    reg_db.findOne({ 'email': _email.toLowerCase() }).then(result => {
        if (result.length > 0) {
            res.render('index/NoAnimated/register', {
                notify: `<script> demo.showNotification('top', 'right', 'This email is already in use!', 4, 'icon-simple-remove')</script>`
            })
            return;
        }
    }).catch(() => console.log('Ocorreu um erro!'));


    reg_db.findOne({ 'username': _username.toLowerCase() }).then(u_result => {
        if (u_result) {

            res.render('index/NoAnimated/register', {
                notify: `<script> demo.showNotification('top', 'right', 'This username is already in use!', 4, 'icon-simple-remove')</script>`
            })
            return;
        }

        reg_db.findOne({ 'email': _email.toLowerCase() }).then(e_result => {
            if (!e_result) {
                if (_senha === _senha2) {
                    let NovoUser = new reg_db({
                        realname: _username,
                        username: _username.toLowerCase(),
                        email: _email.toLowerCase(),
                        password: bcrypt.hashSync(_senha, 10),
                        register: new Date().getTime(),
                        expire: 0,
                        newreset: 0,
                        hwid: 0,
                        ban: false,
                        admin: false
                    })

                    NovoUser.save().then(() => console.log(`Salvo com Sucesso! ${_username}`)).catch(() => console.log('Erro ao Salvar'))


                    res.render('index/login', {
                        notify: `<script> demo.showNotification('top', 'right', 'Registration successfuly!', 2, 'icon-check-2'); </script>`,
                    })
                }
                else {
                    res.render('index/NoAnimated/register', {
                        notify: `<script> demo.showNotification('top', 'right', 'Passwords do not match!', 4, 'icon-simple-remove')</script>`
                    })
                }

            }
            else {
                res.render('index/NoAnimated/register', {
                    notify: `<script> demo.showNotification('top', 'right', 'This email is already in use!', 4, 'icon-simple-remove')</script>`
                })
            }
        });

    }).catch(() => console.log('Ocorreu algum erro!'));
}

module.exports = post_Register;