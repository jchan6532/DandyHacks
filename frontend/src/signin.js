import './App.css';
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';

const Signin = ({navigate}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [validationRes, setValidationRes] = useState({
        status: false,
        message: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                age: age
            })
        })
        .then(response => response.json())
        .then((data) => {

            if (data.status == true) {
                navigate(`/${data.username}`);
            }
            setValidationRes(data);
        });
    };

    return (
        <div>
            <h1 className='heading' >sign up</h1>
            {/* <LinkContainer to="/signin">
              <Nav.Link className='nav-link'>
                <strong>Sign In</strong>
              </Nav.Link>
            </LinkContainer> */}
            <Button variant="primary" onClick={() => navigate('/login')}>
                log in
            </Button>
            {/* <h2 onClick={() => navigate('/signin')}>sign in</h2> */}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Enter Age" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <p>{validationRes.message}</p>
            </Form>
        </div>
    )
}

export default Signin;