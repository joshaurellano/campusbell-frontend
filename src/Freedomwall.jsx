import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Container,Button,Form,Row,Col,Card,Image} from 'react-bootstrap';

import {API_ENDPOINT} from './Api';

import './Freedomwall.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';

import ReactTimeAgo from 'react-time-ago';

axios.defaults.withCredentials = true;

function freedomwall() {
 // const for user fetching
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState('');
    const [noteBody, setNoteBody] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }

    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            try {
                const userInfo = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                    setUser(data.result);
                })
            } catch(error) {
                //go back to login in case if error
                navigate ('/login');
            }
        };
        checkUserSession();
    }, []);

    
    useEffect(() =>{
        fetchNotes();
    },[])

    const fetchNotes = async () => {
        await axios.get(`${API_ENDPOINT}freedomwall/`,{withCredentials: true}).then(({data})=>{
            setNotes(data.result)
        })
    }
    const notePost = async (e) => {
        e.preventDefault();
        const userId = user.user_id;

        const payload = {
            user_id:userId,
            body:noteBody,
            anonymous
        }
        try{
        await axios.post(`${API_ENDPOINT}freedomwall/`,payload,{withCredentials: true})
        } catch(error){
            console.error(error)
        }
        setNoteBody('');
        setAnonymous(false);
        fetchNotes();
    }

    return(
        <div style={{overflow:'hidden'}}>
            <Row>
                <TopNavbar handleToggleSidebar={toggleSidebar}/>
            </Row>

            <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
        <Container fluid >
            <Row>
            <Col lg={2} className='topic-col'>
               <Sidebar showSidebar={showSidebar} 
                handleCloseSidebar={() => setShowSidebar(false)}/>
            </Col>

            <Col lg={10} sm={12} xs={12} className='wall-main-col'>
                <Container className='wall-main-content-container'>
                    <Row>
                        <div className='wall-main-content-container-row-1-div-1'>
                            <span>FREEDOM WALL</span>
                        </div>
                    </Row>

                    <Row className='wall-main-content-container-row-2'>
                        <Col lg={{order: 1}} sm={{order: 2}} xs={{order: 2}} className='wall-main-content-container-row-2-col-1'>
                            <div>
                                <span style={{fontWeight:500}}>A place for your untold feelings</span>
                            </div>
                            <hr />
                            <div>
                                <span>Here are some rules fo you to be guided</span>
                            </div>
                            <ul>
                                <li>Be Respectful</li>
                                <li>No harmful content</li>
                                <li>Use anonymity responsibly</li>
                            </ul>
                            <div>
                                <span>Be reponsible on what you post. Admins reserve the rights to delete post or ban users who violate rules</span>
                            </div>
                        </Col>

                        <Col className='wall-main-content-container-row-2-col-2' lg={9} sm={{order: 1}} xs={{order: 1}}>
                            <Container fluid style={{height:'100%', width:'100%'}}>
                                <div className='wall-main-content-container-row-2-col-2-cont-div-1'>
                                    {
                                        notes ? (
                                        notes && notes.map((data) => (
                                            <div key={data.id} style={{color:'white'}}>
                                            <Card style={{marginBottom:'8px', border:'none', backgroundColor:'black', color:'white'}}>
                                                <Card.Body>
                                                    <div>
                                                        {
                                                            data.anonymous ? (
                                                                <div className='d-flex flex-row align-items-center gap-2'>
                                                                    <Image 
                                                                        roundedCircle
                                                                        height={15}
                                                                        width={15}
                                                                        src={data.anonymous_pfp}
                                                                        style={{backgroundColor:'white'}}
                                                                />
                                                                    <span style={{fontWeight:500, color:'#696969'}}>Anonymous</span>
                                                                    <span><small style={{color:'gray'}}>{ data?.created_at && (
                                                                        <ReactTimeAgo 
                                                                            date={new Date(data.created_at).toISOString()}
                                                                            locale="en-US"
                                                                            timeStyle="twitter"/>)} </small>
                                                                    </span>
                                                                    
                                                                </div>

                                                            ) : (
                                                                <div className='d-flex flex-row align-items-center gap-2'>
                                                                    <Image 
                                                                        roundedCircle
                                                                        src={data.profile_image}
                                                                        height={15}
                                                                        width={15}
                                                                    />
                                                                    {
                                                                        data.role_id === 1 ? (
                                                                            <span style={{fontWeight: 500, color:'red'}}>{data.username}</span>
                                                                        ) : data.role_id === 2 ? (
                                                                            <span style={{fontWeight: 500, color:'yellow'}}>{data.username}</span>
                                                                        ) : data.role_id === 3 && (
                                                                            <span style={{fontWeight: 500, color:'green'}}>{data.username}</span>
                                                                        )
                                                                    }
                                                                    
                                                                    <span><small style={{color:'gray'}}>{ data?.created_at && (
                                                                        <ReactTimeAgo 
                                                                            date={new Date(data.created_at).toISOString()}
                                                                            locale="en-US"
                                                                            timeStyle="twitter"/>)} </small>
                                                                    </span>
                                                                </div>
                                                            )
                                                        } 
                                                        
                                                    </div>
                                                    <div>
                                                        {data.body}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            <hr />
                                            </div>

                                        ))
                                            
                                        ):(
                                            <>
                                                <span>No notes yet</span>
                                            </>
                                        )
                                    }   
                                </div>
                                <hr />
                                <div className='wall-main-content-container-row-2-col-2-cont-div-2'>
                                    <Form className='w-100' onSubmit={notePost}>
                                        <Form.Group style={{marginBottom:'4px'}}>
                                            <Form.Control 
                                                className='wall-main-content-container-row-2-col-2-cont-div-2-frm-ctrl'
                                                value={noteBody}
                                                onChange={(e) => setNoteBody(e.target.value)}
                                                placeholder='Spill the tea?'
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Check 
                                                className='wall-main-content-container-row-2-col-2-cont-div-2-frm-chk'
                                                type='switch'
                                                label='Anonymous Post'
                                                checked={anonymous}
                                                onChange={() => setAnonymous((prev) => !prev)}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group>
                                            <Button className='wall-button' type='submit'>Share</Button>
                                        </Form.Group>
                                        
                                    </Form>
                                </div>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Col>

           
            </Row>
        </Container>
    </Row>
        </div>
    )
}
export default freedomwall