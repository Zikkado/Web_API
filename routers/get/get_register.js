const get_Register  =  (req, res) => {
    res.render('index/register', {
        title: "Control Cheats | Register",
        notify: ``
    });
}

module.exports = get_Register;