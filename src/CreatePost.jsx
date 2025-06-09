import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,Container,Button,Form,Row,Col,Card,Placeholder,Dropdown,Spinner,ButtonGroup} from 'react-bootstrap';
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

import './CreatePost.css';

axios.defaults.withCredentials = true;

function CreatePost () {
    // const for user fetching
    const [user, setUser] = useState(null);
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [selectedTopic, setSelectedTopic] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [postButtonLoading, setpostButtonLoading] = useState(false);

    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            setPageLoading(true)
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
    
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            setPageLoading(false)
            // console.log(data.result)
        })
    }

    const [values, setValues] = useState({
        title:'',
        body:'',
    });

    const sample = (event) => {
        setSelectedTopic(event.target.value);
    }
  
    const addPost = async (e) => {
        setpostButtonLoading(true)

        e.preventDefault();
        const user_id = user.user_id;
        const topic_id = selectedTopic;
        const payload = {
            ...values, user_id, topic_id
        }
        console.log(payload);
        await axios.post(`${API_ENDPOINT}post`,payload,{withCredentials: true})
    }
    useEffect(() => {
            function simulateNetworkRequest() {
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
            }
            if (postButtonLoading) {
            simulateNetworkRequest().then(() => {
                setpostButtonLoading(false);
                navigate('/');
            });
            }
        }, [postButtonLoading]);
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
                </> :
                <div style={{
                backgroundColor:'black',
                fontFamily: 'Tahoma, sans-serif',
                minWidth:'100vw'}}>
                    <Navbar data-bs-theme='dark' style={{borderBottom:'solid', paddingTop:20, paddingBottom: 0, height:'60px'}}>
                        <Container fluid>
                            <Row className="w-100 align-items-center">
                                <div className='d-flex justify-content-center' style={{height:'100%'}}>
                                <Col>
                                <div style={{display:'flex', alignItems:'center'}}>
                                <FaBell style={{color:'#ffac33', fontSize:'25px'}} />
                                <Navbar.Brand style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>
                                    <Nav.Link as={Link} to='/'>
                                    Campus Bell
                                    </Nav.Link>
                                    </Navbar.Brand>
                                </div>
                                </Col>
                                
                                <Col className="d-flex justify-content-center">
                                <Nav>
                                    <div style={{width:'400px', position:'relative', marginTop:'4px'}}>
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
                                    <Nav.Link className='navLinkColor' style={{fontWeight:'bold'}} as={Link} to='/'>
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

                                    <Col>
                                        <div className='container' style={{color:'white'}}>
                                            <Row>
                                                <div>
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
                                                                <Form.Control placeholder='Title' style={{borderRadius:'15px', height:'60px'}}
                                                                    onChange={(e)=>setValues({...values,title: e.target.value})}>
                                                                        
                                                                    </Form.Control>
                                                            </Form.Group>
                                                        <div style={{marginTop:'8px'}}>
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    Body
                                                                </Form.Label>
                                                                <Form.Control className='post-area' as="textarea"
                                                                onChange={(e)=>setValues({...values,body:e.target.value})}>
                                                                        
                                                                    </Form.Control>
                                                            </Form.Group>
                                                            </div>
                                                            <div style={{marginTop:'8px'}}>
                                                                <Form.Group>
                                                                    <Button type='submit' variant='success' style={{borderRadius:'15px', width:'120px'}}>
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
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                    </Container>
                </div>
            }
        </>
    )
}

export default CreatePost
