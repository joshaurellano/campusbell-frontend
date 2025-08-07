import { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Container,Button,Form,Row,Col,Card,Spinner} from 'react-bootstrap';

import {API_ENDPOINT} from './Api';
import { useAuth } from './AuthContext';

import './CreatePost.css';

import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';

axios.defaults.withCredentials = true;

function CreatePost () {
    const user = useAuth();
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedTopic, setSelectedTopic] = useState([]);
    const [postImg, setPostImg] = useState();
    const [prev, setPrev] = useState();
    const [postButtonLoading, setpostButtonLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();
    //Check if user has session
    useEffect(() => {
        if (user?.user_id) {
            getTopics();
        }
    }, [user]);

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }
    
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        })
    }

    const sample = (event) => {
        // setSelectedTopic(event.target.value);
        const selectedId = parseInt(event.target.value);
        const topic = topics.find(t => t.topic_id === selectedId);
        setSelectedTopic(topic);
    }
  
    const addPost = async (e) => {
        setpostButtonLoading(true)

        e.preventDefault();
        const user_id = user.user_id;
        const topic_id = selectedTopic.topic_id;
        
        try{
        let imageUrl = null;
            if(postImg)
                {const formData = new FormData();
                formData.append('image', postImg);

                const response = await axios.post(`${API_ENDPOINT}upload/images`,formData, {withCredentials: true, headers: {
                        'Content-Type': 'multipart/form-data',
                    },})
                console.log('Upload successful:');
            
            console.log(response.data.data.url);
            imageUrl = response.data.data.url;}
            // console.log(imageUrl)
            const payload = {
            title,
            body, 
            user_id, 
            topic_id,
            image:imageUrl||null
        }
         await axios.post(`${API_ENDPOINT}post`,payload,{withCredentials: true})
           navigate('/');
            
        } catch(error){
            console.log(error)}
            setpostButtonLoading(false)
    }
        const fileInputRef = useRef();
        function getPostImage(event) {
            const file = event.target.files[0];
            setPostImg(file);
            setPrev(URL.createObjectURL(file));
            
        }
       
        function removeImg(){
            URL.revokeObjectURL(postImg)
            setPostImg(null);
            setPrev(null);
            fileInputRef.current.value = "";
        }
const handleTopicPosts = (topicId) =>{
        navigate('/topic', {state: {
            topicId
        }})
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

                        <Col lg={8} style={{height:'calc(100vh - 68px)',overflowY:'auto', overflowX:'hidden'}}>
                            <div>
                                <div className='container' style={{color:'white'}}>
                                <div className='head-msg'>
                                    <h3 style={{fontWeight:'600'}}>Create Post</h3>
                                </div>
                                <Form onSubmit={addPost} id='addPost'>
                                <div style={{marginTop:'8px'}}>
                                    <Form.Select className='select-topic' onChange={sample}>
                                        <option style={{backgroundColor:'black'}}>--Select Topic--</option>
                                        {
                                        topics.length > 0 && (
                                            topics.map((t)=>(
                                                    <option style={{backgroundColor:'black'}} value={t.topic_id}key={t.topic_id}>   
                                                        {t.topic_name}
                                                    </option>
                                                ))
                                            )
                                        }
                                        </Form.Select>    
                                </div>
                                    <div style={{marginTop:'8px'}}> 
                                        <Form.Group>
                                            <Form.Label>
                                                Title
                                            </Form.Label>
                                                <Form.Control className='title-area' placeholder='Title'
                                                    value={title}
                                                    onChange={(e)=>setTitle(e.target.value)} required>
                                                        
                                                    </Form.Control>
                                            </Form.Group>
                                        <div style={{marginTop:'8px'}}>
                                            <Form.Group>
                                                <Form.Label>
                                                    Body
                                                </Form.Label>
                                                <Form.Control className='post-area' as="textarea" value={body}
                                                onChange={(e)=>setBody(e.target.value)} />                                                        
                                            </Form.Group>
                                            </div>

                                            <div style={{marginTop:'8px'}}>
                                                <Form.Group>
                                                    <Button className='post-button' type='submit' variant='success'>
                                                        {
                                                            postButtonLoading ?
                                                            <>
                                                            <Spinner animation="border" size="sm" /> Posting
                                                            </> : <>
                                                            Post
                                                            </>
                                                        }
                                                        </Button>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        
                                    </Form>
                            <div>
                                <Form onChange={getPostImage}>
                                    <div style={{marginTop:'8px'}}>
                                        <Form.Group controlId="formFileSm">
                                            <div className='form-wrapper'>
                                            <Form.Control type='file'ref={fileInputRef}></Form.Control>
                                                <Button className='rm-img-btn' onClick={removeImg}>
                                                    X
                                                </Button>
                                            </div>
                                        </Form.Group>
                                        
                                    </div>
                                </Form>
                            </div>

                            </div>
                            
                            {(title||body||prev) && (
                            <div>
                            <div style={{marginTop:'2rem',marginBottom:'2rem', color:'white'}}>
                                <span>Preview</span>
                            </div>

                            <div style={{marginTop:'8px'}}>
                            <Card style={{backgroundColor:'black', color:'white', border:'1px solid gray', borderRadius:'15px', minHeight:'250px'}}> 
                                <Card.Header>
                                        <div>
                                            <span style={{fontSize:'12px'}}>{selectedTopic.topic_name}</span>
                                        </div>
                                        <div>
                                        <span className='post-title'>{title}</span><br />
                                        </div>
                                </Card.Header>
                                <Card.Body>
                                <div className='container post-content'>
                                    {body}
                                </div>
                                <div className='container'>
                                {
                                    prev && (
                                    <Card className='image-card' style={{display:'flex', justifyContent:'center',width:'100%',border:'1px solid white', backgroundColor:'black', marginTop:'0.5rem', borderRadius:'1.25rem'}}>
                                    <Card.Body>
                                    <Card.Img className='container post-image' src={prev} />
                                    </Card.Body>
                                </Card>)}
                                </div>
                                </Card.Body>
                            </Card>
                            </div>
                            </div>
                            )}
                            </div>                               
                        </Col>
                    </Row>
                </Container>
                </Row>
                </div>
    )
}

export default CreatePost
