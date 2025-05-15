import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

import {Navbar,Container,Button,Form,Row,Col,Spinner,Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

import {API_ENDPOINT} from './Api';

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
            console.log(response)
            // set loading state to false after operation
            setLoading(false)
            setError('');
            //if no error, proceed to homepage
            navigate('/home');
        } catch(error) {
            console.error(error)
            if(error.response.data.message.includes("Username")){
                console.log('username')
                setUsernameError(error.response.data.message);
            }else if(error.response.data.message.includes("Password")){
                console.log('password')
                setPasswordError(error.response.data.message);
            }
            setLoading(false)
            // setError(error.response.data.message);
        }
    };

    return (
        <div style={{
        backgroundImage: "url('https://res.cloudinary.com/dv7ai6yrb/image/upload/v1747197271/students_wccpdv.jpg')" ,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight:'100vh',
        width: "100vw",
        position:"relative",
        fontFamily: 'Tahoma, sans-serif'
    }}> 
            <Container>
                <h3 style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>Campus Bell</h3>
            </Container>  

        <Container fluid style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Row>
                <Col md={6} sm={12}>
                    <div>
                        <br />
                        <Card style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            border:'1px solid', 
                            borderRadius:'25px',
                            zIndex:'1',
                            minWidth:'320px',
                            maxWidth:'400px',
                            backdropFilter: 'blur(3px)'}}>
                            <Card.Body> 
                            <span style={{fontSize:'24px',fontWeight:'bold', display:'flex', justifyContent:'center'}}>Login</span>
                            <span className='mt-3'style={{fontSize:'14px', fontWeight:'bold', display:'flex', justifyContent:'center', opacity:'0.9'}}>Connecting students across campus</span>
                            <Form noValidate validated={validated}onSubmit={handleSubmit} style={{width:'100%'}}>
                            
                            <Form.Group controlId = 'formUsername' className='mt-3'> 
                                <Form.Label><FaUserAlt /> Username:</Form.Label>
                                <Form.Control 
                                        type='text'
                                        placeholder='Enter username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}isInvalid={!!usernameError}
                                        style={{borderRadius:'25px'}}
                                        required />
                                <Form.Control.Feedback type='invalid'>{usernameError}</Form.Control.Feedback>
                            </Form.Group> <br/>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>🔒 Password:</Form.Label>
                                <Form.Control
                                        type='password'
                                        placeholder='Enter your password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}isInvalid={!!passwordError} 
                                        style={{borderRadius:'25px'}}
                                        required/>
                                        <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
                            </Form.Group> <br/>
   
                            <Form.Group controlId='formButton'style={{display:'flex', justifyContent:'center'}}>
                                {error && <p style={{color:'red'}}>{error}</p>}

                                <Button  
                                type='submit'
                                style={{maxWidth:'250px', borderRadius:'25px', backgroundColor:'#008000'}}
                                disabled={loading} >
                                    {loading ? (
                                        <>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            /> <span>Loading</span>
                                        </> 
                                    ) : ('Login')}
                                </Button>
                            </Form.Group>
                             <br />
                             <Form.Group style={{display:'flex', justifyContent:'center'}}>
                                <Link to ='/register' onClick={() => {
                                    setUsername('');
                                    setPassword('')}}>
                                    <span style={{fontSize:'15px'}}>Sign Up for an Account?</span>
                                </Link>
                            </Form.Group>
                            <br />
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