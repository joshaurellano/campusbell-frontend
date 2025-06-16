import React, { useEffect, useState,useRef } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
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

import './Messages.css';

axios.defaults.withCredentials = true;

function Messages () {
const WS_URL  = `${API_ENDPOINT}`;
// const for user fetching
const [user, setUser] = useState(null);
const [userData, setUserData] = useState([]);
const [members, setMembers] = useState([]);
const [selectedMember, setSelectedMember] = useState(null);
const [chatData, setChatData] = useState('');
const [chatMessages, setChatMessages] = useState([]);

const navigate = useNavigate();

    useEffect(() =>{
        const checkUserSession = async () => {
            try {
                const userInfo = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                    setUser(data.result);
                })
                console.log(userInfo)
            } catch(error) {
                //go back to login in case if error
                navigate ('/login');
            }
        };
            checkUserSession();
        }, []);

const fetchUserData = async () => {
    const id = user.user_id;
    await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
    setUserData(data.result)
    })
    console.log(userData)
}
useEffect(() => {
    if (user?.user_id) {
        fetchUserData();
    }
}, [user]);
useEffect(() =>{
    fetchMembers()
})

const fetchMembers = async () => {
    await axios.get(`${API_ENDPOINT}user`,{withCredentials:true}).then(({data})=>{
        setMembers(data.result)
    })
}
const handleSelectedMember = (member_data) => {
    setSelectedMember(member_data);
    setChatMessages([]); 
};
    //Check if user has session
const wsRef = useRef(null);

const { sendJsonMessage, getWebSocket, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
        console.log('WebSocket connection established.');
        wsRef.current = getWebSocket();
},
 onMessage: (event) => {
        const messageData = JSON.parse(event.data);
        console.log('Incoming message:', messageData);

        if (
            messageData.sender_id === selectedMember?.user_id ||
            messageData.receiver_id === selectedMember?.user_id
        ) {
            setChatMessages(prev => [...prev, messageData]);
        }
    },
    onClose: () => {
        console.log('WebSocket connection closed.');
    }
});

const sendMessage = () => {
    console.log('Attempting to send message...');
    console.log('WebSocket state:', wsRef.current?.readyState);

    if (wsRef.current  && wsRef.current.readyState === WebSocket.OPEN){
    const data = {
            sender_id: user.user_id,
            receiver_id: selectedMember.user_id,
            message: chatData,
            type: "send_message"
            // timestamp: Date.now()
        };
    console.log (data)
    wsRef.current.send(JSON.stringify(data));
    setChatData('');
    }else {
        console.warn('WebSocket is not open.');
    }
}

  // Lifecycle cleanup
useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

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
    return (
        <div className='page'>
            <Row>
                 <Navbar fixed="top" expand="lg" data-bs-theme='dark' style={{borderBottom:'solid', padding: 0, height:'60px', backgroundColor:'black', zIndex:1, display:'flex', alignItems:'center'}}>
                        <Container fluid style={{height:'inherit', padding:0}}>
                            <Row style={{width:'100%'}}>
                            
                            <Col lg={4} xs={5} style={{display:'flex',alignItems:'center'}}>
                            <div className='brand' style={{display:'flex', alignItems:'center'}}>
                                
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
                
                                <Nav.Link as={Link} to='/chat'>
                                    <BiSolidMessageRoundedDots className='top-menu-icons' style={{cursor:'pointer',color:'white'}} />
                                </Nav.Link>
                
                                 <Nav.Link as={Link} to='/post'>
                                    <IoIosNotifications className='top-menu-icons' style={{cursor:'pointer',color:'white'}} />
                                </Nav.Link>
                
                                <NavDropdown className="custom-nav-dropdown" title={<><Image src={userData.profile_image} className='pfp-icon' roundedCircle /></>} id="basic-nav-dropdown">
                                    <NavDropdown.Item>Settings</NavDropdown.Item>
                                    <NavDropdown.Item onClick={()=>viewProfile(user.user_id)}>Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
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
                                <span style={{fontWeight:'bold',color:'gray'}}>Members</span>              
                               {
                                members.length > 0 && (
                                    members.map((members)=>(
                                        <Nav.Link style={{color:'white'}} onClick={()=>handleSelectedMember(members)}>
                                            {members.username}
                                        </Nav.Link>
                                        ))
                                    )
                                }

                                <hr/>                            
                                </Nav>
                                </div>
            
                               
                            </Container>
                            </Col>

                            <Col lg={8}>
                                <div>
                                    {
                                        selectedMember && selectedMember ?(
                                            <div>
                                                <Card style={{backgroundColor:'black', color:'white'}}>
                                                    <Card.Header>{selectedMember.username}</Card.Header>
                                                    <Card.Body style={{minHeight:'300px'}}>                                                            
                                                        {
                                                            chatMessages.map((msg, index) => (
                                                                <div key={index} style={{ 
                                                                    textAlign: msg.sender_id === user.user_id ? 'right' : 'left',
                                                                    margin: '8px 0'
                                                                }}>
                                                                    <span className='message-bubble'>{msg.message}</span>
                                                                </div>
                                                            ))
                                                        }
                                                    <Card className='message-card' style={{border:'none'}}>
                                                        <Form>
                                                            <Form.Group>
                                                                <Form.Control className='chat-box' as="textarea" value={chatData} onChange={(e)=>setChatData (e.target.value)}>

                                                                </Form.Control>
                                                            </Form.Group>
                                                            <br /> <br />
                                                            <Form.Group>
                                                                <Button onClick={sendMessage}>
                                                                    Send
                                                                </Button>
                                                            </Form.Group>
                                                        </Form>
                                                    </Card>
                                                    </Card.Body>


                                                </Card>
                                            </div>
                                        ) : (
                                            <div> <span style={{color:'white'}}> Select Contact to chat</span></div>
                                        )
                                    }

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Row>
             
        </div>

    )
}

export default Messages
