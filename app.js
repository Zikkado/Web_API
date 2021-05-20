//LIB's NPM
const express = require('express');
const session = require('express-session')
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const MercadoPago = require('mercadopago');

//LIB's Proprias
const TokenGen = require('./Utils/Gerations/Token');
const TimeFormat = require('./Utils/Convertions/UnixConverter');
const EmailSend = require('./functions/EmailSend')
const aes = require('./Utils/Encrypts/AES');




//=============================GET=============================
const get_Index = require('./routers/get/get_index');
const get_Login = require('./routers/get/get_login');

//============================POSTS============================

const post_Login = require('./routers/post/post_login');


//Mongo Models
const user_model = require('./mongo_models/user_model');
const forgot_password = require('./mongo_models/forgot_password');
const getUsers = require('./functions/getUsers');
const get_ForgotPassword = require('./routers/get/get_forgotpassword');
const get_Register = require('./routers/get/get_register');
const post_Register = require('./routers/post/post_register');
const get_dashboard = require('./routers/get/get_dashboard');
const get_Users = require('./routers/get/get_users');
const AuthLoader = require('./routers/API/AuthLoader');

//Sockets.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(session({ secret: 'qualquercoisakk', cookie: { maxAge: 600000 }, resave: false, saveUninitialized: false }))


app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/control_db", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Conectado ao MongoDB')
    getUsers.Loadusers();

}).catch(() => console.log('Erro ao conectar ao Mongo'));


MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-2156317156766241-040417-ba5ea15b303776699c8a526562418aaa-231675784"
})

const forgotpasswod_model = mongoose.model('tokens', forgot_password);

app.get('/', (req, res) => {
    get_Index(req, res);
})


app.get('/reset/:uuid', (req, res) => {
s
    if (req.session.user == undefined || !req.session.user.admin)
        return res.redirect('/login');

    var uuid = req.params.uuid;

    var reg_db = mongoose.model('users', user_model);

    reg_db.findOneAndUpdate({ '_id': uuid }, {
        hwid: 0
    }).then(() => console.log('HWID Resetado!')).catch(() => console.log('erro Ao Resetar o HWID'))


    res.render('painel/NoAnimated/dashboard_noanimated', {
        user: req.session.user.username,
        admin: req.session.user.admin,
        notify: `<script> demo.showNotification('top', 'right', 'The HWID has been successfully reset!', 2, 'icon-check-2'); </script>`,
        sub: req.session.user.expire > new Date().getTime() / 1000 ? true : false,
        status: req.session.user.expire > new Date().getTime() / 1000 ? 'Active' : 'Inactive',
        expire: req.session.user.expire > new Date().getTime() / 1000 ? TimeFormat(req.session.user.expire) : 'Freezed',
        users: getUsers.GetUsersList()
    });

})
app.get('/dashboard/users', (req, res) => {
    get_Users(req, res);
});

app.get('/forgotpassword/new', (req, res) => {
    var token = req.query['t'];



    forgotpasswod_model.findOne({ 'token': token }).then(result => {
        if (!result) {
            res.render('index/login', {
                notify: `<script> demo.showNotification('top', 'right', 'Token not found!', 4, 'icon-simple-remove'); </script>`
            })
            return;
        }

        if (result.expire <= new Date().getTime() / 1000) {
            res.render('index/login', {
                notify: `<script> demo.showNotification('top', 'right', 'Token Expired!', 4, 'icon-simple-remove'); </script>`
            })
            return;
        }

        if (result.use) {
            res.render('index/login', {
                notify: `<script> demo.showNotification('top', 'right', 'Token Used!', 4, 'icon-simple-remove'); </script>`
            })
            return;
        }

        res.render('forgots/newpass', {
            notify: ``,
            uuid: result._id
        })

    })
});

app.post('/forgotpassword/new', (req, res) => {

    var uuid = req.body.uuid;
    var senha = req.body.password;
    var c_senha = req.body.c_password;

    const reg_db = mongoose.model('users', user_model);
    const token = mongoose.model('tokens', forgot_password);

    if (senha != c_senha) {
        res.render('forgots/newpass', {
            notify: `<script> demo.showNotification('top', 'right', 'Passwords do not match!', 4, 'icon-simple-remove'); </script>`,
            uuid: uuid
        })
    }

    token.findOneAndUpdate({ '_id': uuid }, {
        use: true
    }).then(() => console.log('Tudo OK')).then(() => console.log('Erro!'))

    reg_db.findOneAndUpdate({ '_id': uuid }, {
        password: bcrypt.hashSync(senha, 10)
    }).then(() => console.log('Tudo OK')).catch(() => console.log('erro'));

    res.render('index/login', {
        notify: `<script> demo.showNotification('top', 'right', 'Your password has been successfully recovered!', 2, 'icon-check-2'); </script>`
    })
});

app.get('/forgotpassword', (req, res) => {
    get_ForgotPassword(req, res);
})

