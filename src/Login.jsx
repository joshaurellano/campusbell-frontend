import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

import {Navbar,Container,Button,Form,Row,Col,Spinner,Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

function Login () {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)


    //check first if user is already logged in
    useEffect(() =>{
        const fetchUser = async () => {
            try {
                //check token inside local storage if any
                // const check_token_if_any = JSON.parse(localStorage.getItem('token'))
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
        //set loading state to true to trigger spinner to show
        setLoading(true);
        // console.log(API_ENDPOINT);
        try{
            //send to backend the username and password given to check eligibility
            const response = await axios.post(`${API_ENDPOINT}auth/login`,{
                username,
                password
            });
            console.log(response)
            // set loading state to false after operation
            setLoading(false)
            //set token to local storage
            // localStorage.setItem('token', JSON.stringify(response));
            setError('');
            //if no error, proceed to homepage
            navigate('/home');
        } catch(error) {
            console.error(error)
            setLoading(false)
            setError(error.message);
        }
    };

    return (
        <> 
        <Navbar bg='success' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand href='#home'> Campus Bell</Navbar.Brand>
            </Container>
        </Navbar>

        <Container>
            <Row className = 'justify-content-md-center'>
                <Col md={6} sm={12}>
                    <>
                        <div>
                            <p>Left Column</p>

                        </div>
                    </>
                </Col>

                <Col md={6} sm={12}>
                <div className = 'login-form'>
                    <div className = 'container'>
                        <div className = 'card-body login-card-body'>
                            <Card>
                                <Card.Body>
                                <span style={{display:'flex',justifyContent:'center',fontSize:'24px'}}>Login to</span>
                                <span style={{display:'flex',justifyContent:'center',fontWeight:'bold',fontSize:'30px'}}>Campus Bell</span> <br/>
                                <Form onSubmit = {handleSubmit}>
                                <Form.Group controlId = 'formUsername'>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control className='form-control-sm rounded-0' 
                                        type='username'
                                        placeholder='Enter username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} required />
                                </Form.Group> <br/>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control className='form-control-sm-rounded-0'
                                        type='password'
                                        placeholder='Enter your password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} required/>
                            </Form.Group> <br/>

                            <Form.Group controlId='formButton'>
                                {error && <p style={{color:'red'}}>{error}</p>}

                                <Button variant='success' className='btn btn-block bg-customer btn-flat rounded-0' 
                                size='sm' block='block' type='submit' disabled={loading}>
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
                            </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </Col>

            
            </Row>
        </Container>
        </>
    )
}
export default Login;