import React, { useEffect, useState, useRef } from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Card,Placeholder,Dropdown,Spinner,Offcanvas,Alert,Figure,Image,Modal} from 'react-bootstrap';
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
import { FaCamera } from "react-icons/fa";

import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import './Profile.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'
axios.defaults.withCredentials = true;

function Profile () {
    // const for user fetching
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    // for topics
    const [topics, setTopics] = useState([]);
    const [selected, setSelected] = useState('');
    const [imgFile, setImgFile] = useState('');
    const [prevImg, setPrevImg] = useState('');
    const [alertData, setAlertData] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    const [showProfileModal, setShowProfileModal] = useState(false);
    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }
    const handleCloseProfileModal = () => {
        setShowProfileModal(false)
        removeImgPreview();
    };
    const handleShowProfileModal = () => setShowProfileModal(true);

    const handleSelected = (eventKey) => {
        if(eventKey === '1'){
            setSelected('1');
        } else if(eventKey === '2'){
            setSelected('2')
        }
    }

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
        fetchUserData()
    },[])
     useEffect(() =>{
        if(user?.user_id)
        fetchUserData();
        fetchAlerts();
    },[user])
const fetchAlerts = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}alert/user/${id}`,{withCredentials: true}).then(({data})=>{
            setAlertData(data.result)
        })
    }
    const handleTopicPosts = (topicId) =>{
        navigate('/topic', {state: {
            topicId
        }})
    }
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }
    const location = useLocation();
    const user_id = location.state.userId;
    
    const fetchUserData = async () => {
        const id = user_id;
        await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
        setUserData(data.result[0])
        })
    }  
    
    const uploadImage = async () => {
    let imageUrl = null
    const formData = new FormData();
    formData.append('image', imgFile);
        try{
            const response = await axios.post(`${API_ENDPOINT}upload/images`,formData, {withCredentials: true, headers: {
                                'Content-Type': 'multipart/form-data',
                            },})
            console.log('Upload successful:');
            console.log(response.data.data.url);
            imageUrl = response.data.data.url
            
            const payload = {
                img_link:imageUrl,
                user_id:user.user_id
            }

            const updateImg = await axios.put(`${API_ENDPOINT}user/profile-image`,payload,{withCredentials:true})
            fetchUserData()
            handleCloseProfileModal()

            } catch (error){
                console.error(error)
            }
    }
    const displayImgPreview = (e) => {
        const file = e.target.files[0];
        setPrevImg(URL.createObjectURL(file))
        setImgFile(file)
    }
    const removeImgPreview = () => {
        URL.revokeObjectURL(prevImg)
        setPrevImg('');
    }
    return (
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
            
            <Col lg={7}>
                <div className='container-fluid'>
                
                    <Row>
                    <Col className='container d-flex align-items-center flex-row' lg={12}>
                    <Row style={{width:'100%', height:'100%'}}>
                    {
                        userData && (
                        <>
                            <Col className='profile-col' lg={3} style={{height:'100%', alignItems:'center'}}>
                            <div className='profile-img'>
                                <Image className='pr-img'
                                    width={150}
                                    height={150}
                                    alt="profile_image"
                                    src={userData.profile_image}
                                    roundedCircle	
                                />
                                <FaCamera className='profile-edit'onClick={handleShowProfileModal} />

                                <Modal className='update-img-modal' show={showProfileModal} onHide={handleCloseProfileModal}>
                                    <Modal.Header closeButton>
                                    <Modal.Title>Change Profile Image</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div style={{display:'flex',justifyContent:'center'}}>
                                        { 
                                        prevImg?
                                        prevImg && (
                                            <>
                                                <Image className='pr-img'
                                            width={150}
                                            height={150}
                                            alt="profile_image"
                                            src={prevImg}
                                            roundedCircle	
                                        />
                                            </>

                                        ) : (
                                            <>
                                            <Image className='pr-img'
                                            width={150}
                                            height={150}
                                            alt="profile_image"
                                            src={userData.profile_image}
                                            roundedCircle	
                                            fluid 
                                        />
                                            </>
                                            )}
                                        </div>
                                
                                <br />
                                <Form onChange={displayImgPreview} id='form-img-upload'>
                                    <Form.Group className="mb-3">
                                    <Form.Control type="file" size="sm" />
                                </Form.Group>

                                </Form>
                                </Modal.Body>
                                    <Modal.Footer>
                                    <Button size='sm' className='modal-btn' variant="primary" onClick={uploadImage}>
                                        Save Changes
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                
                            </div> 
                            </Col>

                            <Col className='header-info-col' lg={9} style={{color:'white',height:'100%',display:'flex',justifyContent:'center', flexDirection:'column'}}>
                            <div>
                                <span className='header-info-1'>{userData.first_name} {userData.last_name}</span>
                                </div>
                            <div className='header-info-2'>
                                <span>{userData.username}</span>
                            </div>
                            </Col>

                            
                        </>
                        )
                    }
                    </Row>
                    </Col>
                    
                    <hr style={{color:'white', fontSize:'1px', marginTop:'12px'}}/>
                    </Row>

                    <Row>
                        <Col className='d-none d-sm-block d-md-none d-lg-block'>
                            <div>
                                <span style={{fontWeight:'500', color:'white', fontSize:'1.2rem'}}>Posts</span>
                            </div>
                            <div>
                                
                                        {
                                        userData.posts ? (
                                        userData.posts &&(userData.posts).map(data=>(
                                            <div key={data.postId}>
                                                <Card className='post-card' style={{backgroundColor:'black', color:'white'}}>
                                                    <Card.Header>
                                                    <div>
                                                    <span className='post-title'>{data.post_title}</span>
                                                    </div>
                                                    </Card.Header>
                                                    
                                                    <Card.Body>
                                                        <span className='post-content'>
                                                            {data.post_content}
                                                        </span>
                                                    </Card.Body>
                                                </Card>

                                            </div>
                                            ))
                                                
                                            ) :(
                                                <>
                                                <span>No Post yet</span>
                                                </>
                                            )
                                        }
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>

            <Col lg={3} xs={10} className='container d-none d-sm-block d-md-none d-lg-block'>
                <Container>
                 <Card style={{border:'solid 1px gray', borderRadius:'15px', backgroundColor:'black', color:'white'}}>
                    <Card.Header>
                        <span>User Information</span>
                    </Card.Header>
                    <hr />
                    <Card.Body >
                        <div>
                            <span className='user-info-label'>Basic Information</span>
                        </div>
                        <div className='user-info'>
                            <span>Name : </span>
                            <span>{userData.first_name} {userData.last_name}</span>
                        </div>
                        <div className='user-info'>
                            <span>Username: </span>
                            <span>{userData.username}</span>
                        </div>
                        <hr />
                        <div>
                            <span className='user-info-label'>Contact Information</span>
                        </div>
                        <div className='user-info'>
                            <span>Email : </span>
                            <span>{userData.email}</span>
                        </div>
                        <div className='user-info'>
                            <span>Phone Number : </span>
                            <span>{userData.phone_number}</span>
                        </div>
                        <hr />
                        <div>
                            <span className='user-info-label'>Academic Information</span>
                        </div>
                        <div className='user-info'>
                            <span>Program : </span>
                            <span>{userData.program}</span> 
                            
                        </div>
                        <div className='user-info'>
                            <span>Year Level : </span>
                            <span>{userData.yr_level}</span>
                        </div>
                        <hr />
                        <div>
                            <span className='user-info-label'>Address</span>
                        </div>
                        <div className='user-info'>
                            <span>Province : </span>
                            <span>{userData.province}</span>
                        </div>
                        <div className='user-info'>
                            <span>City : </span>
                            <span>{userData.city || userData.town}</span>
                        </div>
                        <div className='user-info'>
                            <span>Barangay : </span>
                            <span>{userData.barangay}</span>
                        </div>
                        <div className='user-info'>
                            <span>Street : </span>
                            <span>{userData.street}</span>
                        </div>
                        <div className='user-info'>
                            <span>House No : </span>
                            <span>{userData.house_no}</span>
                        </div>
                    </Card.Body>
                 </Card>
                 </Container>
            </Col>
{/* 3rd Column Block */}
            <Col className='d-block d-sm-none d-md-block container-fluid container'>
                <Card style={{border:'1px solid gray',minHeight:'250px', backgroundColor:'black'}}>
                    <Card.Body>
                <div>
                    
                    <Nav variant='tabs' style={{color:'white'}} onSelect={handleSelected}>
                        <Nav.Item>
                            <Nav.Link eventKey='1' style={{color:'gray'}}>
                            Posts
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='2' style={{color:'gray'}}>
                            User Information
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <div>
                        
                        {
                            selected === '1' ? (
                                <>
                            <div style={{marginTop:'8px'}}>
                            {
                            userData.posts ? (
                            userData.posts &&(userData.posts).map(data=>(
                                <div key={data.postId}>
                                    <Card className='post-card' style={{backgroundColor:'black', color:'white'}}>
                                        <Card.Header>
                                        <div>
                                        <span className='post-title'>{data.post_title}</span>
                                        </div>
                                        </Card.Header>
                                        
                                        <Card.Body>
                                            <span className='post-content'>
                                                {data.post_content}
                                            </span>
                                        </Card.Body>
                                    </Card>

                                </div>
                                ))
                                    
                                ) :(
                                    <>
                                    <span>No Post yet</span>
                                    </>
                                )
                            }
                            </div>
                                </>
                            ) : selected === '2' ? (
                                <div style={{color:'white'}}>
                                <div>
                                    <span className='user-info-label'>Basic Information</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Name : </span>
                                        <span>{userData.first_name} {userData.last_name}</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Username: </span>
                                        <span>{userData.username}</span>
                                    </div>
                                    <hr />
                                    <div>
                                        <span className='user-info-label'>Contact Information</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Email : </span>
                                        <span>{userData.email}</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Phone Number : </span>
                                        <span>{userData.phone_number}</span>
                                    </div>
                                    <hr />
                                    <div>
                                        <span className='user-info-label'>Academic Information</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Program </span>
                                        <span>{userData.program}</span> 
                                        
                                    </div>
                                    <div className='user-info'>
                                        <span>Year Level : </span>
                                        <span>{userData.yr_level}</span>
                                    </div>
                                    <hr />
                                    <div>
                                        <span className='user-info-label'>Address</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Province : </span>
                                        <span>{userData.province}</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>City : </span>
                                        <span>{userData.city || userData.town}</span>
                                    </div> 
                                    <div className='user-info'>
                                        <span>Barangay : </span>
                                        <span>{userData.barangay}</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>Street : </span>
                                        <span>{userData.street}</span>
                                    </div>
                                    <div className='user-info'>
                                        <span>House No. : </span>
                                        <span>{userData.house_no}</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                <span> </span>
                                </>
                            )
                        }
                        
                    </div>
                </div>
                </Card.Body>
                        </Card>
            </Col>
            </Row>
        </Container>
    </Row>
    
        </div> 
        
    )
}

export default Profile
