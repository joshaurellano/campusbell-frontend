import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Card,Placeholder,Dropdown,Spinner,Offcanvas} from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import './Post.css';

axios.defaults.withCredentials = true;

function Post () {
    // const for user fetching
    const [user, setUser] = useState(null);
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [post, setPost] = useState([]);

    const [pageLoading, setPageLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);
    
    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            setPageLoading(true);
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
     useEffect(() => {
        function simulateNetworkRequest() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
        }
        if (pageLoading) {
        simulateNetworkRequest().then(() => {
            setPageLoading(false);
        });
        }
    }, [pageLoading]);


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
    
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }

    const [values, setValues] = useState({
        post_id: '',
        user_id: '',
        body: '',  
    });

    const [commentBody, setCommentBody] = useState('');
  
    const location = useLocation();
    const post_id = location.state.postID;
    
    const getPost = async () => {
        const id = post_id;
        await axios.get(`${API_ENDPOINT}post/${id}`,{withCredentials: true}).then(({data})=>{
            setPost(data.result)
            console.log(post)
        })
    }
    const addComment = async (e) => {
            setCommentLoading(true)
            e.preventDefault();
            const user_id = user.user_id;
            const id = post_id;

            const payload = {
                ...values, user_id, post_id: id, body: commentBody
            }
            console.log(payload);
            await axios.post(`${API_ENDPOINT}comment`,payload,{withCredentials: true})

            setCommentLoading(false)
            setCommentBody('');
            getPost();
        }
    return (
    <>
        {
        pageLoading ?
        <>
            <div className='d-flex justify-content-center align-items-center' style={{height:'100vh', width:'100vw', backgroundColor:'black'}}>
                <FaBell style={{color:'#ffac33', fontSize:'25px'}} />
            <h3 style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>Campus Bell </h3>
            <Spinner style={{marginLeft:'4px'}} animation="grow" variant="warning" />
            </div>
        </> 
        
        : <div className='page'>
        <Row>
            <Navbar fixed="top" expand="lg" data-bs-theme='dark' style={{borderBottom:'solid', padding: 0, height:'60px', backgroundColor:'black', zIndex:1, display:'flex', alignItems:'center'}}>
                    <Container fluid style={{height:'inherit', padding:0}}>
                        <Row style={{width:'100%'}}>
                        
                        <Col lg={4} xs={5} style={{display:'flex',alignItems:'center'}}>
                        <div className='brand' style={{display:'flex', alignItems:'center'}}>
                            <div className='d-block d-sm-none'>
                                <Button variant="primary" onClick={handleShowSidebar} style={{backgroundColor:'transparent', border:'none', translate: '0px -2px'}}>
                                    {
                                        <>
                                            <GiHamburgerMenu />
                                        </>
                                    }
                                </Button>
                                </div>
                            <FaBell style={{color:'#ffac33'}} />
                            <Navbar.Brand className='brand' style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>
                                <Nav.Link as={Link} to='/'>
                                Campus Bell
                                </Nav.Link>
                                </Navbar.Brand>
                        </div>
                        </Col>
            
                        <Col lg={6} xs={2} style={{
                            translate:'-20px 0px'
                        }}>
                        <Nav className="me-auto align-items-center"style={{width:'100%', height:'100%'}}>
                            <div style={{display:'flex', alignItems:'center', height:'100%'}}>
                                <FaMagnifyingGlass className='searchbar-icon' />
                                
                                <Row style={{width:'100%'}}>
                                    <Col lg={12} xs={1}>
                                    <Form.Control className='searchbar' placeholder='Search' />
                                    </Col>
                                </Row>
                            </div>
                        </Nav>
                        </Col>
                        
                        <Col  lg={2} xs={5} style={{ display:'flex', alignItems:'center', height:'100%'
                        }}>
                            <Nav className='gap-3'style={{display:'flex', flexDirection:'row', width:'100%'}}>
                            <Nav.Link className='top-menu' as={Link} to='/post'style={{cursor:'pointer',color:'white'}}>
                            Post
                            </Nav.Link>
            
                            <Nav.Link as={Link} to='/post'>
                                <BiSolidMessageRoundedDots className='top-menu-icons' style={{cursor:'pointer',color:'white'}} />
                            </Nav.Link>
            
                             <Nav.Link as={Link} to='/post'>
                                <IoIosNotifications className='top-menu-icons' style={{cursor:'pointer',color:'white'}} />
                            </Nav.Link>
            
                            <NavDropdown className="custom-nav-dropdown" title={<><FaUserCircle className='top-menu-icons' style={{color:'green'}} /></>} id="basic-nav-dropdown">
                                <NavDropdown.Item>Settings</NavDropdown.Item>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                            </Nav>
                        </Col>
                        </Row>
                    </Container>
                </Navbar>
        </Row>
        
        <Row style={{paddingTop:'50px', backgroundColor:'black'}}> 
            <Container fluid>
                <Row>
                    <Col lg={2}>
                    <Container fluid>
                        <div className='d-none d-sm-block'>
                        <Nav className='ms-auto flex-column' style={{color:'white'}}>
                            <div style={{display:'flex',alignItems:'center',fontSize:'15px', marginTop:'5px'}}>
                            <span style={{color:'white'}}>
                                <strong>
                                    Welcome {user ? `${user.username}`:'Guest'}
                                    </strong>
                            </span>
                            </div>
                            <hr/>
                            <Nav.Link className='navLinkColor' style={{fontWeight:'bold'}} as={Link} to='/'>
                                <div style={{fontSize:'15px', display:'flex', alignItems:'center',color:'white', gap:'4'}}>
                                <FaHome style={{display:'flex', gap:'4'}} />
                                <div>
                                <span>
                                Home
                                </span>
                                </div>
                                </div>
                                </Nav.Link>
                                    <hr/>
                            <span style={{fontWeight:'bold',color:'gray'}}>Topics</span>              
                            {
                                topics.length > 0 && (
                                    topics.map((t)=>(
                                            <Nav.Link key={t.topic_id} className='navLinkColor'>
                                                {t.topic_name}
                                            </Nav.Link>
                                    ))
                                )
                            }
                            <hr/>
                            <span style={{fontWeight:'bold',color:'gray'}}>Community</span>
                            
                            <Nav.Link className='navLinkColor'>
                            <div style={{display:'flex', alignItems:'center', gap:'2'}}>
                            <CiCirclePlus style={{fontSize:'20px'}} />
                                Create Community
                            </div>   
                                </Nav.Link>
                                <hr/>
                                <span style={{fontWeight:'bold',color:'gray'}}>Miscellaneous</span>
                                <Nav.Link className='navLinkColor'>Help Desk</Nav.Link>
                            </Nav>
                            </div>
        
                            <div className='d-block d-sm-none'>
                            <Offcanvas show={showSidebar} onHide={handleCloseSidebar} style={{backgroundColor:'black', width:'250px'}}>
                                <Offcanvas.Header style={{color:'white'}} closeButton>
                                <Offcanvas.Title>
                                    <Nav>
                                        <div style={{display:'flex',alignItems:'center',fontSize:'15px', marginTop:'5px'}}>
                                            <span style={{color:'white'}}>
                                                <strong>
                                                    Welcome {user ? `${user.username}`:'Guest'}
                                                    </strong>
                                            </span>
                                            </div>
                                    </Nav>
                                </Offcanvas.Title>
                                </Offcanvas.Header>
                                <hr style={{color:'white'}}/>
                                <Offcanvas.Body>
                                    <Nav className='ms-auto flex-column' style={{color:'white'}}>
                                    <Nav.Link className='navLinkColor' style={{fontWeight:'bold'}} as={Link} to='/'>
                                    <div style={{fontSize:'15px', display:'flex', alignItems:'center',color:'white', gap:'4'}}>
                                        <FaHome style={{display:'flex', gap:'4'}} />
                                        <div>
                                            <span>
                                            Home
                                            </span>
                                        </div>
                                    </div>
                                    </Nav.Link>
                                        <hr/>
                                <span style={{fontWeight:'bold',color:'gray'}}>Topics</span>              
                            {
                                topics.length > 0 && (
                                    topics.map((t)=>(
                                            <Nav.Link key={t.topic_id} className='navLinkColor'>
                                                {t.topic_name}
                                            </Nav.Link>
                                    ))
                                )
                            }
                            <hr/>
                            <span style={{fontWeight:'bold',color:'gray'}}>Community</span>
                            
                            <Nav.Link className='navLinkColor'>
                            <div style={{display:'flex', alignItems:'center', gap:'2'}}>
                            <CiCirclePlus style={{fontSize:'20px'}} />
                                Create Community
                            </div>   
                                </Nav.Link>
                                <hr/>
                                <span style={{fontWeight:'bold',color:'gray'}}>Miscellaneous</span>
                                <Nav.Link className='navLinkColor'>Help Desk</Nav.Link>
                            </Nav>
                                </Offcanvas.Body>
                            </Offcanvas>
                            </div>
                        </Container>
                    </Col>

                    <Col lg={8}>
                <div className='container'>
                <br />
                {
                    post ? (
                        <div>
                        <Card style={{backgroundColor:'black', color:'white'}}>
                            <Card.Header>
                            <div className='d-flex flex-row w-100' style={{flexGrow:1}}>
                            <div style ={{fontSize:'12px'}}>
                                <div className='d-flex align-items-center h-100'>
                                    <FaUser  />
                                    <span style ={{marginLeft:'4px'}}> {post.username}  
                                    </span>
                                </div>
                            </div>
                            <div style ={{fontSize:'12px', marginLeft:'4px', width:'100%'}}>
                                <div className='d-flex align-items-center h-100 w-100'>
                                    <CiClock2 />
                                    <div style={{display:'flex',flexDirection:'row',width:'100%'}}>
                                        <span style ={{marginLeft:'4px'}}> 
                                        {post?.date_posted && (<ReactTimeAgo
                                        date={new Date(post.date_posted)}
                                        locale="en-US"
                                        timeStyle="twitter"
                                        />)}
                                        </span>
                                    </div>
                                </div> 
                            </div>
                            <div style={{display:'flex',width:'100%',justifyContent:'end'}}>
                                <IoIosMore />
                            </div>
                            </div>
                            <div style ={{fontSize:'12px', marginTop:'4px'}}>
                                {post.topic_name}
                            </div>
                            <div>
                            <span className='post-title'>{post.title}  </span><br />
                            </div>
                            
                            </Card.Header>

                            <Card.Body>
                            <div className='container post-content'>
                                {post.content}
                            </div>
                            <div style={{marginTop:'20px',fontSize:'12px',display:'flex', flexDirection:'row', width:'100%', justifyContent:'start', gap:'40px'}}>
                                <div className='d-flex' style={{gap:'8px'}}>
                                <span>Reacts</span>
                                {/* <span>0</span> */}
                                </div>
                                <div className='d-flex' style={{gap:'8px'}}>
                                <span>Comments</span>
                                <span>{post.commentCount}</span>
                                </div>
                            </div>
                            
                            </Card.Body>
                            
                            <Card.Footer>
                                <div className='d-flex justify-content-start gap-4'>
                                <div>
                                <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                    <div className='d-flex h-100 align-items-center'>
                                    <AiOutlineLike />
                                    <span style={{marginLeft:'4px'}}>React</span>
                                    </div>
                                </div>
                                </div>
                                <div>
                                <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                    <div className='d-flex h-100 align-items-center'>
                                    <FaRegComment />
                                    <span style={{marginLeft:'4px'}}>Comments</span>
                                    </div>
                                </div>
                                </div>
                                <div>
                                <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                    <div className='d-flex h-100 align-items-center'>
                                    <TbShare3 />
                                    <span style={{marginLeft:'4px'}}>Share</span>
                                    </div>
                                </div>
                                </div>
                                </div>
                            </Card.Footer>
                        </Card>

                        <Card style={{backgroundColor:'black'}}>
                            <Card.Body>
                                <Form onSubmit={addComment}>
                                    <Form.Group>
                                        
                                            <div className='comment-box-wrapper'>
                                                <Form.Control className='comment-box'
                                                placeholder='Write Comment'
                                                value={commentBody}
                                                onChange={(e)=> setCommentBody(e.target.value)} required>
                                                    
                                                </Form.Control>
                                            </div>

                                            
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='comment-button'>
                                                <button type='submit' style={{border:'none', backgroundColor:'transparent'}}>
                                                {
                                                    commentLoading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IoSendSharp /> 
                                                        </>)
                                                }
                                                </button>
                                            </div>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card style={{backgroundColor:'black',color:'white'}}>
                                <Card.Header>
                                    <div className='comment-box-label'>
                                        <span>Comments {post.commentCount}</span>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <div>
                                    {
                                    post.comments ? (
                                    post.comments && Object.values(post.comments).map(data=>(
                                        <div key={data.commentID} style={{marginBottom:'8px'}}>
                                            <div className='d-flex h-100 w-100 flex-row align-items-center'>
                                                <div className='d-flex h-100 align-items-center'>
                                                <FaUser className='comment-user-logo' />
                                                <span className='comment-user'>{data.username} </span> 
                                                </div>
                                                <span className='comment-user-date'> 
                                                    {data?.date_posted && (<ReactTimeAgo
                                                    date={new Date(data.date_posted)}
                                                    locale="en-US"
                                                    timeStyle="twitter"/>)}
                                                </span>
                                            </div>
                                            <div className='comment-body'>
                                                {data.body}
                                            </div>
                                            <hr/>
                                        </div>
                                        
                                    ))
                                ) : (
                                    <>
                                        <span className='no-comment-msg'>No comments available yet</span>
                                    </>
                                )
                            }
                            
                            </div>
                            </div>
                            
                                </Card.Body>
                            </Card>
                        
                        </div>
                ) : (
                    <>No Data Available</>
                )
            }
            <br />
                </div>
                    </Col>

                    <Col lg={2}>
                    </Col>
                </Row>
                </Container> 
        </Row>
        </div>
        }
    </>
    )
}

export default Post
