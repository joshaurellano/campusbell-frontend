import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Container,Button,Form,Row,Col,Card} from 'react-bootstrap';

import {API_ENDPOINT} from './Api';

import './Freedomwall.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'
axios.defaults.withCredentials = true;

function freedomwall() {
 // const for user fetching
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
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

   useEffect(() => {
        if (user?.user_id) {
            fetchUserData();
        }
    },[user]);

    const fetchUserData = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}user/${id}`,{withCredentials: true}).then(({data})=>{
            setUserData(data.result[0])
        })
    }
        
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
                <Container style={{height:'100%', width:'100%', overflow:'auto'}}>
                    <Row>
                        <div style={{display:'flex', justifyContent:'center', width:'100%', color:'white', fontSize:'1.5rem', fontWeight:'bold'}}>
                            <span>FREEDOM WALL</span>
                        </div>
                    </Row>

                    <Row style={{backgroundColor:'white',height:'calc(100vh - 105px)',width:'100%', borderRadius:'5px'}}>
                        <Col lg={3} style={{borderRight:'2px solid gray'}}>
                            <div>
                                <span>A place for your untold feelings</span>
                            </div>
                        </Col>

                        <Col lg={9} style={{height:'100%',overflow:'hidden',padding:'8px'}}>
                            <Container fluid style={{height:'100%', width:'100%'}}>
                                <div style={{marginBottom:'16px', overflow:'auto', height:'calc(100vh - 285px)'}}>
                                    {
                                        notes ? (
                                        notes && notes.map((data) => (
                                            <Card key={data.id} style={{marginBottom:'8px'}}>
                                                <Card.Body>
                                                    <div>
                                                        {
                                                            data.anonymous ? (
                                                                <div><span>Anonymous</span></div>
                                                            ) : (
                                                                <>
                                                                <span>{data.username}</span>
                                                                </>
                                                            )
                                                        } 
                                                        
                                                    </div>
                                                    <div>
                                                        {data.body}
                                                    </div>
                                                </Card.Body>
                                            </Card>

                                        ))
                                            
                                        ):(
                                            <>
                                                <span>No notes yet</span>
                                            </>
                                        )
                                    }   
                                </div>
                                <hr />
                                <div className='d-flex align-items-end w-100'>
                                    <Form className='w-100' onSubmit={notePost}>
                                        <Form.Group style={{marginBottom:'4px'}}>
                                            <Form.Control 
                                                value={noteBody}
                                                onChange={(e) => setNoteBody(e.target.value)}
                                                style={{height:'70px'}}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Check 
                                                type='switch'
                                                label='Anonymous Post'
                                                checked={anonymous}
                                                onChange={() => setAnonymous((prev) => !prev)}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group>
                                            <Button type='submit'>Share</Button>
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