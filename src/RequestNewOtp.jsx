import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Nav,Navbar,Container,Button,Form,Row,Col,Spinner,Card,Alert,ToastContainer, Toast} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import { FaBell } from "react-icons/fa";
import {API_ENDPOINT} from './Api';

function RequestNewOtp() {
    const [error,setError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [show, setShow] = useState(false)
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleRequestNewOtp = async (e) => {
        e.preventDefault();
        setButtonLoading(true)
        try {
            const reOtp = await axios.post(`${API_ENDPOINT}otp/regenerate`,{
                phone_number: phoneNumber,
                purpose_id: '3'
            })
            setPhoneNumber('')
            setFail(false)
            setButtonLoading(false)
            setSuccess(true)  
            setShow(true)
        } catch(error) {
            setError(error.response.data.message)
            setSuccess(false)
            setButtonLoading(false)
            setFail(true) 
            setShow(true)
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
            { success ?(<>
                <ToastContainer position={'top-end'} >
                    <Toast show={show} bg='success && text-white' onClose={() => setShow(false)}>
                        <Toast.Header closeButton={true}> 
                            <strong className="me-auto">😄 Success </strong>
                            </Toast.Header>
                        <Toast.Body>
                            <span>New OTP has been sent to your email. Go check it out</span>
                            <hr />
                            
                            <span><small>Close this notification to go back to login page</small></span>
                        </Toast.Body>
                    </Toast>

                </ToastContainer></>) : 
           
           fail &&(<>
            <ToastContainer position={'top-end'}>
                    <Toast show={show} bg='danger && text-white' onClose={() => setShow(false)}>
                        <Toast.Header closeButton={true}>
                            <strong className="me-auto">😔Oh. Sorry it's an error </strong>
                        </Toast.Header>
                        <Toast.Body>
                            <p>Please check the error message</p>
                        </Toast.Body>
                    </Toast>

                </ToastContainer>
           </>)
            }
           <Card className='otp-card' style={{border:'1px solid white', backgroundColor:'white', color:'black'}}>
            <Card.Body>
                
                <div style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                    
                
                <Form style={{width:'100%', borderRadius:'15px', marginTop:'8px'}} 
                onSubmit={handleRequestNewOtp}
                >
                    <div style={{width:'100%', marginBottom:'8px'}}>
                    <Form.Group>
                        <Form.Label>Phone Number</Form.Label>  
                            <Form.Control placeholder='Your Phone Number' style={{borderRadius:'15px'}}
                             value={phoneNumber}
                            onChange={(e)=>{
                                setPhoneNumber(e.target.value)
                                setError('')
                            }}
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
                        {error && <span style={{color:'red'}}><small>{error}</small></span>}
                    </div>
                </Form>
                
                </div>
                <div className='top-message'>
                    <span style={{color:'gray',fontSize:'12px'}}>Enter your phone number and after verifying, we'll send you a new otp </span>
                </div>
            </Card.Body>
            </Card> 
        </div>
        </div>
  )
}

export default RequestNewOtp
