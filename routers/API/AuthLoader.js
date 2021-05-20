const TokenGenerete = require("../../Utils/Gerations/Token");


module.exports = function APILoader(req, res)  {


    var user = req.body.username;
    var password = req.body.password;
    var hwid = req.body.hwid;


    res.send({
        USER: {
            username: 'The_GZ',
            expire: '08/07/2025',
            user,
            password,
            hwid
        },
        STATUS: {
            status: 0,
            token: TokenGenerete(15)
        }
        
    })

};
