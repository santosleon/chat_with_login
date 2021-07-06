import '../style/chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { serverUrl, wsUrl } from '../configs/serverConfig';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { ReactComponent as SendIcon } from '../assets/send_black_24dp.svg';

import { useSelector } from "react-redux";

const Chat = () => {

	const addNewChanel = React.createRef();
	const chanelForm = React.createRef();
	const chanelInput = React.createRef();
	const chatDiv = useRef(null);

	const store = useSelector(state => state);

	const [selectedRoom, setSelectedRoom] = useState('');
	const [newMessage, setNewMessage] = useState('');
	const [messages, setMessages] = useState({});
	const [newChanel, setNewChanel] = useState('');
	const [chanels, setChanels] = useState([]);
	const ws = useRef(null);

	useEffect(() => {
		axios.get(serverUrl + "/api/user/oldmessages", {
			withCredentials: true,
			credentials: 'include',
		})
			.then(res => {
				const ch = [];
				const m = {};
				res.data.forEach(k => {
					const { room, username, message } = k;
					if (!ch.includes(room)) ch.push(room);
					if (m[room] === undefined) m[room] = [];
					m[room].push({ username, message });
				});
				setChanels(ch);
				setMessages(m);
				setSelectedRoom(ch[0]);
			}).catch(error => {
				if (error) {
					if (String(error).endsWith("Network Error"))
						console.log("Connection Error");
					else if (error.response && error.response.data && error.response.data.message) {
						if (error.response.data.type === "general")
							console.log(error.response.data.message);
					}
				}
			})

		ws.current = new WebSocket(wsUrl);
		ws.current.onopen = () => console.log('connected');
		ws.current.onclose = () => console.log('disconnected');
		return (() => ws.current.close());
	}, []);

	useEffect(() => {
		ws.current.onmessage = (event) => {
			const message = JSON.parse(event.data);
			let newMessages = JSON.parse(JSON.stringify(messages));
			if (newMessages[message.room] === undefined) {
				if (chanels.length === 0) setSelectedRoom(message.room);
				setChanels([...chanels, message.room]);
				newMessages[message.room] = [];
			}
			newMessages[message.room].push({ username: message.username, message: message.message });
			setMessages(newMessages);
		}
		if (chatDiv.current) {
			chatDiv.current.addEventListener('DOMNodeInserted', event => {
				const { currentTarget: target } = event;
				target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
			});
		}
	}, [messages, chanels]);

	const submitMessage = (e, messageString) => {
		e.preventDefault();
		setNewMessage('');
		if (messageString !== '') {
			const message = { room: selectedRoom, username: store.username, message: messageString };
			if (!chanels.includes(selectedRoom))
				setChanels([...chanels, selectedRoom]);
			ws.current.send(JSON.stringify(message));
			let newMessages = JSON.parse(JSON.stringify(messages));
			if (newMessages[selectedRoom] === undefined) newMessages[selectedRoom] = [];
			newMessages[selectedRoom].push({ username: store.username, message: messageString });
			setMessages(newMessages);
		}
	}

	const expandAddChanel = (e) => {
		chanelForm.current.classList.remove('hide');
		setTimeout(() => {
			chanelInput.current.focus();
		}, 500);
	}

	const onCancelChanel = (e) => {
		chanelForm.current.classList.add('hide');
		chanelInput.current.value = '';
	}

	const onAddChanel = (e) => {
		e.preventDefault();
		chanelForm.current.classList.add('hide');
		if (newChanel && newChanel !== '') {
			if (!chanels.includes(newChanel))
				setChanels([...chanels, newChanel]);
			setSelectedRoom(newChanel);
		}
		chanelInput.current.value = '';
		setNewChanel('');
	}

	return (
		<div>
			<Container className="mx-0 container-fluid mw-100">
				<Row className="d-flex">
					<Col className="pt-4 px-0 col-4 col-lg-2 chanels-background">
						<p className="fs-5 text-center chanels-title">Chanels</p>
						<div ref={addNewChanel} className="d-flex">
							<Button
								className="add-chanel-button"
								aria-label="add-chanel-button"
								onClick={expandAddChanel}
							>
								Add New Chanel
							</Button>
						</div>
						<Form onSubmit={onAddChanel} ref={chanelForm} id="new-chanel" className="hide">
							<FormControl
								ref={chanelInput}
								id="new-chanel-input"
								placeholder="Chanel Name"
								className="text-center"
								onChange={(e) => setNewChanel(e.target.value)}
							/>
							<div className="d-flex">
								<Button
									className="new-chanel-button"
									aria-label="cancel-new-chanel"
									onClick={onCancelChanel}
								>
									cancel
								</Button>
								<Button
									className="new-chanel-button"
									aria-label="add-new-chanel"
									type="submit"
								>
									ok
								</Button>
							</div>
						</Form>
						{chanels.map((room, index) =>
							<Button
								className={"chanel-button " + ((room === selectedRoom) ? 'selected-chanel' : '')}
								aria-label={room + '-chanel'}
								key={index}
								onClick={() => setSelectedRoom(room)}
							>
								<strong>{"#" + String(room)}</strong>
							</Button>
						)}
					</Col>
					<Col className="p-0 col-8 col-lg-10">
						{(chanels !== undefined && chanels.length > 0) ?
							<div>
								<Container ref={chatDiv} className="pt-4 mx-0 chat-div">
									{(messages[selectedRoom] !== undefined) ?
										messages[selectedRoom].map((message, index) =>
											<p key={index} className={(message.username === store.username) ? 'user-message' : 'chat-message'}>
												<strong>{(message.username !== store.username) ? (message.username + ":") : ''}</strong> <em>{message.message}</em>
											</p>
										) : <div />}
								</Container>
								<Form
									className='mx-4 my-4 d-flex'
									onSubmit={(e) => submitMessage(e, newMessage)}
								>
									<FormControl
										className='w-100'
										type="text"
										placeholder={'Enter message...'}
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
									/>
									<Button className='message-button' variant='link' type="submit" aria-label="send">
										<SendIcon />
									</Button>
								</Form>
							</div>
							:
							<div className='mt-5 fs-5 text-center'>
								<p>Hello! 👋<br /> Create a new chanel to start chatting!</p>
							</div>
						}
					</Col>
				</Row>
			</Container>

		</div >
	)
}

export default Chat;