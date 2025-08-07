import { useEffect, useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

import {Container,Form,Row,Col,Card,Placeholder,Spinner} from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa6";

import ReactTimeAgo from 'react-time-ago'

import {API_ENDPOINT} from './Api';
import { useAuth } from './AuthContext';

import './TopicPosts.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';

axios.defaults.withCredentials = true;

function TopicPosts () {
    const user = useAuth();
    // for topics
    const [topics, setTopics] = useState([]);
    // for post
    const [post, setPost] = useState([]);
    const [topicNo, setTopicNo] = useState('');
    
    const [pageLoading, setPageLoading] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();
    //Check if user has session
    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }
     useEffect(() => {
        function simulateNetworkRequest() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
        }
        if (pageLoading) {
        simulateNetworkRequest().then(() => {
            setPageLoading(false);
        });
        }
    }, [pageLoading]);

    useEffect(() =>{
        getTopicPosts()
    },[topicNo])
    useEffect(() =>{
         getTopics()
         setTopicNo(topic_id);
    },[])
    useEffect(() => {
        if (user?.user_id) {
        }
    }, [user]);
    
    const getTopics = async () => {
            await axios.get(`${API_ENDPOINT}topic`,{withCredentials: true}).then(({data})=>{
            setTopics(data.result)
            // console.log(data.result)
        });
    }
    const location = useLocation();
    let topic_id = location.state.topicId;
  
    const getTopicPosts = async (e) => {
        const id = topicNo || topic_id
        await axios.get(`${API_ENDPOINT}post/topic/${id}`,{withCredentials: true}).then(({data})=>{
            setPost(data.result)
        })
    }
    const viewPost = (postID) => {
        navigate('/view', {state: {
            postID
        }});
    }
    
    const handleSelected = (e) =>{
        topic_id = e.target.value
        setTopicNo(topic_id)
    }
    
    return (
    <div style={{height:'100vh', overflow:'hidden'}}>
        {
        pageLoading ?
        <>
            <div className='d-flex justify-content-center align-items-center' style={{height:'100vh', width:'100vw', backgroundColor:'black'}}>
                <FaBell style={{color:'#ffac33', fontSize:'25px'}} />
            <h3 style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>Campus Bell </h3>
            <Spinner style={{marginLeft:'4px'}} animation="grow" variant="warning" />
            </div>
        </> 
        
        : <div>
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

            <Col lg={8} sm={12} xs={12} style={{height:'100vh', overflow:'scroll'}}>
            <div className='container'>
            <div>
                <Form.Select value={topicNo} onChange={handleSelected} className='topic' style={{marginBottom:'8px'}}>
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
            {
                post.length > 0 && (
                post.slice(0,10).map((post)=>(
                    <div key={post.postID}>
                    <Card className='post-card' onClick={()=>viewPost(post.postID)}>
                        <Card.Header>
                        <div className='d-flex flex-row w-100'>
                        <div style ={{fontSize:'12px'}}>
                            <div className='d-flex align-items-center h-100'>
                                <FaUser  />
                                <span style ={{marginLeft:'4px'}}> {post.username}  
                                </span>
                            </div>
                        </div>
                        <div style ={{fontSize:'12px', marginLeft:'4px', width:'100%'}}>
                            <div className='d-flex align-items-center h-100 w-100'>
                                <CiClock2 />
                                <div style={{display:'flex',flexDirection:'row',width:'100%'}}>
                                <span style ={{marginLeft:'4px'}}> {post?.date_posted && (<ReactTimeAgo
                                        date={new Date(post.date_posted).toISOString()}
                                        locale="en-US"
                                        timeStyle="twitter"
                                        />)}</span>
                                </div>
                            </div> 
                        </div>
                        <div style={{display:'flex',width:'100%',justifyContent:'end'}}>
                            <IoIosMore />
                        </div>
                        </div>
                        <div style ={{fontSize:'12px', marginTop:'4px'}}>
                            {post.topic_name}
                        </div>
                        <div>
                        <span className='post-title'>{post.title}  </span><br />
                        </div>
                        
                        </Card.Header>

                        <Card.Body>
                        <div className='post-content'>
                            {(post.content).slice(0,500)}
                        </div>
                        <div>
                            { post.image && (
                                <div style={{marginTop:'20px'}}>
                                    <Card className='image-card' style={{display:'flex', justifyContent:'center',width:'100%',border:'1px solid white', backgroundColor:'black', marginTop:'0.5rem', borderRadius:'1.25rem'}}>
                                        <Card.Body style={{display:'flex', justifyContent:'center', padding:'0'}}>
                                        <Card.Img className='container post-image' src={post.image} />
                                        </Card.Body>
                                    </Card>
                                </div>
                                )}
                        </div>
                        <div style={{marginTop:'8px',fontSize:'12px',display:'flex', flexDirection:'row', width:'100%', justifyContent:'end', gap:'40px'}}>
                            <div className='d-flex' style={{gap:'8px'}}>
                            <span>Reacts</span>
                            {/* <span>0</span> */}
                            </div>
                            <div className='d-flex' style={{gap:'8px'}}>
                            <span>Comments</span>
                            <span>{post.commentCount}</span>
                            </div>
                        </div>
                        
                        </Card.Body>
                        <Card.Footer style={{overflowWrap:'normal'}}>
                            <div className='action-tabs gap-4'>
                            <div>
                            <div id='oval' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <AiOutlineLike />
                                <span style={{marginLeft:'4px'}}>React</span>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div id='oval' onClick={()=>viewPost(post.postID)} style={{color:'white', cursor:'pointer'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <FaRegComment />
                                <span style={{marginLeft:'4px'}}>Comments</span>
                                </div>
                            </div>
                            </div>
                            {/* <div>
                            <div id='oval' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <TbShare3 />
                                <span style={{marginLeft:'4px'}}>Share</span>
                                </div>
                            </div>
                            </div> */}
                            </div>
                        </Card.Footer>
                    </Card>
                    <hr/>
                    </div>
                ))
            )
        }
        <br />
                    <Card style={{backgroundColor:'black', color:'gray'}}>
                        <Card.Header>
                            <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                        </Card.Header>

                        <Card.Body>
                            <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                        </Card.Body>

                        <Card.Footer>
                            <div className='d-flex justify-content-start gap-4'>
                            <div>
                            <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <AiOutlineLike />
                                <span style={{marginLeft:'4px'}}>React</span>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <FaRegComment />
                                <span style={{marginLeft:'4px'}}>Comments</span>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <TbShare3 />
                                <span style={{marginLeft:'4px'}}>Share</span>
                                </div>
                            </div>
                            </div>
                            </div>
                        </Card.Footer>
                    </Card>
                    <br />
                    <hr/>
                    <Card style={{backgroundColor:'black', color:'white'}}>
                        <Card.Header>
                            <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                        </Card.Header>

                        <Card.Body>
                            <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                        </Card.Body>

                        <Card.Footer>
                            <div className='d-flex justify-content-start gap-4'>
                            <div>
                            <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <AiOutlineLike />
                                <span style={{marginLeft:'4px'}}>React</span>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <FaRegComment />
                                <span style={{marginLeft:'4px'}}>Comments</span>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div id='oval' className='d-flex justify-content-center align-items-center' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <TbShare3 />
                                <span style={{marginLeft:'4px'}}>Share</span>
                                </div>
                            </div>
                            </div>
                            </div>
                        </Card.Footer>
                    </Card>
                    <br />
            </div>
            </Col>

            <Col lg={2} className='d-none d-sm-block d-md-none'>
                 <div style={{width:'100%'}}>
                    <Card style={{backgroundColor:'black', width:'100%'}}>
                        <div className='d-flex flex-column '>
                        <span style={{fontWeight:'bold',color:'white'}}>New Post</span>
                        <div>
                        <div>
                        {
                        post.length > 0 && (
                        post.slice(0,10).map((post)=>(
                            <div key={post.postID}>
                            <div className='navLinkColor' style={{height:'100%',
                            display:'flex', 
                            flexDirection:'row', 
                            fontSize:'12px', 
                            marginBottom:'4px',
                            alignItems:'center',width:'100%',flexGrow:1}}>
                            <FaUserCircle style={{color:'white',fontSize:'12px',}}/>
                            <div onClick={()=>viewPost(post.postID)} style={{color:'white', marginLeft:'4px',width:'100%', cursor:'pointer'}}>
                            <span>{(post.title).slice(0,50)}</span>
                            </div>
                            </div>
                            </div>))
                            )
                        } 
                        </div>
                        <br />
                        </div>
                        </div>
                    </Card>
                    <br />
                        <Card style={{backgroundColor:'black'}}>
                        <span style={{fontWeight:'bold',color:'gray'}}>Community Discussion</span>
                        <div>
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <Placeholder className="w-100" /> <br />
                        <br />
                        </div>
                    </Card>
                </div>
            </Col>
            </Row>
        </Container>
    </Row>
        </div> 
        }
    </div>
    )
}

export default TopicPosts
