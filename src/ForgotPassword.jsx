import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {Button,Form,Spinner,Card,Toast,ToastContainer} from 'react-bootstrap';

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
    const [isChecked, setIsChecked] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)
    const openToast = () => setErrorToast(true)
    const closeToast = () => {
        setErrorToast(false)
        navigate('/login')    
    }

    const onShowPassword = () => setShowPassword(true)
    const onHidePassword = () => setShowPassword(false)
    const onShowRePassword = () => setShowRePassword(true)
    const onHideRePassword = () => setShowRePassword(false)

    function handleTicked () {
        if(isChecked === false) {
            onHidePassword()
        } else if(isChecked === true) {
            onShowPassword()
        }        
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
    const checkPassword = () => {
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
    useEffect(() =>{
        handleTicked()
    },[isChecked])
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
                    noValidate
                    
                    style={{
                        width:'100%',
                        height:'100%',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',}}>
                  
                        <Form.Group style={{marginBottom:'8px',width:'100%'}}>
                            <Form.Label>New Password</Form.Label>
                            {
                                showPassword ? (
                                
                                <>
                                <Form.Control
                                type='text'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={error}
                                placeholder='Enter your new password'
                                required /> 
                                </>) : (
                                    <>
                                        <Form.Control
                                            type='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={error}
                                            placeholder='Enter your new password'
                                            required />
                                    </>
                                )
                            }

                        </Form.Group>
                        <Form.Group style={{marginBottom:'8px',width:'100%'}}>
                            <Form.Label>Confirm New Password</Form.Label>
                            {
                                showPassword ? (<>
                                    <Form.Control
                                    type='text'
                                    value={rePassword}
                                    onChange={(e) => setRePassword(e.target.value)}
                                    disabled={error}
                                    placeholder='Re enter your password'
                                    isInvalid={!!formError}
                                    required />
                                </>):(
                                <>
                                <Form.Control
                                type='password'
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                disabled={error}
                                placeholder='Re enter your password'
                                isInvalid={!!formError}
                                required /> </>
                            )}
                            <Form.Control.Feedback type='invalid'>
                                {formError}
                            </Form.Control.Feedback>
                        </Form.Group> 
                        
                        <Form.Group style={{width:'100%', marginBottom:'8px'}}>
                            <Form.Check
                                id='showPasswordToggle'
                                type='checkbox'
                                label='Show Password'
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                            />

                        </Form.Group>

                    <Form.Group style={{width:'100%'}}>
                        <Button
                        type='submit'
                        disabled={error || formError}
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
                </Form>
                </div>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ForgotPassword
