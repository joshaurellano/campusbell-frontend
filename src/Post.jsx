import React, { useEffect, useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Stack,Card,ListGroup,InputGroup} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import { FaLocationArrow } from "react-icons/fa";

import {API_ENDPOINT} from './Api';

import './Home.css';

axios.defaults.withCredentials = true;

function Post () {
    // const for user fetching
    const [user, setUser] = useState(null);
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [post, setPost] = useState([]);
    // adding comments
    const [commentBody, setCommentBody] = useState([]);

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
        getPost()
    },[])

    const location = useLocation();
    const id = location.state?.postID;

    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }
    
    const getPost = async () => {
        console.log(id);
        await axios.get(`${API_ENDPOINT}post/${id}`,{withCredentials: true}).then(({data})=>{
            setPost(data.result)
            console.log(data.result)
        })
    }
    const handleAddComment = async (e,postID) => {
        e.preventDefault();
        try {
            const payload = {
                post_id:postID,
                body:commentBody,
                user_id:user.user_id
            };
            await axios.post(`${API_ENDPOINT}comment`,payload,{withCredentials: true});
            setCommentBody('');
            getPost();
        } catch(error){
            console.error(error);
        }
    }
    return (
    <>
    <Navbar bg='success' data-bs-theme='dark'>
        <Container fluid>
            <Navbar.Brand>
                <Nav>
                <Nav.Link as={Link} to='/'>
                Campus Bell
                </Nav.Link>
                </Nav>
                </Navbar.Brand>

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
                    post && (
                            <div>
                            <Card key={post.postID}>
                                <Card.Header>
                                <span style={{fontSize:'30px',fontWeight:'bold'}}>{post.title}</span><br />
                                <span style ={{fontSize:'13px'}}>by {post.username} </span><br />
                                <span>{new Date (post.date_posted).toLocaleDateString()}</span>
                                </Card.Header>
                                <Card.Body>
                                {post.content}
                                </Card.Body>
                                <Card.Body>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item variant='dark'>
                                            <span style={{fontSize:'13px'}}>Comments {post.commentCount}</span>
                                        </ListGroup.Item>

                                        { 
                                            post.comments && Object.values(post.comments).map((c,idx)=>(
                                            <ListGroup.Item key={c.commentID || idx} style={{fontSize:'12px'}}>
                                                {c.username} <br />
                                                {c.body}
                                                    <ListGroup variant ='flush'>
                                                        <ListGroup.Item variant='secondary'>
                                                            <span style={{fontSize:'12px'}}>Replies {c.replyCount}</span>
                                                        </ListGroup.Item>
                                                        {
                                                            c.replies && Object.values(c.replies).map((r,idx)=>(
                                                                <ListGroup.Item key={r.replyID || idx}>
                                                                    {r.username}<br />
                                                                    {r.body}
                                                                </ListGroup.Item>
                                                            ))
                                                        }
                                                    </ListGroup>
                                            </ListGroup.Item>))
                                        }
                                    </ListGroup>
                                    <Card.Body>
                                        <Form onSubmit={(e) => handleAddComment(e,post.postID)}>
                                            <Form.Group>
                                                <InputGroup>
                                                <Form.Control 
                                                placeholder='Comment' 
                                                as='textarea' 
                                                value={commentBody}
                                                onChange={(event)=>{setCommentBody(event.target.value)}}>

                                                </Form.Control>
                                                <Button type='submit'>
                                                <FaLocationArrow />
                                                </Button>
                                                </InputGroup>
                                            </Form.Group>

                                        </Form>
                                    </Card.Body>
                                    </Card.Body>
                                <br />
                               

                            </Card>
                            <br />
                            </div>
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

export default Post
