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

function Login () {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const[passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false)


    //check first if user is already logged in
    useEffect(() =>{
        const fetchUser = async () => {
            try {
                //check token inside local storage if any
                const check_token_if_any = Cookies.get('token')
                //pass result to data
                setUser(check_token_if_any.data);
                console.log(check_token_if_any)
                //if token is available proceed to homepage
                navigate('/');
            } catch (error) {
                //remove token incase of error to prevent further problem
                localStorage.removeItem('token');
                //go back to login page
                navigate('/login');
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setUsernameError('');
        setPasswordError('');
        //set loading state to true to trigger spinner to show
        setLoading(true);
        try{
            //send to backend the username and password given to check eligibility
            const response = await axios.post(`${API_ENDPOINT}auth/login`,{
                username,
                password
            });

            console.log(response.data.message);
             
            // set loading state to false after operation
            setLoading(false)
            setError('');
            //if no error, proceed to homepage
            navigate('/');
        
        } catch(error) {
            console.error(error)
            if(error.response.data.message.includes("Username")){
                console.log('username')
                setUsernameError(error.response.data.message);
            }else if(error.response.data.message.includes("Password")){
                console.log('password')
                setPasswordError(error.response.data.message);
            }else if(error.response.data.message === 'Unverified'){
                navigate('/verify');
            }
            setLoading(false)
            setError(error.response.data.message);
        }
    };

    return (
        <div className='edu-sa-hand-bodyFont'
        style={{
        backgroundImage: "url('https://res.cloudinary.com/dv7ai6yrb/image/upload/v1747197271/students_wccpdv.jpg')" ,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight:'100vh',
        width: "100vw",
        position:"relative",
    }}> 
        <Navbar data-bs-theme='dark'>
            <Container>
            <Navbar.Brand>
            <Nav.Link as={Link} to='/login' style={{color:'white',textShadow:'1px 1px black',fontWeight:'bold'}}>
            Campus Bell
            </Nav.Link>
            </Navbar.Brand>
            </Container>
        </Navbar>

        <Container fluid style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Row>
                <Col md={6} sm={12}>
                    <div>
                        <br />
                        <Card style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            border:'1px solid', 
                            borderRadius:'15px',
                            zIndex:'1',
                            minWidth:'320px',
                            maxWidth:'350px',
                            backdropFilter: 'blur(3px)'}}>
                            <Card.Body>
                            <div style={{marginTop:'12px'}}>
                            <span style={{fontSize:'24px',fontWeight:'bold', display:'flex', justifyContent:'center'}}>Sign In</span>
                            </div>
                            <div style={{marginTop:'4px'}}>
                            <span style={{fontSize:'16px', fontWeight:'600', display:'flex', justifyContent:'center', opacity:'0.9'}}>Connecting students across campus</span>
                            </div>
                            <Form noValidate validated={validated}onSubmit={handleSubmit} style={{width:'100%'}}>
                            
                            <div style={{marginTop:'16px'}}>
                            <Form.Group controlId = 'formUsername'> 
                                <FloatingLabel style={{fontSize:'12px'}}
                                    label={
                                        <>
                                            <div>
                                            <FaUserAlt /> Username
                                            </div>
                                        </>
                                        }
                                    controlId="floatingInput"
                                    >
                                <Form.Control 
                                        type='text'
                                        placeholder=' '
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}isInvalid={!!usernameError}
                                        style={{borderRadius:'10px',fontSize:'16px'}}
                                        required />
                                <Form.Control.Feedback type='invalid'>{usernameError}</Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            </div>

                            <div style={{marginTop:'20px'}}>
                            <Form.Group controlId='formPassword'>
                                <FloatingLabel style={{fontSize:'12px'}}
                                    label={
                                        <>
                                            <div>
                                            <FaKey style={{color:'#eda305'}}/> Password
                                            </div>
                                        </>
                                    }
                                    controlId="floatingPassword">
                                <Form.Control
                                        type='password'
                                        placeholder=''
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}isInvalid={!!passwordError} 
                                        style={{borderRadius:'10px', fontSize:'12px'}}
                                        required />
                                        <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            </div>
                            <div style={{marginTop:'16px'}}>
                             <Form.Group>
                                <span style={{fontSize:'12px'}}>
                                    Forgot Password? <Link>Click Here</Link>
                                </span>
                            </Form.Group>
                            </div>
                            <div style={{marginTop:'20px'}}>                        
                            <Form.Group controlId='formButton'style={{display:'flex', justifyContent:'center'}}>
                                <Button type="submit" variant='success' className='btn-main'
                                disabled={loading} >
                                    {loading ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            />
                                             <span>Please wait ...</span>
                                        </div> 
                                    ) : ('Login')}
                                </Button>

                            </Form.Group>
                            </div> 
                             <div style={{marginTop:'24px', marginBottom:'24px'}}>
                             <Form.Group style={{display:'flex', justifyContent:'center',}}>
                                <span style={{fontSize:'12px'}}>
                                    New User? <Link to ='/register'>Sign Up for an Account</Link>
                                </span>
                            </Form.Group>
                            </div>
                            </Form>
                                </Card.Body>
                            </Card>
                        </div>
            </Col>
            </Row>
        </Container>
        </div>
    )
}
export default Login;