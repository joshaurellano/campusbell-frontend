import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Container, Figure, Button, Badge } from 'react-bootstrap';

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
      <Row>
        <TopNavbar />
      </Row>

      <Row style={{paddingTop:'68px', backgroundColor:'black', height:'100%', width:'100%'}}>
        <Container fluid>
          <Row>
          <Col lg={2} className='topic-col' >
            <Sidebar showSidebar={showSidebar} 
                handleCloseSidebar={() => setShowSidebar(false)}/>
          </Col>

          <Col lg={10} sm={12} xs={12} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden', padding:0}}>
              <Row style={{height:'35%', width:'100%'}}>
                <Container className='p-0' fluid style={{position:'relative'}}>
                <div className='container' style={{
                    backgroundImage: "url('https://res.cloudinary.com/dv7ai6yrb/image/upload/v1753324185/pexels-pixabay-289737_gmm8ey.jpg')" ,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height:'100%',
                    width: "100%",
                    marginLeft: '8px'
                    }}>


                
                <div style={{
                  position: 'absolute',
                  zIndex: 2,
                  bottom: '-150px',
                  left: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '10px 20px',
                  width:'100%'
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
              
          </Col>
          </Row>

        </Container>
      </Row>
    </div>
  )
}

export default ViewProfile
