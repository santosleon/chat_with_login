import '../style/signin.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

const Recover = () => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [validEmail, setValidEmail] = useState(true);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}$/;
  const formEmail = React.createRef();
  const submit = () => {
    let emailCheck = emailRegex.test(formEmail.current.value);
    setValidEmail(emailCheck);
    setErrorMessage('');
  }
  return (
    <div className='blue-gradient' >
      <Container className='d-flex justify-content-center'>
        <Row>
          <Col className='my-5'>
            <Container as="h2" id="signinTitle" className='mt-2 mb-5 text-center'>
              Forgot your password? 🙃<br /> No problem.
            </Container>

            <Card body id="signinCard">
              <Form>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control ref={formEmail} className={(validEmail && !errorMessage) ? "" : "is-invalid"} required />
                  <div className="invalid-feedback validation">
                    {errorMessage || "Please, enter a valid email address"}
                  </div>
                </Form.Group>
                <div className="d-grid pt-3">
                  <Button onClick={submit} variant="primary">
                    Send me a recover link
                  </Button>
                </div>
                <div className="d-flex pt-4 justify-content-between">
                  <Link to="/signup" className="signinLink">
                    Create an account
                  </Link>
                  <Link to="/signin" className="signinLink">
                    Sing in
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

export default Recover;
