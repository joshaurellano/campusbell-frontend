import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Container,Button,Form,Row,Col,Card} from 'react-bootstrap';

import {API_ENDPOINT} from './Api';

import './Home.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'
axios.defaults.withCredentials = true;

function freedomwall() {
 // const for user fetching
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    const [notes, setNotes] = useState('');
    const [noteBody, setNoteBody] = useState('');

    const [showSidebar, setShowSidebar] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

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
            body:noteBody
        }
        try{
        await axios.post(`${API_ENDPOINT}freedomwall/`,payload,{withCredentials: true})
        } catch(error){
            console.error(error)
        }
        setNoteBody('')
        fetchNotes();
    }
    return(
        <div>
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

            <Col lg={10} sm={12} xs={12}>
                <div className='container'>
                    <div>
                        <span style={{display:'flex', justifyContent:'center',fontSize:'2rem', color:'white', fontWeight:'bold'}}>FREEDOM WALL</span>
                    </div>
                    <div>
                        <Card style={{height:'100%'}}>
                            <Card.Body>
                                <Row style={{height:'100%'}}>
                                    <Col lg={3} style={{borderRight:'gray 1px solid', height:'100%'}}>
                                        <span>
                                            A place to tell your untold feelings
                                        </span>
                                    </Col>
                                    <Col lg={9}>
                                        <span>
                                            Notes
                                        </span>
                                        
                                        <div>
                                            {
                                                notes && notes.length > 0 ? (
                                                    notes.map(data => (
                                                        
                                                            <Card key={data.id} style={{marginBottom: '8px'}}>
                                                                <Card.Body>
                                                                    <div>
                                                                    {data.username}
                                                                    </div>
                                                                    
                                                                    <div>
                                                                    {data.body}
                                                                    </div>
                                                                </Card.Body>
                                                            </Card>
                                                      
                                                    ))
                                                ) : (
                                                    <>
                                                    <span>
                                                        No notes yet
                                                    </span>
                                                    </>
                                                )
                                                
                                            }
                                        </div>
                                    
                                    </Col>
                                </Row>

                            </Card.Body>
                            <Card.Footer>
                                <Form onSubmit={notePost}>
                                    <Form.Group style={{marginBottom:'1rem'}}>
                                        <Form.Control style={{minHeight:'5rem'}} 
                                        value={noteBody}
                                        onChange={(e) =>setNoteBody(e.target.value)}>

                                        </Form.Control>
                                        
                                    </Form.Group>
                                   
                                    <Form.Group>                                        
                                        <Button type='submit'>Post Note</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
            </Col>

           
            </Row>
        </Container>
    </Row>
        </div>
    )
}
export default freedomwall