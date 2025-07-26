import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Container, Figure, Button, Badge, Card } from 'react-bootstrap';

import { FaBookOpen } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";

import {API_ENDPOINT} from './Api';

import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';

axios.defaults.withCredentials = true;

const ViewProfile = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [profile, setProfile] = useState([]);

    const location = useLocation();
    const user_id = location.state.userId;

    const viewUser = async () => {
        const id = user_id;
        try {
            await axios.get(`${API_ENDPOINT}user/view/${id}`,{withCredentials:true}).then(({data})=>{
              console.log(data.result)
              setProfile(data.result)
            })
        } catch (error) {
            console.error(error)
        }
    }

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
                    zIndex: 2,
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
                    <div>
                      <Button>Add as a friend</Button>
                    </div>
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
                    <span style={{color:'white', fontSize:'1.125rem'}}>About Me</span>
                  </div>
                  <div>
                  
                  <div className='container'>
                    <Card style={{width:'100%', height:'100px'}}>
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
                          <Card key={post.postId} style={{backgroundColor:'black', border:'1px solid white', marginBottom:'8px'}}>
                            <Card.Body>
                              <div>
                              <span style={{fontSize:'1.563rem', color:'white', fontWeight:'bold'}}>{post.post_title}</span>
                              </div>
                              <div>
                                <span style={{color:'white'}}>{post.topic_name}</span>
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
