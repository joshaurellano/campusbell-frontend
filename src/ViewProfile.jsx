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
    const viewed_user_id = location.state.userId;
    const user_id = location.state.user_id;

    const viewUser = async () => {
        const id =  viewed_user_id;
        try {
            await axios.get(`${API_ENDPOINT}user/view/${id}`,{withCredentials:true}).then(({data})=>{
              setProfile(data.result)
              if(data.result.friendRequest === 'rejected') {
                setRejected(true);
              }
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
    const toggleSidebar = () => {
        setShowSidebar(showSidebar => !showSidebar)
    }
    const rejectedTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Please wait 48 hrs to be able to send a friend request again
    </Tooltip>
  );
    useEffect(() => {
        viewUser()
    },[viewed_user_id])

return (
    <div style={{height:'100vh', overflow:'hidden'}}>
      <div>
      <Row>
        <TopNavbar handleToggleSidebar={toggleSidebar}/>
      </Row>

      <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
        <Container fluid>
          <Row>
          <Col lg={2} className='topic-col'>
            <Sidebar showSidebar={showSidebar} 
                handleCloseSidebar={() => setShowSidebar(false)}/>
          </Col>

          <Col lg={10} sm={12} xs={12} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden'}}>
                <Row className='header-row'style={{height:'350px', width:'100%',paddingLeft:'20px'}}>
                  <Container className='p-0' fluid style={{position:'relative'}}>
                  <div className='cover-image'>
                  <div
                  className='view-header'>
                    <Row className='w-100' style={{position:'relative', left:'10px'}}>

                    <Col lg={2} sm={6} xs={6}>
                    <div className='d-flex align-items-center'>
                    <Figure className='m-0'>
                    <Figure.Image
                    className='view-pfp-image'
                    roundedCircle
                    fluid 
                    width={150}
                    height={150}
                    alt="profile image"
                    src={profile.profile_image} 
                    style={{border:'2px solid black'}}
                    />
                  </Figure>
                  </div>
                  </Col>

                  <Col sm={6} xs={6} className='mobile-col' style={{position:'relative', padding:0}}>
                    <div className='d-flex justify-content-end align-items-center h-100'>
                      {
                      (user_id !== viewed_user_id) && profile.friend ? (
                        <div>
                          <Button className='friend-btn-component' variant="outline-light" style={{pointerEvents:'none'}}>Friends</Button>
                        </div>
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === null) ? (
                        <div>
                          <div>
                            <Button className='friend-btn-component'
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
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === 'pending reply') ? (
                        <div className='d-flex flex-row' style={{gap:'10px'}}>
                        <div>
                          <Button className='friend-btn-component' variant='success' onClick={() => handleAcceptFriendRequest(profile.user_id)}>
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
                          <Button className='friend-btn-component' variant='secondary' onClick={() => handleRejectFriendRequest(profile.user_id)}>Ignore</Button>
                          </div>
                        </div>
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === 'pending') ? (
                        <div>
                          <Button className='friend-btn-component' variant='outline-primary' style={{pointerEvents:'none'}}>Friend Request Sent</Button>
                        </div>
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === 'rejected') && (
                        <div>
                          <OverlayTrigger overlay={rejectedTooltip}
                            placement="left"
                            delay={{ show: 250, hide: 400 }}
                            >
                          <span className="d-inline-block">
                            <Button className='friend-btn-component' variant='outline-primary' disabled style={{ pointerEvents: 'none' }}>
                              Add as a Friend
                            </Button>
                          </span>
                          </OverlayTrigger>
                        </div>
                      ) 
                    }
                    </div>
                  </Col>
  
                  
                    <Col lg={7} sm={12} xs={12} className='view-header-main'>
                    <div className='d-flex flex-column' style={{width:'100%'}}>
                      <div className='d-flex flex-row align-items-center' style={{gap:'10px', marginBottom:'4px'}}>
                        <div>
                          <h2 className='view-header-name'>{profile.first_name} {profile.last_name}</h2>
                        </div>
                      
                      <div className='role-badge'>
                      {
                        profile.role_id === 1 ? (
                          <div className='d-flex align-items-center'>
                            <Badge pill bg='danger'>{profile.role}</Badge>
                            </div>
                        ) : profile.role_id === 2 ? (
                          <div className='d-flex align-items-center'>
                            <Badge pill bg='warning'>{profile.role}</Badge>
                          </div>
                        ) :profile.role_id === 3 && (
                          <div className='d-flex align-items-center'>
                            <Badge pill bg='success'>{profile.role}</Badge>
                          </div>
                        )
                      }
                      </div>
                      </div>
                      <span className='view-header-username' style={{color:'white'}}>{profile.username}</span>
                    
                    </div>
                    </Col>
                    
                    <Col lg={3} className='view-header-button'>
                    <div>
                    {
                      (user_id !== viewed_user_id) && (profile.friend) ? (
                        <div>
                          <Button variant="outline-light" style={{pointerEvents:'none'}}>Friends</Button>
                        </div>
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === null) ? (
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
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === 'pending reply') ? (
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
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === 'pending') ? (
                        <div>
                          <Button variant='outline-primary' style={{pointerEvents:'none'}}>Friend Request Sent</Button>
                        </div>
                      ) : (user_id !== viewed_user_id) && (!profile.friend && profile.friendRequest === 'rejected') && (
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
                    </Col>
                    
                    </Row>
                    </div>
          
                    </div>
                  </Container>
                
                </Row>
              
              <Row className='content-row' style={{marginTop:'24px'}}>
                <div>
                  <div className='view-section-title'>
                    <FaBookOpen />
                    <span>Bio</span>
                  </div>
                  <div>
                  
                  <div className='container'>
                    <Card style={{width:'100%', height:'100px', backgroundColor:'#1a1a1a'}}>
                      <Card.Body></Card.Body>
                    </Card>
                  </div>

                  <div>
                    <div className='view-section-title'>
                    <FaNoteSticky />
                    <span>Posts</span>
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
                              <div className='view-post-datetime'>
                                <small style={{color:'white'}}>{post?.post_posted && (
                                  <ReactTimeAgo 
                                  date={new Date(post.post_posted)}
                                  locale="en-US"
                                  timeStyle="twitter"/>
                                )}</small>
                              </div>
                              <div className='view-post-topic'>
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
