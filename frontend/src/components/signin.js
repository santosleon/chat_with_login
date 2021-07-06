import '../style/signin.css';
import { serverUrl } from '../configs/serverConfig';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import { useSelector, useDispatch } from "react-redux";
import actions from '../store/actions';

const Signin = () => {

	const store = useSelector(state => state);
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [buttonErrorMessage, setButtonErrorMessage] = useState(undefined);
	const [emailErrorMessage, setEmailErrorMessage] = useState(undefined);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState(undefined);
	const [validEmail, setValidEmail] = useState(true);
	const [validPassword, setValidPassword] = useState(true);
	const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}$/;

	const formEmail = React.createRef();
	const formPassword = React.createRef();

	const onSubmit = (e) => {
		e.preventDefault();
		let emailCheck = emailRegex.test(formEmail.current.value);
		let passwordCheck = (formPassword.current.value !== '');
		setButtonErrorMessage(undefined);
		setEmailErrorMessage(undefined);
		setPasswordErrorMessage(undefined);
		setValidEmail(emailCheck);
		setValidPassword(passwordCheck);
		if (emailCheck && passwordCheck) {
			setLoading(true);
			axios.post(serverUrl + "/api/user/signin", {
				email: formEmail.current.value,
				password: formPassword.current.value,
			}, {
				withCredentials: true,
				credentials: 'include',
			})
				.then(res => {
					setLoading(false);
					if (res.data.message === "Successful signin!") {
						dispatch(actions.signin(res.data.username));
					} else {
						setButtonErrorMessage("Something went wrong...");
					}
				}).catch(error => {
					setLoading(false);
					if (error) {
						if (String(error).endsWith("Network Error"))
							setButtonErrorMessage("Connection Error");
						else if (error.response && error.response.data && error.response.data.message) {
							if (error.response.data.type === "general")
								setButtonErrorMessage(error.response.data.message);
							else if (error.response.data.type === "email")
								setEmailErrorMessage(error.response.data.message);
							else if (error.response.data.type === "password")
								setPasswordErrorMessage(error.response.data.message);
						}
					}
				})
		}
	}

	if (store.signedin) {
		if (store.authorized)
			return <Redirect to='/home' />;
		else
			return <Redirect to='/token' />;
	}

	return (
		<div className='blue-gradient' >
			<Container className='d-flex justify-content-center'>
				<Row>
					<Col className='my-5'>
						<Container as="h2" id="signinTitle" className='mt-2 mb-5 text-center'>
							Welcome! 😃<br />Please sign in.
						</Container>
						<Card body id="signinCard">
							<Form onSubmit={onSubmit}>
								<Form.Group className="mb-3" controlId="formEmail">
									<Form.Label>Email</Form.Label>
									<Form.Control ref={formEmail} className={(validEmail && !emailErrorMessage) ? "" : "is-invalid"} required />
									<div className="invalid-feedback validation">
										{emailErrorMessage || "Please, enter a valid email address"}
									</div>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formPassword">
									<Form.Label>Password</Form.Label>
									<Form.Control ref={formPassword} className={validPassword && !passwordErrorMessage ? "" : "is-invalid"} type='password' required />
									<div className="invalid-feedback validation">
										{passwordErrorMessage || "Please, enter the password"}
									</div>
								</Form.Group>
								<Form.Group className="d-grid pt-3 is-invalid">
									<Button type="submit" variant="primary">
										{loading ?
											<Spinner animation="border" variant="light" size="sm" />
											: "Sign in"
										}
									</Button>
									<div className={"validation text-center " + (buttonErrorMessage ? 'd-block' : 'd-none')}>
										{buttonErrorMessage}
									</div>
								</Form.Group>
								<div className="d-flex pt-4 justify-content-between">
									<Link to="/signup" className="signinLink">
										Create an account
									</Link>
									<Link to="/recover" className="signinLink">
										Forgot password?
									</Link>
								</div>
							</Form>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Signin;