app.get('/edit', (req, res) => {
    var uuid = req.query['uuid'];
    const reg_db = mongoose.model('users', user_model);

    reg_db.findOne({ '_id': uuid }).then(result => {


        if (!result) return res.send('Nada encontrado!')

        res.send({
            email: result.email,
            username: result.realname,
            admin: result.admin,
            banned: result.ban
        });
    }).catch(() => res.send('Nada encontrado!'))
});


app.get('/payment', async (req, res) => {


    var id = `${Date.now()}`;

    try {
        var payments = await MercadoPago.preferences.create({
            Items: [
                Item = {
                    id: id,
                    title: "One month Sub!",
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: parseFloat(20)
                }
            ],
            payer: {
                email: 'guilhermezane3534tte7@gmail.com'
            },
            external_reference: id
        });
        console.log(payments);
        return res.redirect(payments.body.init_point);
    }
    catch (err) {
        return res.send(err);
    }

})


function ForgotPassword(UUID, Email) {

    let token = TokenGen(15);
    let req = new forgotpasswod_model({
        uuid: UUID,
        token: token,
        expire: new Date().getTime() / 1000 + 20000,
        use: false
    })
    req.save().then(() => {
        EmailSend.SendResetPassword(`http://localhost/forgotpassword/new?t=${token}`, Email);
    }).catch(() => console.log('Ocorreu um erro'))

}

//Quando solicitar a alteração!
app.post('/forgotpassword', (req, res) => {

    const reg_db = mongoose.model('users', user_model);

    reg_db.findOne({ 'email': req.body.email }).then(result => {
        console.log(result);
        if (!result) {
            res.render('forgots/NoAnimated/forgotpassword_noanimated', {
                notify: `<script> demo.showNotification('top', 'right', 'Email address not found in the database!', 4, 'icon-simple-remove'); </script>`
            })
            return;
        }
        ForgotPassword(result._id, result.email);

        res.render('index/login', {
            notify: `<script> demo.showNotification('top', 'right', 'We send the instructions in your email!', 2, 'icon-check-2'); </script>`
        })
    }).catch(err => console.log('Ocorreu um erro ;-; ' + err))

})


//Rotas painel principal
app.get('/dashboard', async (req, res) => {
    get_dashboard(req, res);
});


app.get('/dashboard/profile', (req, res) => {

    if (req.session.user == undefined)
        return res.redirect('/login')


    const reg_db = mongoose.model('users', user_model);

    reg_db.findOne({ '_id': req.session.user.uuid }).then(u_result => {
        res.render("painel/profile", {
            user: req.session.user.username,
            admin: req.session.user.admin,
            notify: ``,
            sub: u_result.expire > new Date().getTime() / 1000 ? true : false
        });
    }).catch(erro => console.log('Ocorreu um erro!' + erro))


})

//Rotas Register
app.post('/register', (req, res) => {
    post_Register(req, res);
});

app.get('/register', (req, res) => {
    get_Register(req, res)
});


//Rotas Login
app.get('/login', (req, res) => {
    get_Login(req, res);
});

app.post('/login', (req, res) => {
    post_Login(req, res);
});

//Rota Logout
app.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})



app.post('/api/v1/auth', async (req, res) => {

    
    AuthLoader(req, res);
    //let data = new Date(new Date().getTime() + 300000);
    //let dataFormatada = (data.getHours()) + ":" + (data.getMinutes()) + ":" + (data.getSeconds()) + " | " + ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();

   /* console.log('0');

    const _user = mongoose.model('users', user_model);
    const _token = mongoose.model('authcheat', AuthCheat);

    var _username = req.body.username;
    var _password = req.body.password;
    var _hwid = req.body.hwid;


    console.log(`Senha: ${_password} Decrypt: ${aes.decrypt(_password)} | HWID: ${_hwid} Decrypt: ${aes.decrypt(_hwid)}`)

    _user.findOne({ 'username': _username }).then(result => {

        var username = "";
        var expire = "";

        var status = 4;
        var token = aes.encrypt(TokenGen(15));

        if (!result) {

            res.send({
                USER: {
                    username,
                    expire
                },
                STATUS: {
                    status,
                    token
                }
            });
            return;
        }

        console.log('0');
        if (!bcrypt.compareSync(aes.decrypt(_password), result.password)) {
            var username = "";
            var expire = "";

            var status = 2;
            var token = ""

            res.send({
                USER: {
                    username,
                    expire
                },
                STATUS: {
                    status,
                    token
                }
            });
        }


        if (aes.decrypt(_hwid) != result.hwid) {
            var username = "";
            var expire = "";

            var status = 3;
            var token = ""

            res.send({
                USER: {
                    username,
                    expire
                },
                STATUS: {
                    status,
                    token
                }
            });
        }

        if (result.ban) {
            var username = "";
            var expire = "";

            var status = 4;
            var token = ""

            res.send({
                USER: {
                    username,
                    expire
                },
                STATUS: {
                    status,
                    token
                }
            });
        }

    }).catch(erro => console.log("Algo esta errado! " + erro))
*/
});

app.listen(80, erro => {
    if (erro) console.log(erro);
})