import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,NavDropdown,Container,Button,Form,Row,Col,Image} from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

import ReactTimeAgo from 'react-time-ago'

import {Link} from 'react-router-dom';

import {API_ENDPOINT} from '../Api';

import '../Home.css';

axios.defaults.withCredentials = true;

const TopNavbar = ({handleToggleSidebar}) => {
    
  // const for user fetching
      const [user, setUser] = useState(null);
      // for topics
      const [userData, setUserData] = useState([]);
      const [userSearch, setUserSearch] = useState([]);
      const [postSearch, setPostSearch] = useState([]);
      const [search, setSearch] = useState('');
      const [error, setError] = useState('');
      const [alertData, setAlertData] = useState(null);
      const [openSearch, setOpenSearch] = useState(false);

      const searchOpen = () => setOpenSearch(true)
      const searchClose = () => setOpenSearch(false)
    
      const navigate = useNavigate();
      //Check if user has session
      useEffect(() =>{
          const checkUserSession = async () => {
              try {
                  const userInfo = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                      setUser(data.result);
                  })
                  // console.log(userInfo)  
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
    
     useEffect(() => {
      if (user?.user_id) {
          fetchUserData();
          fetchAlerts()
      }
  }, [user]);
    useEffect(() => {
        handleSearch();
    },[search])

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
            await axios.get(`${API_ENDPOINT}search/find?search=${search}`,{withCredentials:true}).then(({data})=> {
                setUserSearch(data.userResult)
                setPostSearch(data.postResult)

                if(data.totalPost){
                    setUserSearch('')
                } else if(data.totalUser){
                    setPostSearch('')
                }
            })
        }   catch(error) {

            setError(error.response.data.message)
        }     
      } else if(!search){
        searchClose();
        setUserSearch('');
        setPostSearch('');
      }
    }
  return (
    <div>
       <Navbar fixed="top" expand="lg" data-bs-theme='dark' style={{borderBottom:'solid', padding: 0, height:'60px', backgroundColor:'black', zIndex:1, display:'flex', alignItems:'center'}}>
        <Container fluid style={{height:'inherit', padding:0}}>
            <Row style={{width:'100%',display:'flex',alignItems:'center'}}>
            
            <Col lg={4} xs={5} style={{display:'flex',alignItems:'center'}}>
            <div className='brand' style={{display:'flex', alignItems:'center'}}>
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
            <Nav className="me-auto align-items-center"style={{width:'100%', height:'100%', display:'flex', justifyContent:'start', flexDirection:'column', position:'relative'}}>
                <div style={{display:'flex', alignItems:'center', height:'100%'}}>
                    <FaMagnifyingGlass className='searchbar-icon' />
                    <Row style={{width:'100%'}}>
                        <Col lg={12} xs={1}>
                        <Form.Control className='searchbar' placeholder='Search'                             
                            onChange={(e) => setSearch(e.target.value)} />
                        </Col>
                    </Row>
                </div>
                
                { 
                    openSearch && (
                        <div className='container' style={{width:'400px',height:'auto', maxHeight:'400px', backgroundColor:'white', zIndex:1, position:'absolute', top:'100%', marginTop:'8px', borderRadius:'4px', display:'flex', flexDirection:'column', overflowY:'auto'}}>
                            <div style={{height:'12%',display:'flex',alignItems:'center', padding:'4px', whiteSpace:'nowrap'}}>
                            <span><strong>Search Result</strong></span>
                            </div>
                            <hr style={{margin:0}}/>
                            <div style={{marginTop:'8px'}}>
                                <div>
                                    {
                                        userSearch && userSearch.length > 0 ? (
                                            <div>
                                                <span style={{fontWeight:'500'}}>Users</span>
                                                <hr style={{margin:0}} />
                                                {
                                                userSearch.map((data)=>(
                                                    <div key={data.user_id}>
                                                        {data.username}
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
                                                    <div key={data.post_id}>
                                                    {data.title}
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
                                                <span>{error}</span>
                                            </div>
                                        )
                                    } 
                                </div>
                    )
                }
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
    </div>
  )
}

export default TopNavbar
