import React, { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,Container,Button,Form,Row,Col,Card,Placeholder,Image,Spinner,Offcanvas,NavDropdown } from 'react-bootstrap';
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
import { GiHamburgerMenu } from "react-icons/gi";


import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import './CreatePost.css';

axios.defaults.withCredentials = true;

function CreatePost () {
    // const for user fetching
    const [user, setUser] = useState(null);
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedTopic, setSelectedTopic] = useState([]);
    const [postImg, setPostImg] = useState();
    const [prev, setPrev] = useState();
    const [postButtonLoading, setpostButtonLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [alertData, setAlertData] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    
    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            try {
                await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                    setUser(data.result);
                    console.log(data.result);
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
    })
    useEffect(() => {
        if (user?.user_id) {
            fetchUserData();
            fetchAlerts();
        }
    }, [user]);
    const fetchAlerts = async () => {
            const id = user.user_id;
            await axios.get(`${API_ENDPOINT}alert/user/${id}`,{withCredentials: true}).then(({data})=>{
                setAlertData(data.result)
                console.log(data.result)
            })
        }
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }

    const sample = (event) => {
        // setSelectedTopic(event.target.value);
        const selectedId = parseInt(event.target.value);
        const topic = topics.find(t => t.topic_id === selectedId);
        setSelectedTopic(topic);
    }
  
    const addPost = async (e) => {
        setpostButtonLoading(true)

        e.preventDefault();
        const user_id = user.user_id;
        const topic_id = selectedTopic.topic_id;
        
        try{
        let imageUrl = null;
            if(postImg)
                {const formData = new FormData();
                formData.append('image', postImg);

                const response = await axios.post(`${API_ENDPOINT}upload/images`,formData, {withCredentials: true, headers: {
                        'Content-Type': 'multipart/form-data',
                    },})
                console.log('Upload successful:');
            
            console.log(response.data.data.url);
            imageUrl = response.data.data.url;}
            // console.log(imageUrl)
            const payload = {
            title,
            body, 
            user_id, 
            topic_id,
            image:imageUrl||null
        }
         await axios.post(`${API_ENDPOINT}post`,payload,{withCredentials: true})
           
            
        } catch(error){
            console.log(error)}
        
            setpostButtonLoading(false)
    }
        const fileInputRef = useRef();
        function getPostImage(event) {
            const file = event.target.files[0];
            setPostImg(file);
            setPrev(URL.createObjectURL(file));
            
        }
       
        function removeImg(){
            URL.revokeObjectURL(postImg)
            setPostImg(null);
            setPrev(null);
            fileInputRef.current.value = "";
        }
const handleTopicPosts = (topicId) =>{
        navigate('/topic', {state: {
            topicId
        }})
    }
