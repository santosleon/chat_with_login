const env = require("./.env");
const nodemailer = require('nodemailer');

module.exports = {
	transport: nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: env.emailAddress,
			pass: env.emailPassword,
		},
	}),
	mailer: env.emailAddress,
}