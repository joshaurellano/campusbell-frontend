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
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'
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

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }
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
           navigate('/');
            
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
        setUserData(data.result[0])
        })
}
    return (
        <>
        <div>
            <Row>
            <TopNavbar handleToggleSidebar={toggleSidebar}/>
            </Row>
                <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
                <Container fluid>
                    <Row>
                        <Col lg={2} style={{borderRight:'2px solid gray'}}>
                            <Sidebar showSidebar={showSidebar} 
                            handleCloseSidebar={() => setShowSidebar(false)}/>
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
