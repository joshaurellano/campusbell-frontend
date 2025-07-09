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
    <div style={{ height:'100vh',width:'100vw',display:'flex', justifyContent:'center',alignItems:'center'}}>
        {
            errorToast && (
                <>
                    <ToastContainer
                        position='top-end'>
                    <Toast show={openToast} onClose={closeToast}
                        bg='danger'>
                        <Toast.Header closeButton={true}>
                             <img
                                src="holder.js/20x20?text=%20"
                                className="rounded me-2"
                                alt=""
                                />
                            <strong className="me-auto"> Error</strong>
                             
                        </Toast.Header>
                        <Toast.Body className="text-white" style={{color:'white'}}> {error}</Toast.Body>
                    </Toast>
                    </ToastContainer>
                </>
            )
        }
        <Card style={{width:'300px',height:'300px'}}>
            <Card.Body>
                <div style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                <Form style={{width:'100%'}}>
                    <Form.Group style={{marginBottom:'8px'}}>
                        <Form.Control
                        placeholder='Enter your new password'>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group style={{marginBottom:'8px'}}>
                        <Form.Control
                        placeholder='Re enter your password'>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Button>Update password</Button>
                    </Form.Group>
                </Form>
                </div>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ForgotPassword
