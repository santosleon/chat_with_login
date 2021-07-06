import '../style/signin.css';
import { serverUrl } from '../configs/serverConfig';
import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import actions from '../store/actions';

import { useSelector, useDispatch } from "react-redux";

const Signup = () => {

	const store = useSelector(state => state);
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [buttonErrorMessage, setButtonErrorMessage] = useState(undefined);
	const [nameErrorMessage, setNameErrorMessage] = useState(undefined);
	const [emailErrorMessage, setEmailErrorMessage] = useState(undefined);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState(undefined);
	const [validName, setValidName] = useState(true);
	const [validEmail, setValidEmail] = useState(true);
	const [validPassword, setValidPassword] = useState({
		numeric: true,
		lowercase: true,
		uppercase: true,
		special: true,
		min: true,
		all: true,
	});

	const nameRegex = /(?=.+)/;
	const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}$/;
	const numericRegex = /(?=.*\d)/;
	const lowercaseRegex = /(?=.*[a-z])/;
	const uppercaseRegex = /(?=.*[A-Z])/;
	const specialRegex = /(?=.*\W)/;
	const minRegex = /(?=.{8,})/;

	const formName = React.createRef();
	const formEmail = React.createRef();
	const formPassword = React.createRef();

	const onSubmit = (e) => {
		e.preventDefault();
		let nameCheck = nameRegex.test(formName.current.value);
		let emailCheck = emailRegex.test(formEmail.current.value);
		let numeric = numericRegex.test(formPassword.current.value);
		let lowercase = lowercaseRegex.test(formPassword.current.value);
		let uppercase = uppercaseRegex.test(formPassword.current.value);
		let special = specialRegex.test(formPassword.current.value);
		let min = minRegex.test(formPassword.current.value);
		let all = numeric && lowercase && uppercase && special && min;
		setButtonErrorMessage(undefined);
		setEmailErrorMessage(undefined);
		setPasswordErrorMessage(undefined);
		setValidName(nameCheck);
		setValidEmail(emailCheck);
		setValidPassword({ numeric, lowercase, uppercase, special, min, all });
		if (nameCheck && emailCheck && all) {
			setLoading(true);
			axios.post(serverUrl + "/api/user/signup", {
				name: formName.current.value,
				email: formEmail.current.value,
				password: formPassword.current.value,
			}, {
				withCredentials: true,
				credentials: 'include',
			})
				.then(res => {
					setLoading(false);
					if (res.data.message === "Successful registration!") {
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
							else if (error.response.data.type === "name")
								setNameErrorMessage(error.response.data.message);
							else if (error.response.data.type === "email")
								setEmailErrorMessage(error.response.data.message);
							else if (error.response.data.type === "password")
								setPasswordErrorMessage(error.response.data.message);
						}
					}
				})
		}
	}

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			Passwords must contain at least: 8 characters in total, 1 special, 1 uppercase, 1 lowercase and 1 number
		</Tooltip>
	);

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
							Welcome! 😃
						</Container>
						<Card body id="signinCard">
							<Form onSubmit={onSubmit}>
								<Form.Group className="mb-3" controlId="formName">
									<Form.Label>Name</Form.Label>
									<Form.Control ref={formName} className={(validName && !nameErrorMessage) ? "" : "is-invalid"} required />
									<div className="invalid-feedback validation">
										{nameErrorMessage || "Please, enter a valid username"}
									</div>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formEmail">
									<Form.Label>Email</Form.Label>
									<Form.Control ref={formEmail} className={(validEmail && !emailErrorMessage) ? "" : "is-invalid"} required />
									<div className="invalid-feedback validation">
										{emailErrorMessage || "Please, enter a valid email address"}
									</div>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formPassword">
									<Form.Label>
										<OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
											<div>Password (?)</div>
										</OverlayTrigger></Form.Label>
									<Form.Control ref={formPassword} className={(validPassword.all && !passwordErrorMessage) ? "" : "is-invalid"} type='password' required />
									<div className="invalid-feedback validation">
										{passwordErrorMessage ||
											<div>Your password must contain at least:
												{validPassword.min ? <div /> : <div>• 8 characters</div>}
												{validPassword.special ? <div /> : <div>• 1 special</div>}
												{validPassword.uppercase ? <div /> : <div>• 1 uppercase</div>}
												{validPassword.lowercase ? <div /> : <div>• 1 lowercase</div>}
												{validPassword.numeric ? <div /> : <div>• 1 number</div>}
											</div>
										}
									</div>
								</Form.Group>
								<Form.Group className="d-grid pt-3 is-invalid">
									<Button type="submit" variant="primary">
										{loading ?
											<Spinner animation="border" variant="light" size="sm" />
											: "Sign up"
										}
									</Button>
									<div className={"validation text-center " + (buttonErrorMessage ? 'd-block' : 'd-none')}>
										{buttonErrorMessage}
									</div>
								</Form.Group>
								<div className="d-flex pt-4 justify-content-between">
									<Link to="/signin" className="signinLink">
										Sign in
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

export default Signup;
