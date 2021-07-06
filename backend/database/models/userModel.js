const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			validate: (v) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}$/.test(v),
		},
		password: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);