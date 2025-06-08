import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Card,Placeholder,Dropdown,Spinner} from 'react-bootstrap';
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

import ReactTimeAgo from 'react-time-ago'

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

    const [pageLoading, setPageLoading] = useState(false);

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
        getPosts()
        
    })
    
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }
  
    const getPosts = async () => {
        await axios.get(`${API_ENDPOINT}post`,{withCredentials: true}).then(({data})=>{
            setPost(data.result)
            console.log(data.result)
        })
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
        
        : <div style={{
        backgroundColor:'black',
        fontFamily: 'Tahoma, sans-serif',
        minWidth:'100vw'
    }}>
    <Navbar data-bs-theme='dark' style={{borderBottom:'solid', paddingTop:20, paddingBottom: 0, height:'60px'}}>
        <Container fluid>
            <Row className="w-100 align-items-center">
            <div className='d-flex justify-content-center' style={{height:'100%'}}>
            <Col>
            <div style={{display:'flex', alignItems:'center'}}>
            <FaBell style={{color:'#ffac33', fontSize:'25px'}} />
            <Navbar.Brand style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>Campus Bell</Navbar.Brand>
            </div>
            </Col>
            <Col className="d-flex justify-content-center">
            <Nav>
                <div style={{width:'400px', position:'relative',marginTop:'4px'}}>
                    <FaMagnifyingGlass style={{
                    position: 'absolute',
                    left:'10px',
                    top: '50%',
                    transform: 'translateY(-120%)',
                    color: 'gray',
                    pointerEvents: 'none'
                }} />
                 <Form.Control placeholder='Search'style={{ borderRadius: '25px',paddingLeft:'40px'}} />
                </div>
            </Nav>
                </Col>
                <Col className="d-flex justify-content-end align-items-center gap-4" style={{color:'white', paddingLeft:16,}}>
                    <div style={{display:'flex',alignItems:'center', justifyItems:'center'}}>
                    <Nav className="d-flex justify-content-end gap-2">
                    <Nav.Item>
                        <Nav.Link as={Link} to='/post'>
                            <div style={{cursor:'pointer',color:'white'}}>
                            Post
                            </div>
                        </Nav.Link>
                        </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to='/post'>
                    <BiSolidMessageRoundedDots style={{fontSize:'30px',cursor:'pointer',color:'white'}} />
                        </Nav.Link>
                        </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to='/post'>
                    <IoIosNotifications style={{fontSize:'30px',cursor:'pointer',color:'white'}} />
                        </Nav.Link>
                        </Nav.Item>
                    <Nav.Item>
                    <div style={{paddingTop:'8px'}}>
                    <FaUserCircle style={{fontSize:'30px', color:'green'}} />
                    <Dropdown style={{translate:'8px -25px', zIndex:1}}>
                    <Dropdown.Toggle id="dropdown-basic" style={{fontSize:'12px',border:'none', backgroundColor:'transparent'}}>
                        
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{translate:'-128px 0px'}}>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    </div>
                    </Nav.Item>
                    </Nav>
                    </div>
                </Col>
                </div>
        </Row>
        </Container>
    </Navbar>

    <Container fluid> 
        <Row>

            <Col lg={2}>
            <Nav className='ms-auto flex-column' style={{color:'white'}}>
                <div style={{display:'flex',alignItems:'center',fontSize:'15px', marginTop:'5px'}}>
                <span style={{color:'white'}}>
                    <strong>
                        Welcome {user ? `${user.username}`:'Guest'}
                        </strong>
                </span>
                </div>
                <hr/>
                <Nav.Link className='navLinkColor' style={{fontWeight:'bold'}}>
                    <div style={{fontSize:'15px', display:'flex', alignItems:'center',color:'white', gap:'4'}}>
                    <FaHome style={{display:'flex', gap:'4'}} />
                    <span>
                    Home
                    </span>
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

            </Col>
            <Col lg={8} className='colDivider'>
                <div className='container'>
                <br />
                {
                    post.length > 0 && (
                    post.slice(0,5).map((post)=>(
                        <div key={post.postID}>
                        <Card style={{backgroundColor:'black', color:'white'}}>
                            <Card.Header>
                            <div className='d-flex flex-row w-100'>
                            <div style ={{fontSize:'12px'}}>
                                <div className='d-flex align-items-center h-100'>
                                    <FaUser  />
                                    <span style ={{marginLeft:'4px'}}> {post.username}  
                                    </span>
                                </div>
                            </div>
                            <div style ={{fontSize:'12px', marginLeft:'4px'}}>
                                <div className='d-flex align-items-center h-100'>
                                    <CiClock2 />
                                    <span style ={{marginLeft:'4px'}}> <ReactTimeAgo date={new Date (post.date_posted)} locale="en-US" timeStyle="twitter"/></span>
                                </div>
                            </div>
                            <div style={{display:'flex',width:'100%',justifyContent:'end'}}>
                                <IoIosMore />
                            </div>
                            </div>
                            <div>
                            <span style={{fontSize:'30px',fontWeight:'bold',}}>{post.title}  </span><br />
                            </div>
                            
                            </Card.Header>

                            <Card.Body>
                            {post.content}
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
                        <hr/>
                        </div>
                    ))
                )
            }
            <br />
                        <Card style={{backgroundColor:'black', color:'gray'}}>
                            <Card.Header>
                                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                            </Card.Header>

                            <Card.Body>
                                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
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
                        <br />
                        <hr/>
                        <Card style={{backgroundColor:'black', color:'white'}}>
                            <Card.Header>
                                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                            </Card.Header>

                            <Card.Body>
                                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
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
                </div>
            </Col>

            <Col lg={2}>
                <div>
                    <Card style={{backgroundColor:'black', width:'100%'}}>
                        <div className='d-flex flex-column '>
                        <span style={{fontWeight:'bold',color:'white'}}>New Post</span>
                        <div>
                        <div>
                        {
                        post.length > 0 && (
                        post.slice(0,10).map((post)=>(
                            <div key={post.postID}>
                            <div style={{height:'100%',
                            display:'flex', 
                            flexDirection:'row', 
                            fontSize:'12px', 
                            marginBottom:'4px',
                            alignItems:'center',width:'100%',flexGrow:1}}>
                            <FaUserCircle style={{color:'white',fontSize:'12px',}}/>
                            <span style={{color:'white', marginLeft:'4px',width:'100%'}}>{(post.title).slice(0,50)}</span>
                            </div>
                            </div>))
                            )
                        }
                        </div>
                        <br />
                        </div>
                        </div>
                    </Card>
                    <br />
                     <Card style={{backgroundColor:'black'}}>
                        <span style={{fontWeight:'bold',color:'gray'}}>Community Discussion</span>
                        <div>
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <br />
                        </div>
                    </Card>
                </div>
            </Col>
            </Row>
        </Container>
        
        </div>
       
        }
    </>
    )
}

export default Home
