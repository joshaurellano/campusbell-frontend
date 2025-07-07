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
import { IoChatbubble } from "react-icons/io5";

import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from '../Api';

import '../Home.css';

axios.defaults.withCredentials = true;

const Sidebar = ({ showSidebar, handleCloseSidebar }) => {
  // const for user fetching
      const [user, setUser] = useState(null);
      // for topics
      const [topics, setTopics] = useState([]);
      // for post
      const [post, setPost] = useState([]);
      const [userData, setUserData] = useState([]);
      const [alertData, setAlertData] = useState(null);
  
      const [pageLoading, setPageLoading] = useState(false);
  
    //   const [showSidebar, setShowSidebar] = useState(false);
  
    //   const handleCloseSidebar = () => setShowSidebar(false);
    //   const handleShowSidebar = () => setShowSidebar(true);
  
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
          await axios.get(`${API_ENDPOINT}post/`,{withCredentials: true}).then(({data})=>{
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
  return (
    <div>
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
            <Nav.Link className='navLinkColor' style={{fontWeight:'bold'}} as={Link} to='/wall'>
                <div style={{fontSize:'15px', display:'flex', alignItems:'center',color:'white', gap:'4'}}>
                <IoChatbubble style={{display:'flex', gap:'4'}} />
                <div>
                <span>
                Freedom Wall
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
    </div>
  )
}

export default Sidebar
