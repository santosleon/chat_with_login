# Chat with login
This app utilizes a MERN stack (MongoDB, Express, ReactJS, NodeJS) and other technologies, like WebSockets, JSON Web Token, Bcrypt, Axios and Redux. It allows the users to signin to a chat page like Slack.

## How to use?
You need to add 'backend/configs/.env' file to run the project. The content of this file looks like:
```sh
module.exports = {
	secret: <SUPER_SECRET_SERVER_PASSWORD>,
	emailAddress: <EMAIL_THAT_WILL_SEND_WEBTOKENS>,
	emailPassword: <EMAIL_PASSWORD>,
};
```
Then, you can follow the recomendations of [NodeMailer](https://nodemailer.com/) to setup the mailer.

## Screenshots
SignIn

<img src="https://github.com/santosleon/chat_with_login/blob/main/screenshots/signin.jpg" height="400"/>

SignUp

<img src="https://github.com/santosleon/chat_with_login/blob/main/screenshots/signup.jpg" height="400"/>

Recover Password

<img src="https://github.com/santosleon/chat_with_login/blob/main/screenshots/recover.jpg" height="400"/>

Add New Chanel

<img src="https://github.com/santosleon/chat_with_login/blob/main/screenshots/newchanel.jpg" height="400"/>

Chat Example

<img src="https://github.com/santosleon/chat_with_login/blob/main/screenshots/chat.jpg" height="400"/>

## Licence
GLPv3, [read more](https://github.com/santosleon/chat_with_login/blob/main/LICENSE)
