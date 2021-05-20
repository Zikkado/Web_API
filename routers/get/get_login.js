const get_Login  =  (req, res) => {
    if (req.session.user == undefined) {
        res.render('index/login', {
            notify: ``,
        });
        return;
    }

    res.redirect('/dashboard');
}

module.exports = get_Login;