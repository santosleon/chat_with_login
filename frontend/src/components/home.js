import '../style/home.css';
import { serverUrl } from '../configs/serverConfig';
import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Chat from './chat';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { ReactComponent as SearchIcon } from '../assets/search_black_24dp.svg';
import { ReactComponent as NotificationIcon } from '../assets/notifications_black_24dp.svg';
import { ReactComponent as UserIcon } from '../assets/person_black_24dp.svg';

import { useSelector, useDispatch } from "react-redux";
import actions from '../store/actions';

const Home = () => {

	const [searchOpen, setSearchOpen] = useState(false);
	const formSearch = React.createRef();

	const store = useSelector(state => state);
	const dispatch = useDispatch();

	const onSubmit = (e) => {
		e.preventDefault();
		if (!searchOpen) {
			formSearch.current.classList.add('search-input-expand');
			formSearch.current.focus();
			formSearch.current.select();
			setSearchOpen(true);
		} else {

		}
	}

	const onBlur = (e) => {
		e.preventDefault();
		if (searchOpen && formSearch.current.value === '') {
			formSearch.current.classList.remove('search-input-expand');
			setSearchOpen(false);
		}
	}

	const logout = () => {
		axios.get(serverUrl + "/api/user/logout", {
			withCredentials: true,
			credentials: 'include',
		})
			.then(res => {
				if (res.data.message === "Successful logout!") {
					dispatch(actions.signout);
				} else {
					console.log("Something went wrong...");
				}
			}).catch(error => {
				console.log(error);
			})
	}

	const deleteAccount = () => {
		axios.delete(serverUrl + "/api/user/deleteaccount", {
			withCredentials: true,
			credentials: 'include',
		})
			.then(res => {
				if (res.data.message === "Successful deletion!") {
					dispatch(actions.signout);
				} else if (res.data.type === "token") {
					dispatch(actions.signout);
				} else {
					console.log("Something went wrong...");
				}
			}).catch(error => {
				console.log(error);
			})
	}

	if (!store.signedin) {
		return <Redirect to='/signin' />;
	} else if (!store.authorized) {
		return <Redirect to='/token' />;
	}

	return (
		<>
			<Navbar className="home-navbar sticky-top" expand="lg">
				<Container fluid className="mx-3">
					<Form onSubmit={onSubmit} id="search-form" className="d-flex">
						<Form.Control ref={formSearch} onBlur={onBlur} id="search-input" type="search" placeholder="Search" aria-label="Search" />
						<Button id="search-button" type="submit" aria-label="search"><SearchIcon id="search-icon" /></Button>
					</Form>
					<div className="d-flex align-itens-center">
						<Dropdown>
							<Dropdown.Toggle variant="link" id="notification-button" aria-label="notification">
								<NotificationIcon id="notification-icon" />
							</Dropdown.Toggle>
							<Dropdown.Menu id="notification-dropdown">
								<Dropdown.Item>Action</Dropdown.Item>
								<Dropdown.Item>Another action</Dropdown.Item>
								<Dropdown.Item>Something else</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Dropdown>
							<Dropdown.Toggle variant="link" id="user-button" aria-label="profile">
								<UserIcon id="user-icon" />
							</Dropdown.Toggle>
							<Dropdown.Menu id="user-dropdown">
								<Dropdown.Item>Profile</Dropdown.Item>
								<Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
								<Dropdown.Item className="delete-account" onClick={deleteAccount}>Delete Account</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>

				</Container>
			</Navbar>
			<Chat />
		</>
	);
}

export default Home;
