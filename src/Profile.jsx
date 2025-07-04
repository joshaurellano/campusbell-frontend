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
