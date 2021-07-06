const db = require("../database.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../../configs/.env');
const { transport, mailer } = require('../../configs/mailerConfig');
const User = db.users;
const Message = db.message;

exports.signup = (req, res) => {
	const internalError = (r) => {
		return r.status(500).send({ type: "general", message: "Internal error" });
	}

	const nameRegex = /(?=.+)/;
	const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}$/;
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.{8,})/;

	const { name, email, password } = req.body;
	const nameCheck = nameRegex.test(name);
	const emailCheck = emailRegex.test(email);
	const passwordCheck = passwordRegex.test(password);

	if (!nameCheck) {
		res.status(500).send({ type: 'name', message: 'Invalid username!' });
	} else if (!emailCheck) {
		res.status(500).send({ type: 'email', message: 'Invalid email!' });
	} else if (!passwordCheck) {
		res.status(500).send({ type: 'password', message: 'Invalid password!' });
	} else {
		bcrypt.hash(password, 10, (e, enc) => {
			if (e) {
				res.status(500).send({ type: 'general', message: 'Internal error!' });
			}
			const token = String(parseInt(Math.random() * 999999)).padStart(6, '0');
			(new User({ name, email, password: enc, token }))
				.save()
				.then(() => {
					transport.sendMail({
						subject: "TOKEN",
						from: `No reply <${mailer}>`,
						to: email,
						html: `<h2>${token}</h2>`,
					}).then(() => {
						const webtoken = jwt.sign({ email }, secret, {
							expiresIn: '1d'
						})
						return (res.cookie('jwtcookie', webtoken, {
							secure: true,
							httpOnly: true,
							maxAge: 86400000,
						}).send({ message: 'Successful registration!', username: name }))
					}).catch(() => internalError(res))
				})
				.catch(error => {
					let type, message;
					if (error.message === undefined) {
						type = "general";
						message = "Some error occurred while creating the account.";
					} else if (error.message.startsWith("E11000")) {
						if (error.message.includes("name")) {
							type = "name";
							message = "Username already registered.";
						} else if (error.message.includes("email")) {
							type = "email";
							message = "E-mail already registered.";
						}
					} else {
						type = "general";
						message = error.message;
					}
					res.status(500).send({ type, message });
				});
		});
	}
};

exports.signin = (req, res) => {
	const internalError = (r) => {
		return r.status(500).send({ type: "general", message: "Internal error" });
	}
	const { email, password } = req.body;
	const token = String(parseInt(Math.random() * 999999)).padStart(6, '0');
	User.findOneAndUpdate({ email }, { token })
		.then(user => {
			if (!user || user.length === 0)
				res.status(404).send({ type: "email", message: "User not found" });
			else {
				bcrypt.compare(password, user.password, (err, isPassCorrect) => {
					if (err) {
						internalError(res);
					} else if (isPassCorrect) {
						transport.sendMail({
							subject: "TOKEN",
							from: `No reply <${mailer}>`,
							to: user.email,
							html: `<h2>${token}</h2>`,
						}).then(() => {
							const webtoken = jwt.sign({ email: user.email }, secret, {
								expiresIn: '1d'
							})
							return (res.cookie('jwtcookie', webtoken, {
								secure: true,
								httpOnly: true,
								maxAge: 86400000,
							}).send({ message: 'Successful signin!', username: user.name }))
						}).catch(() => internalError(res))
					} else {
						res.status(400).send({ type: "password", message: "Wrong password" });
					}
				});
			}
		})
		.catch(() => internalError(res));
};

exports.tokenVerification = (req, res) => {
	const tokenRegex = /^[0-9]{6}$/;
	const { token } = req.body;
	const { jwtcookie } = req.cookies;

	const tokenCheck = tokenRegex.test(token);

	if (!tokenCheck) {
		res.status(500).send({ type: 'token', message: 'Invalid token!' });
	} else {
		jwt.verify(jwtcookie, secret, (error, decoded) => {
			if (error) {
				res.status(400).send({ type: "general", message: "Not authorized!" });
			} else {
				User.findOne({ email: decoded.email }).then((user) => {
					if (!user) {
						res.status(400).send({ type: "general", message: "User not found!" });
					} else if (token != user.token) {
						res.status(400).send({ type: "token", message: "Wrong token..." });
					} else {
						const webtoken = jwt.sign({ name: user.name, email: user.email, token: token, authorized: true }, secret, {
							expiresIn: '1 day'
						})
						return (res.cookie('jwtcookie', webtoken, {
							secure: true,
							httpOnly: true,
							maxAge: 86400000,
						}).send({ message: "Authorized successfully!" }))
					}
				}).catch(() => res.status(500).send({ type: "general", message: "Internal error" }))
			}
		})
	}
}

exports.oldMessages = (req, res) => {
	const { jwtcookie } = req.cookies;
	jwt.verify(jwtcookie, secret, (error, decoded) => {
		if (error || decoded.authorized !== true) {
			res.status(400).send({ type: "general", message: "Not authorized!" });
		} else {
			Message.find()
				.then(messages => {
					res.status(200).send(messages);
				})
				.catch(() => r.status(500).send({ type: "general", message: "Internal error" }));
		}
	})
}

exports.logout = (req, res) => {
	const webtoken = jwt.sign({}, secret, {
		expiresIn: '10'
	})
	return (res.cookie('jwtcookie', webtoken, {
		secure: true,
		httpOnly: true,
		maxAge: 10,
	}).send({ message: "Successful logout!" }));
}

exports.deleteAccount = (req, res) => {
	const internalError = (r) => {
		return r.status(500).send({ type: "general", message: "Internal error" });
	}
	const { jwtcookie } = req.cookies;
	jwt.verify(jwtcookie, secret, (error, decoded) => {
		if (error) {
			res.status(400).send({ type: "general", message: "Not authorized!" });
		} else {
			User.findOne({ email: decoded.email }).then((user) => {
				const webtoken = jwt.sign({}, secret, {
					expiresIn: '10'
				})
				if (!user) {
					res.status(400).send({ type: "general", message: "User not found!" });
				} else if (decoded.token !== user.token) {
					return (res.cookie('jwtcookie', webtoken, {
						secure: true,
						httpOnly: true,
						maxAge: 10,
					}).send({ type: "token", message: "Wrong token..." }));
				} else {
					User.deleteOne(user).then(() => {
						return (res.cookie('jwtcookie', webtoken, {
							secure: true,
							httpOnly: true,
							maxAge: 10,
						}).send({ message: "Successful deletion!" }))
					}).catch(() => internalError(res))
				}
			}).catch(() => internalError(res))
		}
	})
};
