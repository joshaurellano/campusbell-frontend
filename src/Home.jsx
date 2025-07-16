import React, { useEffect, useState, useRef } from 'react';
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
import { IoChatbubble } from "react-icons/io5";

import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import './Home.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'

axios.defaults.withCredentials = true;

function Home () {
    const listInnerRef = useRef();
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
    const [notDisplayed, setNotDisplayed] = useState(true);
    const [nextId, setNextId] = useState('');
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }

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

    useEffect(() =>{
        getTopics()
    },[])
   useEffect(() => {
    if (user?.user_id) {
        fetchUserData();
        fetchAlerts();
        setPage(1)
    }
}, [user]);
    useEffect(() => {
        getPosts()
    },[page])
   

    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }
  
    const getPosts = async () => {
        const limit = 10;
        const lastId = nextId?nextId : 0
            
            try{
            await axios.get(`${API_ENDPOINT}post?page=${page}&lastId=${lastId}&limit=${limit}`,{withCredentials: true}).then(({data})=>{
                if(page === 1){
                    setPost(data.result)
                } else {
                    setPost((prev) => [...prev, ...data.result])
                }
                setNextId(data.nextID)
                setHasMore(data.more_items)
            })
        } catch(error){
            setHasMore(error.response.data.more_items)
        }
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
        await axios.post(`${API_ENDPOINT}react`,payload,{withCredentials:true})
        getPosts();
    }
    const fetchUserData = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
            setUserData(data.result[0])
        })
    }
        
    const fetchAlerts = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}alert/user/${id}`,{withCredentials: true}).then(({data})=>{
            setAlertData(data.result)
            // console.log(data.result)
        })
    }
    const onScroll = () => {
        if(listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

            if(scrollTop + clientHeight >= scrollHeight) {
                setPage(prevPage => prevPage + 1)
            }
        }
    
        
    }
    useEffect (() => {
        window.addEventListener('scroll',onScroll);

        return () => window.removeEventListener('scroll',onScroll)
    }, [])
    
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
    <Row>{ alert ? (
            <div>
                <Alert variant="warning" onClose={() => closeAlert()} dismissible>
                <p>
                    Currently open to gmail users for testing purposes. 
                </p>
            </Alert>
            </div>
    ):( <>
    <TopNavbar handleToggleSidebar={toggleSidebar}/>

    </>)}
    </Row>

    <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
        <Container fluid >
            <Row>
            <Col lg={2} className='topic-col'>
                <Sidebar showSidebar={showSidebar} 
                handleCloseSidebar={() => setShowSidebar(false)}/>
                </Col>

            <Col lg={8} sm={12} xs={12} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden'}} onScroll={onScroll}
        ref={listInnerRef}> 
            <div className='container'> 
            {
                post.length > 0 && (
                post.map((post)=>(
                    <div key={`main-${post.postID}`}>
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
                
            </div>
            {
                hasMore === false && (
                    <div className='h-100 w-100 d-flex justify-content-center text-white'>
                        <span> - - End of posts - - </span>
                    </div>
                )
            }
            </Col>

            <Col lg={2} className='d-none d-sm-block' style={{height:'100vh', overflow:'scroll'}}>
                 <div style={{width:'100%'}}>
                    <Card style={{backgroundColor:'black', width:'100%'}}>
                        <div className='d-flex flex-column '>
                        <span style={{fontWeight:'bold',color:'white'}}>New Post</span>
                        <div>
                        <div>
                        {
                        post.length > 0 && (
                        post.slice(0,10).map((post)=>(
                            <div key={`side-${post.postID}`}>
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
    </div>
    )
}

export default Home
