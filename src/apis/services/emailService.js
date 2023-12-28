require('dotenv').config()
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const nodemailer = require('nodemailer')
const ApiError = require('../../utils/api-error')
const status = require('http-status')

const env = require('../../configs/env')

const oauth2Client = new OAuth2(env.passport.clientId, env.passport.clientSecret, env.passport.redirectUrl)
oauth2Client.setCredentials({ refresh_token: env.passport.refreshTokenMail })

const sendEmail = async (to, subject = 'Van Hieu Shop!', text = 'Register', URL) => {
    try {
        const accessToken = await oauth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            // service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: env.passport.mailFrom,
                clientId: env.passport.clientId,
                clientSecret: env.passport.clientSecret,
                refreshToken: env.passport.refreshTokenMail,
                accessToken: accessToken.token,
            },
        })

        const mailOptions = {
            from: `"${subject}👋" ${env.passport.mailFrom}`,
            to: to,
            subject: subject,

            html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the GDShop!!.</h2>
            <p>Congratulations! You're almost set to start using DEVAT✮SHOP.
                Just click the button below to ${text}.
            </p>

            <a href=${URL} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Activate your Email</a>

            <p>If the button doesn't work for any reason, you can also click on the link below:</p>

            <div>${URL}</div>
            </div>
            `,
        }
        console.log('send mail')
        return await transport.sendMail(mailOptions)
    } catch (error) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Internal Server error').orginalError(error)
    }
}

module.exports = {
    sendEmail,
}
