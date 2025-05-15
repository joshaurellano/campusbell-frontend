import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Stack,Card,Modal,ListGroup } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import './Home.css';

axios.defaults.withCredentials = true;

function Home () {
    // const for user fetching
    const [user, setUser] = useState(null);
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [post, setPost] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            try {
                await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                    setUser(data.result);
                })
            } catch(error) {
                //go back to login in case if error
                navigate ('/login');
            }
        };
        checkUserSession();
    }, []);

    //function to handle logout
    const handleLogout = async () => {
        try {
            // remove token from cookies
            await axios.post(`${API_ENDPOINT}auth/logout`,{withCredentials:true}).then(({data})=>{
                setUser(data.result);
            });
            // make sure to go back to login page after removing the token 
            navigate('/login')
        } catch (error) {
            console.error('Logout failed',error)
        }
    }
    useEffect(() =>{
        getTopics()
        getPosts()
    },[])

    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }
  
    const getPosts = async () => {
        await axios.get(`${API_ENDPOINT}post`,{withCredentials: true}).then(({data})=>{
            setPost(data.result)
            // console.log(data.result)
        })
    }
    const getSpecificPost = async (postID) => {
        // console.log(postID);
        navigate('/post',{state:{postID}});
    }
    
    return (
    <>
    {/* <Navbar bg='success' data-bs-theme='dark'>
        <Container fluid>
            <Navbar.Brand>Campus Bell</Navbar.Brand>
            <Nav>
            <Stack direction='horizontal' gap={3}>
                    <Form.Control className='me-auto' placeholder='Search' />
                    <Button variant='primary'>Search</Button>
                    <div className='vr'>
                    </div>
                </Stack>
            </Nav>
            <Nav className='ms-auto'>
                <NavDropdown title={user ? `User:${user.username}`:'Dropdown'} id = "basic-nav-dropdown" align = "end">
                    <NavDropdown.Item href="#" onClick={handleLogout}> Logout </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Container>
    </Navbar> */}

    <Container fluid> 
        <Row>

            <Col lg={2} gap='0' >
            <Nav className='ms-auto flex-column'>
                <Nav.Link className='navLinkColor'>Home</Nav.Link>
                <Nav.Link className='navLinkColor'>Featured</Nav.Link> 
                <hr />
                <Nav.Link>Topics</Nav.Link>              
                {
                    topics.length > 0 && (
                        topics.map((t)=>(
                                <Nav.Link key={t.topic_id} className='navLinkColor'>
                                    {t.topic_name}
                                </Nav.Link>
                        ))
                    )
                }
                </Nav>
            </Col>
            <Col lg={6} className='colDivider'>
                <h3 style={{color:'black'}}>Dashboard</h3>
                <br /><br /><br />
                <span className='d-flex justify-content-center' style={{height:'100vh'}}><strong style={{color:'black'}}>Welcome {user ? `${user.username}`:'Guest'}</strong></span>
            </Col>

            <Col lg={3}>
                
            </Col>
            </Row>
        </Container>
        
        </>
    )
}

export default Home
