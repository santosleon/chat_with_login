module.exports = (app) => {
	const userOps = require("../operations/userOps.js");

	var router = require("express").Router();
	app.use('/api/user', router);

	// Create a new user
	router.post("/signup", userOps.signup);

	// Retrieve user
	router.post("/signin", userOps.signin);

	// Verify token
	router.post("/token", userOps.tokenVerification);

	// Get old messages
	router.get("/oldmessages", userOps.oldMessages);

	// logout
	router.get("/logout", userOps.logout);

	// Detete a user
	router.delete("/deleteaccount", userOps.deleteAccount);

};