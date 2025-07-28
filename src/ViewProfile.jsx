import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago'
import { Row, Col, Container, Figure, Button, Badge, Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { FaBookOpen } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";

import {API_ENDPOINT} from './Api';

import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import './ViewProfile.css';

axios.defaults.withCredentials = true;

const ViewProfile = () => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [profile, setProfile] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false);

    const location = useLocation();
    const user_id = location.state.userId;

    const viewUser = async () => {
        const id = user_id;
        try {
            await axios.get(`${API_ENDPOINT}user/view/${id}`,{withCredentials:true}).then(({data})=>{
              setProfile(data.result)
              if(data.result.friendRequest === 'rejected') {
                setRejected(true);
              }
              console.log(data.result.friendRequest)
            })
        } catch (error) {
            console.error(error)
        }
    }
    const handleFriendRequest = async (receiver_id) => {
      setButtonLoading(true)
      try {
        const sendFriendRequest = await axios.post(`${API_ENDPOINT}request`,{receiver_id}, {withCredentials:true})
          setButtonLoading(false)
          viewUser();
      } catch (error) {
        console.error(error)
        setButtonLoading(false)
      }
    }
    const handleAcceptFriendRequest = async (id) => {
      setButtonLoading(true)
      try {
        const acceptFriendRequest = await axios.put(`${API_ENDPOINT}request/accept/${id}`, {withCredentials:true})
          setButtonLoading(false)
          viewUser();
      } catch (error) {
        console.error(error)
        setButtonLoading(false)
      }
    }
    const handleRejectFriendRequest = async (id) => {
      try {
        const rejectFriendRequest = await axios.put(`${API_ENDPOINT}request/reject/${id}`, {withCredentials:true})
          viewUser();
      } catch (error) {
        console.error(error)
      }
    }
    const rejectedTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Please wait 48 hrs to be able to send a friend request again
    </Tooltip>
  );
    useEffect(() => {
        viewUser()
    },[user_id])

return (
    <div style={{height:'100vh', overflow:'hidden'}}>
      <div>
      <Row>
        <TopNavbar />
      </Row>

      <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
        <Container fluid>
          <Row>
          <Col lg={2} className='topic-col'>
            <Sidebar showSidebar={showSidebar} 
                handleCloseSidebar={() => setShowSidebar(false)}/>
          </Col>

          <Col lg={10} sm={12} xs={12} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden'}}>
                <Row style={{height:'350px', width:'100%',paddingLeft:'20px'}}>
                  <Container className='p-0' fluid style={{position:'relative'}}>
                  <div style={{
                      backgroundImage: "url('https://res.cloudinary.com/dv7ai6yrb/image/upload/v1753324185/pexels-pixabay-289737_gmm8ey.jpg')" ,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      height:'65%',
                      width: "100%",
                      borderRadius:'5px',
                      outline:'1px solid black'
                      }}>

                  
                  <div style={{
                    position: 'absolute',
                    zIndex: 0,
                    bottom: '-30px',
                    left: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '10px 20px',
                    width:'100%',
                    //height:'auto'
                    }}>
                    <Figure>
                    <Figure.Image
                    roundedCircle
                    fluid 
                    width={180}
                    height={180}
                    alt="profile image"
                    src={profile.profile_image} 
                    style={{border:'2px solid black'}}
                    />
                  </Figure>
                    <div className='d-flex flex-column w-100'>
                    <div className='d-flex flex-row justify-content-between' style={{width:'100%'}}>
                    <div className='d-flex flex-row' style={{gap:'20px'}}>
                      <h2 style={{color:'white'}}>{profile.first_name} {profile.last_name}</h2>
                      <div className='d-flex align-items-center'>
                      <Badge pill bg='success'>{profile.role}</Badge>
                      </div>
                    </div>
                    {
                      profile.friend ? (
                        <div>
                          <Button variant="outline-light" style={{pointerEvents:'none'}}>Friends</Button>
                        </div>
                      ) : !profile.friend && profile.friendRequest === null ? (
                        <div>
                          <div>
                            <Button 
                            disabled={buttonLoading}
                            onClick={() => handleFriendRequest(profile.user_id)}
                            >
                              {
                                buttonLoading ? (<>
                                  <Spinner animation="border" size="sm" />
                                </>) : 
                                
                                (<>
                                Add as a friend
                                </>)
                              }
                              
                              </Button>
                            </div>
                        </div>
                      ) : !profile.friend && profile.friendRequest === 'pending reply' ? (
                        <div className='d-flex flex-row' style={{gap:'10px'}}>
                        <div>
                          <Button variant='success' onClick={() => handleAcceptFriendRequest(profile.user_id)}>
                            {
                              buttonLoading ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                              <>
                                Accept
                              </>)
                            }
                          </Button>
                        </div>
                        <div>
                          <Button variant='secondary' onClick={() => handleRejectFriendRequest(profile.user_id)}>Ignore</Button>
                          </div>
                        </div>
                      ) : !profile.friend && profile.friendRequest === 'pending' ? (
                        <div>
                          <Button variant='outline-primary' style={{pointerEvents:'none'}}>Friend Request Sent</Button>
                        </div>
                      ) : !profile.friend && profile.friendRequest === 'rejected' && (
                        <div>
                          <OverlayTrigger overlay={rejectedTooltip}
                            placement="left"
                            delay={{ show: 250, hide: 400 }}
                            >
                          <span className="d-inline-block">
                            <Button variant='outline-primary' disabled style={{ pointerEvents: 'none' }}>
                              Add as a Friend
                            </Button>
                          </span>
                          </OverlayTrigger>
                        </div>
                      )
                      
                    }
                    </div>

                    <div>
                      <span style={{color:'white'}}>{profile.username}</span>
                    </div>
                    
                    </div>
                    </div>
          
                    </div>
                  </Container>
                
                </Row>
              
              <Row>
                <div>
                  <div style={{padding:'8px', gap:'10px'}} className='d-flex align-items-center'>
                    <FaBookOpen style={{color:'white'}} />
                    <span style={{color:'white', fontSize:'1.125rem'}}>Bio</span>
                  </div>
                  <div>
                  
                  <div className='container'>
                    <Card style={{width:'100%', height:'100px', backgroundColor:'#1a1a1a'}}>
                      <Card.Body></Card.Body>
                    </Card>
                  </div>

                  <div>
                    <div style={{padding:'8px', gap:'10px'}} className='d-flex align-items-center'>
                    <FaNoteSticky style={{color:'white'}} />
                    <span style={{color:'white', fontSize:'1.125rem'}}>Posts</span>
                  </div>
                  </div>

                  <div className='container'>
                    {
                      profile.posts && profile.posts.length > 0 ? (
                        profile.posts.map((post) =>(
                          <Card key={post.postId} className='view-post'>
                            <Card.Body>
                              <div onClick={() =>{
                                navigate('/view',{state:{postID:post.postId}})
                              }}>
                              <span className='view-post-title'>{post.post_title}</span>
                              </div>
                              <div>
                                <small style={{color:'white'}}>{post?.post_posted && (
                                  <ReactTimeAgo 
                                  date={new Date(post.post_posted)}
                                  locale="en-US"
                                  timeStyle="twitter"/>
                                )}</small>
                              </div>
                              <div>
                                <small style={{color:'white'}}>{post.topic_name}</small>
                              </div>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <>
                        <span> No posts yet</span>
                        </>
                      )
                    }
                  </div>

                  </div>
                </div>
              </Row>
              
          </Col>
          </Row>

        </Container>
      </Row>
      </div>
    </div>
  )
}

export default ViewProfile
