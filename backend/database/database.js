const dbConfig = require("../configs/dbConfig.js");
const mongoose = require("mongoose");
const userModel = require("./models/userModel.js");
const messageModel = require("./models/messageModel.js");

mongoose.Promise = global.Promise;

const db = {
	mongoose: mongoose,
	url: dbConfig.url,
	users: userModel,
	message: messageModel,
};

module.exports = db;