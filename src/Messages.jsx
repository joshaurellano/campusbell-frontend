import { useState} from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'

import './Messages.css';


function Messages () {
// const for user fetching

const [showSidebar, setShowSidebar] = useState(false);

     const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }
    return (
        <div style={{height:'100vh', overflow:'hidden'}}>
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

                        <Col lg={10} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden'}}>
                            <div className='w-100 d-flex justify-content-center'>
                                <h3 className='text-white'>This page is still under development</h3>
                            </div>

                            <div className='w-100 d-flex justify-content-center'>
                                <span className='text-white'>More features are on the way! Stay tuned 😊</span>
                            </div>
                        </Col>

                    </Row>
                </Container>
                   
                </Row>
             
        </div>

    )
}

export default Messages
