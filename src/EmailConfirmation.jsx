import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Nav,Navbar,Container,Button,Form,Spinner,Card,FloatingLabel} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import { FaBell } from "react-icons/fa";

import {API_ENDPOINT} from './Api';

import './EmailConfirmation.css';

function EmailConfirmation () {
    const navigate = useNavigate();

    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState('');
    const [error,setError] = useState('');

    const [buttonLoading, setButtonLoading] = useState(false);

const otpVerify = async (e) => {
    setButtonLoading(true);
    setError('');
    e.preventDefault();
    console.log(email, otp)
    try {
            const response = await axios.post(`${API_ENDPOINT}otp/verify`,{
            email,
            otp});

        setButtonLoading(false);
        console.log(response)
        setEmail('');
        setOtp('');

        navigate('/login');
    } catch(error) {
        setButtonLoading(false);
        setError(error.response.data.message)
    }
}

    return (
       <div className='page-bg'>
        <Navbar data-bs-theme='dark'>
            <Container>
                <div className='brand' style={{display:'flex', alignItems:'center'}}>
                <FaBell style={{color:'#ffac33'}} />
                <Navbar.Brand className='brand' style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>
                    <Nav.Link as={Link} to='/'>
                    Campus Bell
                    </Nav.Link>
                    </Navbar.Brand>
                    </div>
                </Container>
            </Navbar>
            
            <div style={{
            display:'flex',
            width:'100vw',
            height:'100vh',
            alignItems:'center',
            justifyContent:'center'
                }}>

           <Card className='otp-card'>
            <Card.Body>
                <div className='top-message'>
                    <span>Please check the email sent to you </span>
                </div>
                <div style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                <Form style={{width:'100%', borderRadius:'15px', marginTop:'8px'}} onSubmit={otpVerify}>
                    <div style={{width:'100%', marginBottom:'8px'}}>
                    <Form.Group>
                        <FloatingLabel label='Email'>
                            <Form.Control placeholder='Enter Email' style={{borderRadius:'15px'}}
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}>
                            </Form.Control>
                        </FloatingLabel>  
                    </Form.Group>
                    </div>

                    <div style={{width:'100%'}}>
                    <Form.Group>
                        <FloatingLabel label='OTP'>
                            <Form.Control placeholder='Enter OTP' style={{borderRadius:'15px'}}
                            value={otp}
                            onChange={(e)=>setOtp(e.target.value)}>
                            </Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    </div>

                    <div style={{marginTop:'8px'}}>
                    <Form.Group>
                        <Button className='otp-button' disabled={buttonLoading} type='submit'>
                          {
                            buttonLoading ? (
                                <div>
                                    <Spinner animation="border" size='sm' />
                                </div>

                            ) : (
                                'Confirm'
                            )
                          }
                        
                            </Button>
                    </Form.Group>
                    </div>
                    <div style={{marginTop:'8px'}}>
                        {error && <span style={{color:'red'}}>{error}</span>}
                    </div>
                </Form>
                </div>
                <div style={{fontSize:'12px'}}>
                    <span>Didn't received the code?</span> <span> <Link to={'/request-new-otp'}>Request</Link> for new one</span>
                </div>
            </Card.Body>
            </Card> 
        </div>
        </div>
    )
}
export default EmailConfirmation;