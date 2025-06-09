import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

import {Nav,Navbar,Container,Button,Form,Row,Col,Spinner,Card,FloatingLabel} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import { FaUserAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa";

import {API_ENDPOINT} from './Api';

import './Login.css';

function EmailConfirmation () {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const[passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false)


    return (
       <>
        
        <Navbar data-bs-theme='dark'>
            <Container>
                <Navbar.Brand>
                <Nav.Link as={Link} to='/login' style={{color:'#ffac33',textShadow:'1px 1px white',fontWeight:'bold'}}>
                Campus Bell
                </Nav.Link>
                </Navbar.Brand>
                </Container>
            </Navbar>
            
            <div style={{
            display:'flex',
            width:'100vw',
            height:'100vh',
            alignItems:'center',
            justifyContent:'center'
                }}>

           <Card style={{height:'250px', width:'400px'}}>
            <Card.Body>
                <div>
                    <span>Please check the email sent to you </span>
                </div>
                <div style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                <Form style={{width:'100%', borderRadius:'15px'}}>
                    <div style={{width:'100%', marginBottom:'8px'}}>
                    <Form.Group>
                        <Form.Control placeholder='Enter Email'>

                        </Form.Control>
                    </Form.Group>
                    </div>

                    <div style={{width:'100%'}}>
                    <Form.Group>
                        <Form.Control placeholder='Enter OTP'>

                        </Form.Control>
                    </Form.Group>
                    </div>

                    <div style={{marginTop:'8px'}}>
                    <Form.Group>
                        <Button>Confirm</Button>
                    </Form.Group>
                    </div>
                </Form>
                </div>
            </Card.Body>
            </Card> 
        </div>
        </>
    )
}
export default EmailConfirmation;