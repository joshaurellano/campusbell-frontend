import React, { useEffect, useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Card,Placeholder,Image,Spinner, Offcanvas,Alert} from 'react-bootstrap';
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
import { AiFillLike } from "react-icons/ai";

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
    const [userData, setUserData] = useState([]);
    const [alertData, setAlertData] = useState(null);

    const [pageLoading, setPageLoading] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    const [alert, setAlert] = useState(true);
    const [notDisplayed, setNotDisplayed] = useState(true)
    
    const closeAlert = () => {
        setAlert(false)
        sessionStorage.setItem('displayed', 'true')
    }
    
    useEffect(() =>{
        const displayed = sessionStorage.getItem('displayed')
        if(displayed === 'true') {
            setAlert(false)
        }
    },[])
    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            setPageLoading(true);
            try {
                const userInfo = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                    setUser(data.result);
                })
                // console.log(userInfo)
            setPageLoading(false);

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
    },[])
   useEffect(() => {
    if (user?.user_id) {
        fetchUserData();
        getPosts();
        fetchAlerts()
    }
}, [user]);


    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }
  
    const getPosts = async () => {
        const id = user.user_id
        await axios.get(`${API_ENDPOINT}post/all/${id}`,{withCredentials: true}).then(({data})=>{
            setPost(data.result)
            getPosts()
            // console.log(data.result)
        })
    }
    const viewPost = (postID) => {
        navigate('/view', {state: {
            postID
        }});
    }
    const viewProfile = (userId) => {
        navigate('/profile', {state: {
            userId
        }});
    }
    const handleTopicPosts = (topicId) =>{
        navigate('/topic', {state: {
            topicId
        }})
    }
  
    const handleReact = async (postID, userID) => {
        const payload = {
            post_id:postID,
            user_id:userID
        }
        // console.log(payload)
        await axios.post(`${API_ENDPOINT}react`,payload,{withCredentials:true})
        getPosts()
    }
    const fetchUserData = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
        setUserData(data.result)
        })
    }
        
    const fetchAlerts = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}alert/user/${id}`,{withCredentials: true}).then(({data})=>{
            setAlertData(data.result)
            // console.log(data.result)
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
        
        : <div className='page'>
    <Row>{ alert ? (
            <div>
                <Alert variant="warning" onClose={() => closeAlert()} dismissible>
                <p>
                    Currently open to gmail users for testing purposes. 
                </p>
            </Alert>
            </div>
    ):( <>
    
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

                 {/* <NavDropdown
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
                </NavDropdown> */}

                <NavDropdown
                    className="notif-dropdown"
                    title={<><IoIosNotifications className='top-menu-icons' /></>}
                    id="basic-nav-dropdown">
                    <NavDropdown.Item id='notification-header'>Notifications</NavDropdown.Item>
                  {
                    alertData && alertData.length > 0 ? (
                        alertData.map(data =>(
                            <div key={data.notification_id}>
                                {
                                    data.description === 'react' ?(
                                        <NavDropdown.Item>
                                            <span style={{fontSize:'bold'}}>{data.notifier}</span>
                                            <span> reacted on your post </span>
                                            <span style={{fontSize:'bold'}}>{data.title}</span>
                                            <span style={{fontSize:'bold'}}>{data.title}</span>
                                            <div>
                                            <span> {data?.created_at && (<ReactTimeAgo
                                            date={new Date(data.created_at).toISOString()}
                                            locale="en-US"
                                            timeStyle="round"
                                        />)}</span>
                                            </div></NavDropdown.Item>
                                    ) : data.description === 'comment' ?(
                                        <NavDropdown.Item>
                                             <span style={{fontSize:'bold'}}>{data.notifier}</span>
                                            <span> commented on your post </span>
                                            <span style={{fontSize:'bold'}}>{data.title}</span>
                                            <div>
                                            <span> {data?.created_at && (<ReactTimeAgo
                                            date={new Date(data.created_at).toISOString()}
                                            locale="en-US"
                                            timeStyle="round"
                                        />)}</span>
                                        </div>
                                            </NavDropdown.Item>
                                            ) :(
                                        <>
                                        <span></span>
                                        </>
                                 )
                                }
                            </div>
                        ))
                    ) : (<NavDropdown.Item>
                        No notification yet
                    </NavDropdown.Item>)
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
    </>)}
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

            <Col lg={8} sm={12} xs={12}>
            <div className='container'>
            {
                post.length > 0 && (
                post.slice(0,10).map((post)=>(
                    <div key={post.postID}>
                    <Card className='post-card'>
                        <Card.Header>
                        <div className='d-flex flex-row w-100'>
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
                                <span style ={{marginLeft:'4px'}}> {post?.date_posted && (<ReactTimeAgo
                                        date={new Date(post.date_posted).toISOString()}
                                        locale="en-US"
                                        timeStyle="twitter"
                                        />)}</span>
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

                        <Card.Body  onClick={()=>viewPost(post.postID)}>
                        <div className='post-content'>
                            {(post.content).slice(0,500)}
                        </div>
                        <div>
                            { post.image && (
                                <div style={{marginTop:'20px'}}>
                                    <Card className='image-card' style={{display:'flex', justifyContent:'center',width:'100%',border:'1px solid white', backgroundColor:'black', marginTop:'0.5rem', borderRadius:'1.25rem'}}>
                                        <Card.Body style={{display:'flex', justifyContent:'center', padding:'0'}}>
                                        <Card.Img className='container post-image' src={post.image} />
                                        </Card.Body>
                                    </Card>
                                </div>
                                )}
                        </div>
                        <div style={{marginTop:'8px',fontSize:'12px',display:'flex', flexDirection:'row', width:'100%', justifyContent:'end', gap:'40px'}}>
                            <div className='d-flex' style={{gap:'8px'}}>
                            <span>Reacts</span>
                            <span>{post.reactCount}</span>
                            </div>
                            <div className='d-flex' style={{gap:'8px'}}>
                            <span>Comments</span>
                            <span>{post.commentCount}</span>
                            </div>
                        </div>
                        
                        </Card.Body>
                        <Card.Footer style={{overflowWrap:'normal', zIndex:0}}>
                            <div className='action-tabs gap-4'>
                            
                            <div>
                            { post.reacted === true ? (
                                post.reacted &&
                            <div className='like-button' id='oval' onClick={()=>handleReact(post.postID, user.user_id)}>
                                <div className='d-flex h-100 align-items-center'>
                                    <AiFillLike   />
                                    <span style={{marginLeft:'4px'}}>React</span>
                                </div>
                            </div>) : (
                                <>
                                    <div id='oval' onClick={()=>handleReact(post.postID, user.user_id)} style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                    <AiOutlineLike />
                                    <span style={{marginLeft:'4px'}}>React</span>
                                </div>
                            </div>
                                </>
                            )
                            }
                            </div>

                            <div>
                            <div id='oval' onClick={()=>viewPost(post.postID)} style={{color:'white', cursor:'pointer'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <FaRegComment />
                                <span style={{marginLeft:'4px'}}>Comments</span>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div id='oval' style={{color:'white'}}>
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
                    <br />
            </div>
            </Col>

            <Col lg={2} className='d-none d-sm-block'>
                 <div style={{width:'100%'}}>
                    <Card style={{backgroundColor:'black', width:'100%'}}>
                        <div className='d-flex flex-column '>
                        <span style={{fontWeight:'bold',color:'white'}}>New Post</span>
                        <div>
                        <div>
                        {
                        post.length > 0 && (
                        post.slice(0,10).map((post)=>(
                            <div key={post.postID}>
                            <div className='navLinkColor' style={{height:'100%',
                            display:'flex', 
                            flexDirection:'row', 
                            fontSize:'12px', 
                            marginBottom:'4px',
                            alignItems:'center',width:'100%',flexGrow:1}}>
                            <FaUserCircle style={{color:'white',fontSize:'12px',}}/>
                            <div onClick={()=>viewPost(post.postID)} style={{color:'white', marginLeft:'4px',width:'100%', cursor:'pointer'}}>
                            <span>{(post.title).slice(0,50)}</span>
                            </div>
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
    </Row>
        </div> 
        }
    </>
    )
}

export default Home
