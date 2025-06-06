import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

import {Navbar,Nav,Container,Button,Form,Row,Col,Spinner,Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

function Registration () {
    const navigate = useNavigate();
    const [userName,setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [userNameError,setUserNameError] = useState('');
    const [passWordError, setPassWordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);

        //set loading state to true to trigger spinner to show
        setLoading(true);
        try{
            // send to backend the given registration details
            const response = await axios.post(`${API_ENDPOINT}auth/register`,{
                username:userName,
                password:passWord,
                email,
                first_name:firstName,
                last_name:lastName,
                phone_number:phoneNumber
            });
            // set loading state to false after operation
            setLoading(false)
            setError('');
            //if no error, go back to login page
            navigate('/login');
        } catch(error) {
            console.error(error.response.data.message)
            if(error.response.data.message.includes("Username")){
                setUserNameError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Password")){
                setPassWordError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Email")){
                setEmailError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Phone Number")){
                setPhoneNumberError(error.response.data.message)
            }
            else if(error.response.data.message.includes("First Name")){
                setFirstNameError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Last Name")){
                setLastNameError(error.response.data.message)
            }
            
            setLoading(false);

            // setError(error.response.data.message);
        }
    };
    // const clearField = () => {
    //     setUserName('');
    //     setPassWord('');
    //     setEmail('');
    //     setPhoneNumber('');
    //     setFirstName('');
    //     setLastName('');
    //     setError('');
    // }
    // useEffect (() =>{
    //     clearField();
    // },[])

    return (
        <>
        <Navbar bg='success' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand>
                    <Nav.Link as={Link} to='/login'>
                        Campus Bell
                    </Nav.Link>
                </Navbar.Brand>
            </Container>
        </Navbar>

        <Container>
            <Row className = 'justify-content-md-center'>
                <Col md={6} sm={12}>
                <div>
                    <div className='container'>
                        <div>
                            <br />
                            <Card style={{boxShadow:'2px 2px 3px'}}>
                                <Card.Body>
                                <span style={{display:'flex',justifyContent:'center',fontSize:'24px'}}>Register</span>
                                <span style={{display:'flex',justifyContent:'center',fontWeight:'bold',fontSize:'30px'}}>Campus Bell</span> <br/>
                                <Form noValidate validated={validated}onSubmit={handleSubmit}>
                                <Form.Group controlId = 'formUsername'>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderRadius:'10px'}}
                                        placeholder='Enter username'
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}isInvalid={!!userNameError} required />
                                    <Form.Control.Feedback type='invalid'>{userNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                        type='password'
                                        style={{borderRadius:'10px'}}
                                        placeholder='Enter your password'
                                        value={passWord}
                                        onChange={(e) => setPassWord(e.target.value)}isInvalid={!!passWordError} required/>
                                <Form.Control.Feedback type='invalid'>{passWordError}</Form.Control.Feedback>
                            </Form.Group> <br/>

                            <Form.Group controlId = 'formFirstName'>
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderRadius:'10px'}}
                                        placeholder='Enter First Name'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}isInvalid={!!firstNameError} required />
                                    <Form.Control.Feedback type='invalid'>{firstNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formLastName'>
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderRadius:'10px'}}
                                        placeholder='Enter Last Name'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}isInvalid={!!lastNameError} required />
                                    <Form.Control.Feedback type='invalid'>{lastNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formEmail'>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type='email'
                                        style={{borderRadius:'10px'}}
                                        placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}isInvalid={!!emailError} required />
                                    <Form.Control.Feedback type='invalid'>{emailError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formPhoneNumber'>
                                    <Form.Label>Phone Number:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderRadius:'10px'}}
                                        placeholder='Enter phone number'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}isInvalid={!!phoneNumberError} required />
                                    <Form.Control.Feedback type='invalid'>{phoneNumberError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId='formButton'>
                                {error && <p style={{color:'red'}}>{error}</p>}

                                <Button variant='success' style={{borderRadius:'10px', width:'100%'}} 
                                block='block' type='submit' disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            /> <span>Please Wait</span>
                                        </> 
                                    ) : ('Register')}
                                </Button>
                            </Form.Group>
                            </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </Col>

            
            </Row>
        </Container>
        </>
    )
}
export default Registration;