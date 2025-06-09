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

    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState('');
    const [error,setError] = useState('');

const otpVerify = async (e) => {
    e.preventDefault();
    console.log(email, otp)
    try {
            const response = await axios.post(`${API_ENDPOINT}otp/verify`,{
            email,
            otp});
        
        console.log(response)
        setEmail('');
        setOtp('');
    } catch(error) {
        setError(error.response.data.message)
    }
}

    return (
       <>
        <Navbar data-bs-theme='dark'>
            <Container>
                <Navbar.Brand>
                <Nav.Link as={Link} to='/login' style={{color:'black',textShadow:'1px 1px white',fontWeight:'bold'}}>
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
                <Form style={{width:'100%', borderRadius:'15px'}} onSubmit={otpVerify}>
                    <div style={{width:'100%', marginBottom:'8px'}}>
                    <Form.Group>
                        <Form.Control placeholder='Enter Email' style={{borderRadius:'15px'}}
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    </div>

                    <div style={{width:'100%'}}>
                    <Form.Group>
                        <Form.Control placeholder='Enter OTP' style={{borderRadius:'15px'}}
                        value={otp}
                        onChange={(e)=>setOtp(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    </div>

                    <div style={{marginTop:'8px'}}>
                    <Form.Group>
                        <Button style={{borderRadius:'20px', width:'120px'}} type='submit'>Confirm</Button>
                    </Form.Group>
                    </div>
                    <div style={{marginTop:'8px'}}>
                        {error && <span style={{color:'red'}}>{error}</span>}
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