const fetchUserData = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
        setUserData(data.result)
        })
}
    return (
        <>
        <div className='page'>
            <Row>
            <Navbar fixed="top" expand="lg" data-bs-theme='dark' style={{borderBottom:'solid', padding: 0, height:'60px', backgroundColor:'black', zIndex:1, display:'flex', alignItems:'center'}}>
                <Container fluid style={{height:'inherit', padding:0}}>
                    <Row style={{width:'100%',display:'flex',alignItems:'center'}}>
                    
                    <Col lg={4} xs={5} style={{display:'flex',alignItems:'center'}}>
                    <div className='brand' style={{display:'flex', alignItems:'center'}}>
                        <div className='d-block d-md-block d-sm-block d-lg-none'>
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
                    <Nav className="me-auto align-items-center"style={{width:'100%', height:'100%', display:'flex', justifyContent:'start'}}>
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
                        <Nav>
                        <Nav.Link className='top-menu' as={Link} to='/post'style={{cursor:'pointer',color:'white'}}>
                        Post
                        </Nav.Link>
        
                        <Nav.Link as={Link} to='/chat'>
                            <BiSolidMessageRoundedDots className='top-menu-icons' style={{cursor:'pointer',color:'white'}} />
                        </Nav.Link>
        
                        <NavDropdown
                            className="notif-dropdown"
                            title={<><IoIosNotifications className='top-menu-icons' /></>}
                            id="basic-nav-dropdown">
                        
                        {alertData && alertData.length > 0 ?(
                            alertData.map((data, index)=>(
                                <div key={index}>
                                    { data.reactAlert ? (
                                        data.reactAlert && Object.values(data.reactAlert).map(reactData=>(
                                            <NavDropdown.Item key={reactData.alertID}>
                                                <span style={{fontWeight:'bold'}}>{reactData.reactorusername}</span> 
                                                <span> reacted to your post</span> <span style={{fontWeight:'bold'}}> {data.title}
                                                    </span></NavDropdown.Item>
                                        ))
                                    ):(
                                        <>
                                        <span></span>
                                        </>
                                    )}
                                    {
                                        data.commentAlert ? (
                                            data.commentAlert && Object.values(data.commentAlert).map(commentData=>(
                                                <NavDropdown.Item key={commentData.alertID}>{commentData.commenterusername} commented on your post {data.title}</NavDropdown.Item>
                                            ))
                                        ) : (
                                            <>
                                            <span></span>
                                            </>
                                        )
                                    }
                                </div>
                            ))
                        ) : (
                                <NavDropdown.Item>No notification yet</NavDropdown.Item>
                            )
                        }
                            </NavDropdown>
                        
                        <NavDropdown className="custom-nav-dropdown" title={<><Image src={userData.profile_image} className='pfp-icon' roundedCircle /></>} id="basic-nav-dropdown">
                            <div>
                            <NavDropdown.Item>Settings</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>viewProfile(user.user_id)}>Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </div>
                        </NavDropdown>
                
                                </Nav>
                            </Col>
                            </Row>
                        </Container>
                    </Navbar>
                        </Row>
                    
                       <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
                        <Container fluid>
                            <Row>
                                <Col lg={2} style={{borderRight:'2px solid gray'}}>
                                    <Container fluid>
                                    <div className='d-none d-md-none d-lg-block'>
                                    <Nav className='ms-auto flex-column' style={{color:'white'}}>
                                        <div style={{display:'flex',alignItems:'center',fontSize:'15px', marginTop:'5px'}}>
                                        <span style={{color:'white'}}>
                                            <strong>
                                                <Image src={userData.profile_image} className='pfp-icon' roundedCircle /> Welcome {user ? `${user.username}`:'Guest'}
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
                                                        <Nav.Link onClick={()=>handleTopicPosts(t.topic_id)} key={t.topic_id} className='navLinkColor'>
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
                    
                                        <div className='d-block d-lg-none d-md-block d-sm-none'>
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
                                                        <Nav.Link onClick={()=>handleTopicPosts(t.topic_id)}key={t.topic_id} className='navLinkColor'>
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
                                    <div>
                                     <div className='container' style={{color:'white'}}>
                                        <div className='head-msg'>
                                            <h3 style={{fontWeight:'600'}}>Create Post</h3>
                                        </div>
                                        <Form onSubmit={addPost} id='addPost'>
                                        <div style={{marginTop:'8px'}}>
                                            <Form.Select className='select-topic' onChange={sample}>
                                                <option style={{backgroundColor:'black'}}>--Select Topic--</option>
                                                {
                                                topics.length > 0 && (
                                                    topics.map((t)=>(
                                                            <option style={{backgroundColor:'black'}} value={t.topic_id}key={t.topic_id}>   
                                                                {t.topic_name}
                                                            </option>
                                                        ))
                                                    )
                                                }
                                                </Form.Select>    
                                        </div>
                                            <div style={{marginTop:'8px'}}> 
                                                <Form.Group>
                                                    <Form.Label>
                                                        Title
                                                    </Form.Label>
                                                        <Form.Control className='title-area' placeholder='Title'
                                                            value={title}
                                                            onChange={(e)=>setTitle(e.target.value)} required>
                                                                
                                                            </Form.Control>
                                                    </Form.Group>
                                                <div style={{marginTop:'8px'}}>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Body
                                                        </Form.Label>
                                                        {/* <Form.Control className='post-area' as="textarea"
                                                        onChange={(e)=>setValues({...values,body:e.target.value})} required>
                                                                
                                                            </Form.Control> */}
                                                        <Form.Control className='post-area' as="textarea" value={body}
                                                        onChange={(e)=>setBody(e.target.value)} required>
                                                                
                                                            </Form.Control>
                                                    </Form.Group>
                                                    </div>

                                                    <div style={{marginTop:'8px'}}>
                                                        <Form.Group>
                                                            <Button className='post-button' type='submit' variant='success'>
                                                                {
                                                                    postButtonLoading ?
                                                                    <>
                                                                    <Spinner animation="border" size="sm" /> Posting
                                                                    </> : <>
                                                                    Post
                                                                    </>
                                                                }
                                                                </Button>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                                
                                            </Form>
                                    <div>
                                        <Form onChange={getPostImage}>
                                            <div style={{marginTop:'8px'}}>
                                                <Form.Group controlId="formFileSm">
                                                    <div className='form-wrapper'>
                                                    <Form.Control type='file'ref={fileInputRef}></Form.Control>
                                                        <Button className='rm-img-btn' onClick={removeImg}>
                                                            X
                                                        </Button>
                                                    </div>
                                                </Form.Group>
                                                
                                            </div>
                                        </Form>
                                    </div>

                                    </div>
                                    
                                    {(title||body||prev) && (
                                    <div>
                                    <div style={{marginTop:'2rem',marginBottom:'2rem', color:'white'}}>
                                        <span>Preview</span>
                                    </div>

                                    <div style={{marginTop:'8px'}}>
                                    <Card style={{backgroundColor:'black', color:'white', border:'1px solid gray', borderRadius:'15px', minHeight:'250px'}}> 
                                        <Card.Header>
                                                <div>
                                                    <span style={{fontSize:'12px'}}>{selectedTopic.topic_name}</span>
                                                </div>
                                                <div>
                                                <span className='post-title'>{title}</span><br />
                                                </div>
                                        </Card.Header>
                                        <Card.Body>
                                        <div className='container post-content'>
                                            {body}
                                        </div>
                                        <div className='container'>
                                        {
                                            prev && (
                                            <Card className='image-card' style={{display:'flex', justifyContent:'center',width:'100%',border:'1px solid white', backgroundColor:'black', marginTop:'0.5rem', borderRadius:'1.25rem'}}>
                                            <Card.Body>
                                            <Card.Img className='container post-image' src={prev} />
                                            </Card.Body>
                                        </Card>)}
                                        </div>
                                        </Card.Body>
                                    </Card>
                                    </div>
                                    </div>
                                    )}
                                 </div>                               
                                </Col>
                            </Row>
                        </Container>
                       </Row>
                </div>
        </>
    )
}

export default CreatePost
