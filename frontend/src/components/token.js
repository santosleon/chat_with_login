import '../style/signin.css';
import { serverUrl } from '../configs/serverConfig';
import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import actions from '../store/actions';

import { useSelector, useDispatch } from "react-redux";

const Token = () => {
  const store = useSelector(state => state);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [buttonErrorMessage, setButtonErrorMessage] = useState(undefined);
  const [tokenErrorMessage, setTokenErrorMessage] = useState(undefined);
  const [validToken, setValidToken] = useState(true);
  const formToken = React.createRef();
  const tokenRegex = /^[0-9]{6}$/;

  const onSubmit = (e) => {
    e.preventDefault();
    let tokenCheck = tokenRegex.test(formToken.current.value);
    setValidToken(tokenCheck);
    if (tokenCheck) {
      setLoading(true);
      axios.post(serverUrl + "/api/user/token", {
        token: formToken.current.value,
      }, {
        withCredentials: true,
        credentials: 'include',
      })
        .then(res => {
          setLoading(false);
          if (res.data.message === "Authorized successfully!") {
            dispatch(actions.authorize);
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
              else if (error.response.data.type === "token")
                setTokenErrorMessage(error.response.data.message);
            }
          }
        })
    }
  }

  if (!store.signedin) {
    return <Redirect to='/signin' />
  } else if (store.authorized) {
    return <Redirect to='/home' />
  }

  return (
    <div className='blue-gradient' >
      <Container className='d-flex justify-content-center'>
        <Row>
          <Col className='my-5'>
            <Container as="h2" id="signinTitle" className='mt-2 mb-5 text-center'>
              Step two ✌<br /> Please enter the<br /> webtoken sent by email.
            </Container>

            <Card body id="signinCard">
              <Form onSubmit={onSubmit} >
                <Form.Group className="mb-3" controlId="formToken">
                  <Form.Label>Token</Form.Label>
                  <Form.Control ref={formToken} className={(validToken && !tokenErrorMessage) ? "" : "is-invalid"} required />
                  <div className="invalid-feedback validation">
                    {tokenErrorMessage || "Please, enter a valid token"}
                  </div>
                </Form.Group>
                <Form.Group className="d-grid pt-3 is-invalid">
                  <Button type="submit" variant="primary">
                    {loading ?
                      <Spinner animation="border" variant="light" size="sm" />
                      : "OK"
                    }
                  </Button>
                  <div className={"validation text-center " + (buttonErrorMessage ? 'd-block' : 'd-none')}>
                    {buttonErrorMessage}
                  </div>
                </Form.Group>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Token;
