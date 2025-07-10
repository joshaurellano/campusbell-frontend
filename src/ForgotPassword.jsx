import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {Nav,Navbar,Container,Button,Form,Row,Col,Spinner,Card,FloatingLabel,Toast,ToastContainer} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';
import axios from 'axios';

function ForgotPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [saveToken, setSaveToken] = useState('')
    const [error, setError] = useState('')
    const [errorToast, setErrorToast] = useState(false)

    const openToast = () => setErrorToast(true)
    const closeToast = () => {
        setErrorToast(false)
        navigate('/login')    
    }

    const verifyToken = async () => {
        try {
            const resetToken = await axios.get(`${API_ENDPOINT}auth/password-reset/${token}`)
            setSaveToken(resetToken)
        } catch (error) {
            setError(error.response.data.message);
            openToast();
            // navigate('/login');
        }
    }

    useEffect(() =>{
        verifyToken();
    },[])
  return (
    <div className='bg-dark' style={{ height:'100vh',width:'100vw',display:'flex', justifyContent:'center',alignItems:'center'}}>
        {
            errorToast && (
                <>
                    <ToastContainer
                        position='top-end'
                        style={{ boxShadow: '0 0 10px rgba(0,0,0,0.2)'}}>
                    <Toast show={openToast} onClose={closeToast}
                        bg='warning'
                        text='dark'>
                       <Toast.Header>
                            <strong className="me-auto"> ⚠️Session Expired</strong>
                        </Toast.Header>
                        <Toast.Body style={{color: '#343a40'}}>Your reset link has expired. Please request a new one.</Toast.Body>
                        </Toast> 
                        </ToastContainer>
                </>
            )
        }
        <Card style={{width:'300px',height:'300px'}}>
            <Card.Body>
                <div className='flex-column' style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                    <span style={{fontWeight:'bold', fontSize:'larger'}}>Password Reset</span>
                
                <Form style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',}}>
                  
                        <Form.Group style={{marginBottom:'8px',width:'100%'}}>
                            <Form.Control
                            disabled={error}
                            placeholder='Enter your new password'>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group style={{marginBottom:'8px',width:'100%'}}>
                            <Form.Control
                            disabled={error}
                            placeholder='Re enter your password'>

                            </Form.Control>
                        </Form.Group> 

                    <Form.Group style={{width:'100%'}}>
                        <Button
                        disabled={error}
                        style={{width:'100%'}}>
                            Update password
                        </Button>
                    </Form.Group>
                </Form>
                </div>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ForgotPassword
