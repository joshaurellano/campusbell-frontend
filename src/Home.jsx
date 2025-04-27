import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Stack,Card } from 'react-bootstrap';
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
    <Navbar bg='success' data-bs-theme='dark'>
        <Container fluid>
            <Navbar.Brand>Campus Bell</Navbar.Brand>
            {/* Search bar */}
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
    </Navbar>

    <Container fluid> 
        <Row>
            <Col lg={3} gap='0'>
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
            <br />
                <Container>
                {
                    post.length > 0 && (
                        post.map((p)=>(
                            <div>
                            <Card key={p.postID}>
                                <Card.Header>
                                <span style={{fontSize:'30px',fontWeight:'bold'}}>{p.title}</span><br />
                                <span style ={{fontSize:'13px'}}>by {p.username}</span><br />
                                <span>{new Date(p.date_posted).toLocaleDateString()}</span>
                                </Card.Header>
                                <Card.Body>
                                {p.content}
                                </Card.Body>
                               
                                <Card.Body>
                                    <Button variant='outline-success' onClick={() => getSpecificPost(p.postID)}>
                                        Comments {p.commentCount}
                                    </Button>

                                    
                                </Card.Body>


                            </Card>
                            <br />
                            </div>
                        ))
                    )
                }

                </Container>
                <br />
            </Col>

            <Col lg={3}>
                <Card border="success" style={{ width: '18rem' }}>
                    <Card.Header>Header</Card.Header>
                    <Card.Body>
                    <Card.Title>Success Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                    </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            </Row>
        </Container>
        
        </>
    )
}

export default Home
