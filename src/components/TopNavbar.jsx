import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Image, Badge, CloseButton} from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbPointFilled } from "react-icons/tb";

import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from '../Api';
import { useSocket } from '../WSconn';
import { useAuth } from '../AuthContext';

import '../Home.css';

axios.defaults.withCredentials = true;

const TopNavbar = ({handleToggleSidebar}) => {    
    const user = useAuth();
    const navigate = useNavigate();
    const socket = useSocket();
    
    const [userData, setUserData] = useState([]);
    const [userSearch, setUserSearch] = useState([]);
    const [postSearch, setPostSearch] = useState([]);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [windowSize, setWindowSize] = useState(window.innerWidth)
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [alertData, setAlertData] = useState([]);
    const [openSearch, setOpenSearch] = useState(false);

    const searchOpen = () => setOpenSearch(true)
    const searchClose = () => setOpenSearch(false)

    //function to handle logout
    const handleLogout = async () => {
        try {
            // remove token from cookies
            await axios.post(`${API_ENDPOINT}auth/logout`,{withCredentials:true})

            // make sure to go back to login page after removing the token
            if(socket) {
                socket.disconnect();
                console.log('User disconnect') 
            }
            navigate('/login')
        } catch (error) {
            console.error('Logout failed',error)
        }
    }

    useEffect(() => {
    if (user?.user_id) {
        fetchUserData();
        fetchAlerts()
    }
}, [user]);
useEffect(() => {
    handleSearch();
},[search])

useEffect(() => {
    const handleResize = () =>
        setWindowSize(window.innerWidth)
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
},[])

    const viewProfile = (userId) => {
        navigate('/profile', {state: {
            userId
        }});
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
    const handleSearch = async () => {
    searchOpen();
    if(search){
    try{
        setUserSearch('')
        setPostSearch('')
        await axios.get(`${API_ENDPOINT}search/find?search=${search}`,{withCredentials:true}).then(({data})=> {
            setUserSearch(data.userResult)
            setPostSearch(data.postResult)
        })
    }   catch(error) {
        setError(error.response.data.message)
    }     
    } else if(!search){
    searchClose();
    setMobileSearch(false)
    setUserSearch('');
    setPostSearch('');
    }
}
const updateAlerts = async () => {
    const id = user.user_id
    const notif_data = alertData[0]?.postData
    const postIds = notif_data?.flatMap(alert => {
            const reactIds = alert.react?.map(postReact => postReact.notifID) || []
            const commentIds = alert.comment?.map(postComment => postComment.notifID) || []
            return [...reactIds, ...commentIds]
        }
    ) || []
    
    const friend_request = alertData[0]?.friendRequests?.map (req => req.notifID) || []

    const accepted_request = alertData[0]?.acceptedFriendRequest?.map(acc => acc.notifID) || []

    const ids = [...postIds, ...friend_request, ...accepted_request]
    
    try {
        await axios.put(`${API_ENDPOINT}alert/${id}`,{ids},{withCredentials:true})
        fetchAlerts();
    } catch (error) {
        console.error(error)   
    }
}
  return (
    <div>
       <Navbar fixed="top" expand="lg" data-bs-theme='dark' style={{borderBottom:'solid', padding: 0, height:'60px', backgroundColor:'black', zIndex:1, display:'flex', alignItems:'center'}}>
        <Container fluid style={{height:'100%', padding:0}}>
            <Row style={{width:'100%',display:'flex',alignItems:'center'}}>
            <Col lg={3} md={4} sm={4} xs={5} style={{display:'flex',alignItems:'center'}}>
            <div 
            className='brand' 
            style={{display:'flex', alignItems:'center', width:'100%'}}>
                <div className='d-block d-md-block d-sm-block d-lg-none'>
                    <Button variant="primary"onClick={handleToggleSidebar}style={{backgroundColor:'transparent', border:'none', translate: '0px -2px'}}>
                        {
                            <>
                                <GiHamburgerMenu />
                            </>
                        }
                    </Button>
                    </div>
                <FaBell style={{color:'#ffac33'}} />
                <Navbar.Brand 
                className='brand' 
                style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>
                    <Nav.Link as={Link} to='/'>
                    Campus Bell
                    </Nav.Link>
                    </Navbar.Brand>
            </div>
            </Col>

            <Col 
            lg={6} md={4} sm={4} xs={2} style={{
            }}>
            <Nav className="me-auto align-items-center"style={{width:'100%', height:'100%', display:'flex', justifyContent:'start', flexDirection:'column', position:'relative'}}>
                <div className='searchbar-wrapper'>
                    <FaMagnifyingGlass className='searchbar-icon' onClick={()=> 
                    {
                        setMobileSearch(true)
                    }} />
                        <Form.Control 
                        className='searchbar'
                        placeholder='Search' 
                        value={search}                            
                        onChange={(e) => setSearch(e.target.value)} />
                </div>
                { 
                    openSearch && (
                        <div className='search-result container'>
                            <div className='search-body-title' style={{color:'white'}}>
                            <span><strong>Search Result</strong></span>
                            </div>
                            <hr style={{margin:0}}/>
                            <div style={{marginTop:'8px', color:'white'}}>
                                <div>
                                    {
                                        userSearch && userSearch.length > 0 ? (
                                            <div>
                                                <span style={{fontWeight:'500'}}>Users</span>
                                                <hr style={{margin:0}} />
                                                {
                                                userSearch.map((data)=>(
                                                    <div className='selected'
                                                    key={data.user_id} onClick={() => {
                                                        navigate('/user',{state:{userId:data.user_id, user_id:user.user_id}})
                                                        setSearch('')
                                                    }}>

                                                        <div className='d-flex flex-row align-items-center' style={{height:'100%', gap:'10px'}}>
                                                            <div className='d-flex align-items-center'>
                                                                <Image roundedCircle
                                                                height='16px'
                                                                width='16px'
                                                                src={data.profile_image}
                                                                alt='Profile Image'
                                                                />
                                                            </div>

                                                            <div className='selected-search'>
                                                            <span>{data.first_name} {data.last_name}</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <small style={{color:'#adb5bd', fontSize:'.8rem'}}>{data.username}</small>
                                                            </div>
                                                        <hr />
                                                    </div>
                                            ))
                                            }
                                            </div>
                                            
                                        ) : (
                                            <>
                                            <span></span>
                                            </>
                                        )
                                    }
                                                    
                            </div>
                            <div>
                                    {
                                        postSearch && postSearch.length > 0 ? (
                                            <div>
                                                <span style={{fontWeight:'500'}}>Posts</span>
                                                <hr style={{margin:0}} />
                                            {
                                                postSearch.map((data)=>(
                                                    <div className='selected' key={data.post_id} onClick={() => {
                                                        navigate('/view',{state:{postID: data.post_id}})
                                                        setSearch('')
                                                        }
                                                    }>
                                                        <div>
                                                            <div className='selected-search'>
                                                            {data.title}
                                                            </div>

                                                            <div className='d-flex align-items-center h-100' style={{gap:'5px'}}>
                                                                <TbPointFilled style={{fontSize:'.8rem'}} />
                                                                <small style={{color:'#adb5bd', fontSize:'.8rem'}}>{data.topic_name}</small>
                                                                
                                                                <TbPointFilled style={{fontSize:'.8rem'}} />
                                                                <Image roundedCircle
                                                                height='16px'
                                                                width='16px'
                                                                src={data.profile_image}
                                                                alt='Profile Image'
                                                                />
                                                                <small style={{color:'#adb5bd', fontSize:'.8rem'}}> {data.username}</small>
                                                            </div>

                                                            
                                                            
                                                        </div>
                                                    <hr />
                                                    </div>
                                                ))
                                            }
                                            </div>
                                        ) : (
                                            <>
                                            <span></span>
                                            </>
                                        )
                                    }
                                    </div>
                                    </div>
                                    {
                                        error && (!userSearch && !postSearch) && (
                                            <div style={{marginBottom:'8px'}}>
                                                <span style={{color:'white'}}>{error}</span>
                                            </div>
                                        )
                                    } 
                                </div>
                    )
                }
            </Nav>
            </Col>
            
            { (mobileSearch && windowSize <= 425) && (
            <Col>
                <div>
                    <Form.Control 
                    className='mobile-search'
                    placeholder='Search'
                    value={search}                             
                    onChange={(e) => setSearch(e.target.value)} />
                    <CloseButton onClick={() => {
                        setMobileSearch(false)
                        setSearch('')
                    }} aria-label="Hide" style={{fontSize:'8px',position:'absolute', right:'30px',top:'24px'}} />
                </div>
            </Col>
            )}
            
            
            {
                (!mobileSearch || windowSize > 425) &&(
                    <Col lg={3} md={4} sm={4} xs={5} style={{ display:'flex', alignItems:'center', height:'100%'
                    }}>
                        <div style={{width:'100%'}}>
                        <Nav>
                        <Nav.Link 
                        className='top-menu' 
                        as={Link} to='/post'style={{cursor:'pointer',color:'white'}}>
                        Post
                        </Nav.Link>

                        <Nav.Link as={Link} to='/chat'>
                            <BiSolidMessageRoundedDots 
                            className='top-menu-icons' 
                            style={{cursor:'pointer',color:'white'}} />
                        </Nav.Link>

                        <NavDropdown
                            className="notif-dropdown"
                            title={<><IoIosNotifications 
                            className='top-menu-icons' 
                            />
                                {   
                                    alertData[0]?.unreadNotif > 0 && (
                                    <Badge pill bg='danger'style={{fontSize:'8px'}}>{alertData[0].unreadNotif}</Badge>
                                    )
                                }
                            </>}
                            id="basic-nav-dropdown" >
                            <div id='notification-header'>Notifications</div>
                        {
                            alertData && (
                            alertData.map((alerts, key) =>(
                                <div key={key}>
                                    {
                                        alerts.postData ? (
                                            alerts.postData && Object.values(alerts.postData).map((notif, key) => (
                                                    <div key={key}>
                                                    {
                                                        notif.react ? (
                                                            Object.values(notif.react).map(react => (
                                                                <NavDropdown.Item key={react.notifID}>
                                                                    <span><strong>{react.reactorusername}</strong> reacted to your post {notif.title}</span>
                                                                    <div>
                                                                    <span>{react ?.reactTime && (<ReactTimeAgo 
                                                                    date={new Date(react.reactTime)}
                                                                    locale="en-US"
                                                                    timeStyle="round"/>)}</span>
                                                                    </div>
                                                                </NavDropdown.Item>
                                                            ))
                                                        ) : notif.comment && (
                                                            Object.values(notif.comment).map(comment => (
                                                                <NavDropdown.Item key={comment.notifID}>
                                                                    <span><strong>{comment.commenterusername}</strong> commented on your post {notif.title}</span>
                                                                    <div>
                                                                    <span>{comment?.commentTime && (<ReactTimeAgo 
                                                                    date={new Date(comment.commentTime)}
                                                                    locale="en-US"
                                                                    timeStyle="round" />)}</span>
                                                                    </div>
                                                                </NavDropdown.Item>
                                                            ))
                                                        )
                                                    }
                                                </div>
                                            )
                                        )
                                    ) : alerts.friendRequests ? (
                                        alerts.friendRequests.map((request)=>(
                                                <NavDropdown.Item key={request.notifID} onClick={() => navigate('/user',{state:{userId: request.requestor_userID, user_id:user.user_id}})}>
                                                    <div className='d-flex flex-row align-items-center' style={{gap:'5px'}}>
                                                        <Image src={request.requestor_profileImage} height={20} width={20} />
                                                        <span><strong>{request.username}</strong> sent you a friend request</span>
                                                    </div>
                                                    <div>
                                                        <span><small>{request?.request_time &&(
                                                            <ReactTimeAgo 
                                                            date={new Date (request.request_time)}
                                                            locale="en-US"
                                                            timeStyle="round"
                                                        />)}</small></span>
                                                    </div>
                                                </NavDropdown.Item>
                                        )
                                    )
                                ): alerts.acceptedFriendRequest ? (
                                    alerts.acceptedFriendRequest.map((accept) => (
                                        <NavDropdown.Item key={accept.notifID} onClick={() => navigate('/user',{state:{userId: accept.acceptor_userID, user_id:user.user_id}})}>
                                            <div className='d-flex flex-row align-items-center' style={{gap:'5px'}}>
                                                <Image src={accept.acceptor_profileImage} height={20} width={20} />
                                                <span><strong>{accept.username}</strong> accepted your friend request</span>
                                            </div>
                                            <div>
                                                <span><small>{accept?.accept_time &&(
                                                    <ReactTimeAgo 
                                                    date={new Date (accept.accept_time)}
                                                    locale="en-US"
                                                    timeStyle="round"
                                                />)}</small></span>
                                            </div>
                                        </NavDropdown.Item>
                                    ))
                                ):(<NavDropdown.Item>
                                        No notification yet
                                    </NavDropdown.Item>)
                                }
                                </div>
                            ))
                            )
                        }
                        { alertData[0]?.unreadNotif > 0 && (
                            <div style={{padding:'4px'}}>
                                <span onClick={() => updateAlerts()}><Link>Mark all as read</Link></span>
                            </div>
                            )
                        }
                        </NavDropdown>
                        
                        <NavDropdown 
                        className="custom-nav-dropdown"
                        title={<><Image src={userData.profile_image} 
                        className='top-menu-icons pfp-icon' 
                        roundedCircle /></>} id="basic-nav-dropdown">
                            <div>
                            <NavDropdown.Item onClick={()=>navigate('/unavailable')}>Settings</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>viewProfile(user.user_id)}>Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </div>
                        </NavDropdown>
                    
                        </Nav>
                        </div>
                    </Col>)}
            </Row>
        </Container>
        
    </Navbar>
    </div>
  )
}

export default TopNavbar
