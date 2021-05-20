const getUsers = require("../../functions/getUsers");

const get_Users  =  (req, res) => {
    if (req.session.user == undefined) {
        res.render('index/login', {
            notify: ``,
        });
        return;
    }

    if(!req.session.user.admin) {
        res.redirect('/dashboard');
        return;
    }

    res.render('painel/users', {
        user: req.session.user.username,
        users: getUsers.GetUsersList(req.session.user.admin)
    });
}

module.exports = get_Users;