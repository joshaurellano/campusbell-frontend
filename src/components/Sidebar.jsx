import React, { useEffect, useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Card,Placeholder,Image,Spinner, Offcanvas,Alert} from 'react-bootstrap';

import { CiCirclePlus } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";

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
      const [userData, setUserData] = useState([]);

      const navigate = useNavigate();
         useEffect(() =>{
          const checkUserSession = async () => {
              try {
                  const userInfo = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                      setUser(data.result);
                  })  
              } catch(error) {
                  navigate ('/login');
              }
          };
          checkUserSession();
      }, []);
      
      const fetchUserData = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
            setUserData(data.result[0])
        })
    }
      useEffect(() =>{
        if(user?.user_id){
          getTopics()
          fetchUserData()
        }
      },[user])
  
      const getTopics = async () => {
              await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
              setTopics(data.result)
          })
      }
    
      const handleTopicPosts = (topicId) =>{
          navigate('/topic', {state: {
              topicId
          }})
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
                <hr />
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
