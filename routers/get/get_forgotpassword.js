const get_ForgotPassword = (req, res) => {
    res.render('forgots/forgotpassword', {
        notify: ``
    })
}

module.exports= get_ForgotPassword;