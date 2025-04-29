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
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setLoading(false)
            setError(error.response.data.message);
        }
    };
    const clearField = () => {
        setUserName('');
        setPassWord('');
        setEmail('');
        setPhoneNumber('');
        setFirstName('');
        setLastName('');
        setError('');
    }
    useEffect (() =>{
        clearField();
    },[])

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
                            <Card>
                                <Card.Body>
                                <span style={{display:'flex',justifyContent:'center',fontSize:'24px'}}>Register</span>
                                <span style={{display:'flex',justifyContent:'center',fontWeight:'bold',fontSize:'30px'}}>Campus Bell</span> <br/>
                                <Form onSubmit = {handleSubmit}>
                                <Form.Group controlId = 'formUsername'>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control className='form-control-sm rounded-0' 
                                        type='text'
                                        placeholder='Enter username'
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)} required />
                                </Form.Group> <br/>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control className='form-control-sm-rounded-0'
                                        type='password'
                                        placeholder='Enter your password'
                                        value={passWord}
                                        onChange={(e) => setPassWord(e.target.value)} required/>
                            </Form.Group> <br/>

                            <Form.Group controlId = 'formFirstName'>
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control className='form-control-sm rounded-0' 
                                        type='text'
                                        placeholder='Enter First Name'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)} required />
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formLastName'>
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control className='form-control-sm rounded-0' 
                                        type='text'
                                        placeholder='Enter Last Name'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)} required />
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formEmail'>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control className='form-control-sm rounded-0' 
                                        type='email'
                                        placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formPhoneNumber'>
                                    <Form.Label>Phone Number:</Form.Label>
                                    <Form.Control className='form-control-sm rounded-0' 
                                        type='text'
                                        placeholder='Enter phone number'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)} required />
                                </Form.Group> <br/>

                            <Form.Group controlId='formButton'>
                                {error && <p style={{color:'red'}}>{error}</p>}

                                <Button variant='success' className='btn btn-block bg-customer btn-flat rounded-0' 
                                size='sm' block='block' type='submit' disabled={loading}>
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