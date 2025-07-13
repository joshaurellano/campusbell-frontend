import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Card,Placeholder,Image,Spinner,Offcanvas} from 'react-bootstrap';
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
import { AiFillLike } from "react-icons/ai";


import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import './Post.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'
axios.defaults.withCredentials = true;

function Post () {
    // const for user fetching
    const [user, setUser] = useState(null);
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [post, setPost] = useState([]);
    const [userData, setUserData] = useState([]);
    const [alertData, setAlertData] = useState(null);
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

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }

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

    useEffect(() => {
        if (user?.user_id) {
            fetchUserData();
            getPost();
            fetchAlerts();
        }
    }, [user]);
    useEffect(() =>{
        getTopics()
    },[])
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
    const fetchUserData = async () => {
            const id = user.user_id;
            await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
            setUserData(data.result[0])
            })
        }
    const handleTopicPosts = (topicId) =>{
        navigate('/topic', {state: {
            topicId
        }})
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
            // console.log(data.result[0])
            setPost(data.result[0])
            
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
    <div style={{height:'100vh', overflow:'hidden'}}>
        {
        pageLoading ?
        <>
            <div className='d-flex justify-content-center align-items-center' style={{height:'100vh', width:'100vw', backgroundColor:'black'}}>
                <FaBell style={{color:'#ffac33', fontSize:'25px'}} />
            <h3 style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>Campus Bell </h3>
            <Spinner style={{marginLeft:'4px'}} animation="grow" variant="warning" />
            </div>
        </> 
        
        : <div>
        <Row>
        <TopNavbar handleToggleSidebar={toggleSidebar}/>
        </Row>
        
        <Row style={{paddingTop:'68px', backgroundColor:'black'}}> 
            <Container fluid>
                <Row>
                    <Col lg={2} className='topic-col'>
                        <Sidebar showSidebar={showSidebar} 
                        handleCloseSidebar={() => setShowSidebar(false)}/>
                        </Col>

                    <Col lg={8} style={{height:'100vh', overflow:'scroll'}}>
                <div className='container'>
                <br />
                {
                    post ? (
                        <div>
                        <Card className='post-card' style={{backgroundColor:'black', color:'white'}}>
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
                            <div className='post-content'>
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
                            { post.image && (
                            <div style={{marginTop:'20px'}}>
                                <Card className='image-card' style={{display:'flex', justifyContent:'center',width:'100%',border:'1px solid white', backgroundColor:'black', marginTop:'0.5rem', borderRadius:'1.25rem'}}>
                                    <Card.Body style={{display:'flex', justifyContent:'center', padding:'0'}}>
                                    <Card.Img className='container post-image' src={post.image} />
                                    </Card.Body>
                                </Card>
                            </div>
                            )}

                            </Card.Body>
                                <Card.Footer style={{overflowWrap:'normal'}}>
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
    </div>
    )
}

export default Post
