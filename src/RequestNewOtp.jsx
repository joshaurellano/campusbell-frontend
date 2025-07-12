import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Nav,Navbar,Container,Button,Form,Row,Col,Spinner,Card,FloatingLabel} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import { FaBell } from "react-icons/fa";
import {API_ENDPOINT} from './Api';

function RequestNewOtp() {
    const [error,setError] = useState('');
    const [username, setUsername] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);

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

           <Card className='otp-card' style={{border:'1px solid white', backgroundColor:'white', color:'black'}}>
            <Card.Body>
                
                <div style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                <Form style={{width:'100%', borderRadius:'15px', marginTop:'8px'}} 
                // onSubmit={otpVerify}
                >
                    <div style={{width:'100%', marginBottom:'8px'}}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>  
                            <Form.Control placeholder='Your Username' style={{borderRadius:'15px'}}
                            // value={email}
                            // onChange={(e)=>setEmail(e.target.value)}
                            >
                            </Form.Control>
                        
                    </Form.Group>
                    </div>

                    <div style={{marginTop:'8px'}}>
                    <Form.Group>
                        <Button className='otp-button' 
                        disabled={buttonLoading} 
                        type='submit'>
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
                <div className='top-message'>
                    <span style={{color:'gray',fontSize:'12px'}}>Enter your username and after verifying, we'll send you a new otp </span>
                </div>
            </Card.Body>
            </Card> 
        </div>
        </div>
  )
}

export default RequestNewOtp
