const nodemailer = require('nodemailer');

let email = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "cheatcontrolpublic@gmail.com",
        pass: "serpino666"
    }
})

class Email {
    async SendResetPassword(To, msg) {
        email.sendMail({
            from: "Control Cheats <cheatcontrolpublic@gmail.com>",
            to: To,
            subject: "Reset Password!",
            html: `<html> <body style="margin: 0; text-align: center; "> <h3>${msg}</h3> </body> </html>`
        }).then(() => { }).catch(erro => console.log('Nodemailer ocorreu 1 erro! ' + erro))
    }

}

module.exports = new Email();


