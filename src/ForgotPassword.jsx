import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {Nav,Navbar,Container,Button,Form,Row,Col,Spinner,Card,FloatingLabel,Toast,ToastContainer,Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2'

import {API_ENDPOINT} from './Api';
import axios from 'axios';

function ForgotPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('') 
    const [saveToken, setSaveToken] = useState('')
    const [error, setError] = useState('')
    const [formError, setFormError] = useState('')
    const [errorToast, setErrorToast] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    
    const openToast = () => setErrorToast(true)
    const closeToast = () => {
        setErrorToast(false)
        navigate('/login')    
    }

    const verifyToken = async () => {
        try {
            const resetToken = await axios.get(`${API_ENDPOINT}auth/password-reset/${token}`)
            //console.log(resetToken.data.result)
            setSaveToken(resetToken.data.result)

        } catch (error) {
            setError(error.response.data.message);
            openToast();
            // navigate('/login');
        }
    }
    const updatePassword = async (e) => {
        e.preventDefault();
        //console.log(saveToken)
        setButtonLoading(true)
        try {
            const update_pass = await axios.put(`${API_ENDPOINT}user/password/${token}`,{
                password
            })
            setButtonLoading(false)
            
            Swal.fire({
                title: "Success!",
                text: "Password Updated, Close this alert to go back to login page",
                icon: "success",
                showCloseButton: true,
                }). then((result) => {
                    if(result.isConfirmed){
                        navigate('/login')
                    }
                })
            setPassword('')
            setRePassword('')
            
        } catch (error) {
            setFormError(error.response.data.message);
            setButtonLoading(false)
            
            Swal.fire({
            title: "Error!",
            text: "There was an error updating you password",
            icon: "error"
            });

            setPassword('')
            setRePassword('')
        }
    }
    const checkPassword = async () => {
        try{
            if (password === rePassword) {
                setFormError('')
            } else if(password !== rePassword){
                setFormError('Password do not match')
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() =>{
        verifyToken();
    },[])
    useEffect(() => {
        checkPassword()
    },[password, rePassword])
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
                {

                }
                <Form 
                    id='updatePasswordForm'
                    onSubmit={updatePassword}
                    style={{
                        width:'100%',
                        height:'100%',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',}}>
                  
                        <Form.Group style={{marginBottom:'8px',width:'100%'}}>
                            <Form.Control
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={error}
                            placeholder='Enter your new password'
                            required />

                            
                        </Form.Group>

                        <Form.Group style={{marginBottom:'8px',width:'100%'}}>
                            <Form.Control
                            type='password'
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            disabled={error}
                            placeholder='Re enter your password'
                            required />

                        </Form.Group> 

                    <Form.Group style={{width:'100%'}}>
                        <Button
                        type='submit'
                        disabled={error}
                        style={{width:'100%'}}>
                            { buttonLoading ? (
                                <>
                                    <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    />
                                </>
                                    ): ('Update password')
                            }
                        </Button>
                    </Form.Group>
                    {
                        formError && (
                            <>
                                <span style={{color:'red'}}>{formError}</span>
                            </>
                        )
                    }
                </Form>
                </div>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ForgotPassword
