const get_Index  =  (req, res) => {
    res.render('index', {
        title: 'Control Cheat | One Shot',
        logued: req.session.user != undefined ? true : false
    })
}

module.exports = get_Index;