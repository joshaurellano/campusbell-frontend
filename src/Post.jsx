import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

import {Container,Form,Row,Col,Card,Spinner,Image} from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
//import { TbShare3 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { TbPointFilled } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdAddModerator } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";

import ReactTimeAgo from 'react-time-ago'

import {API_ENDPOINT} from './Api';
import { useAuth } from './AuthContext';

import './Post.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'

axios.defaults.withCredentials = true;

function Post () {
    const user = useAuth();
    const [post, setPost] = useState([]);
    const [commentBody, setCommentBody] = useState('');
    const [pageLoading, setPageLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

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

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }

    useEffect(() => {
        if (user?.user_id) {
            getPost();
        }
    }, [user]);
  
    const location = useLocation();
    const post_id = location.state.postID;
    
    const getPost = async () => {
        const id = post_id;
        await axios.get(`${API_ENDPOINT}post/${id}`,{withCredentials: true}).then(({data})=>{
            // console.log(data.result[0])
            setPost(data.result[0])
            
        })
    }
    const addComment = async (e) => {
            setCommentLoading(true)
            e.preventDefault();
            const user_id = user.user_id;
            const id = post_id;

            const payload = {
                user_id, post_id: id, body: commentBody
            }
            await axios.post(`${API_ENDPOINT}comment`,payload,{withCredentials: true})

            setCommentLoading(false)
            setCommentBody('');
            getPost();
        }
         const handleReact = async (postID, userID) => {
                const payload = {
                    post_id:postID,
                    user_id:userID
                }
                // console.log(payload)
                await axios.post(`${API_ENDPOINT}react`,payload,{withCredentials:true})
                getPost();
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

                    <Col lg={8} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden'}}>
                <div className='container'>
                <br />
                {
                    post ? (
                        <div>
                        <Card className='post-card' style={{backgroundColor:'black', color:'white'}}>
                            <Card.Header>
                                <div>
                                <Row>
                                    <Col lg={1} sm={2} xs={2} className='d-flex justify-content-center align-items-center'>
                                        <Image 
                                            roundedCircle
                                            src={post.profile_image}
                                            
                                            className='post-profile-pfp'
                                        />
                                    </Col>

                                    <Col lg={11} sm={10} xs={10}>
                                        
                                            <div className='d-flex align-items-center gap-2'>
                                                <span className='card-header-name'>{post.first_name} {post.last_name}</span>
                                                {
                                                    post.role_id === 1 ? (
                                                        <MdAdminPanelSettings />
                                                    ) : post.role_id === 2 ? (
                                                        <MdAddModerator />
                                                    ) : post.role_id === 3 &&(
                                                        <FaUsers />
                                                    )
                                                }
                                            </div>
                                            
                                            <div>
                                                {
                                                    post.role_id === 1 ?(
                                                        <span className='card-header-username' style={{color: 'red'}}>{post.username}</span>
                                                    ) : post.role_id === 2 ?(
                                                        <span className='card-header-username' style={{color: 'yellow'}}>{post.username}</span>
                                                    ) : post.role_id === 3 &&(
                                                        <span className='card-header-username' style={{color: 'green'}}>{post.username}</span>
                                                    )
                                                }
                                                
                                            </div>
                                        
                                    
                                    </Col>
                                </Row>

                                <Row>
                                    <div>
                                    <span style={{fontWeight:'bold', fontSize:'1.9rem'}}>{post.title}</span>
                                    </div>

                                    <div className='card-header-topic d-flex flex-row align-items-center'>
                                        <TbPointFilled />
                                        <span><small>{post.topic_name}</small></span>
                                    </div>
                                </Row>
                            </div>
                            </Card.Header>

                            <Card.Body>
                            <div className='post-content'>
                                {post.content}
                            </div>
                            <div style={{marginTop:'20px',fontSize:'12px',display:'flex', flexDirection:'row', width:'100%', justifyContent:'end', gap:'40px'}}>
                                <div className='d-flex' style={{gap:'8px'}}>
                                <span>Reacts</span>
                                </div>
                                <div className='d-flex' style={{gap:'8px'}}>
                                <span>Comments</span>
                                <span>{post.commentCount}</span>
                                </div>
                            </div>

                            <div className='card-header-date d-flex flex-row align-items-center gap-1'>
                                <AiFillClockCircle />
                                <small>
                                    {new Date (post.date_posted).toLocaleString()}
                                </small>
                            </div>

                            { post.image && (
                            <div style={{marginTop:'20px'}}>
                                <Card className='image-card' style={{display:'flex', justifyContent:'center',width:'100%',border:'1px solid white', backgroundColor:'black', marginTop:'0.5rem', borderRadius:'1.25rem'}}>
                                    <Card.Body style={{display:'flex', justifyContent:'center', padding:'0'}}>
                                    <Card.Img className='container post-image' src={post.image} />
                                    </Card.Body>
                                </Card>
                            </div>
                            )}

                            </Card.Body>
                                <Card.Footer style={{overflowWrap:'normal'}}>
                                    <div className='action-tabs gap-4'>
                                    <div>
                                    { post.reacted === true ? (
                                        post.reacted &&
                                    <div className='like-button' id='oval' onClick={()=>handleReact(post.postID, user.user_id)}>
                                        <div className='d-flex h-100 align-items-center'>
                                            <AiFillLike   />
                                            <span style={{marginLeft:'4px'}}>React</span>
                                        </div>
                                    </div>) : (
                                        <>
                                            <div id='oval' onClick={()=>handleReact(post.postID, user.user_id)} style={{color:'white'}}>
                                        <div className='d-flex h-100 align-items-center'>
                                            <AiOutlineLike />
                                            <span style={{marginLeft:'4px'}}>React</span>
                                        </div>
                                    </div>
                                        </>
                                    )
                                    }
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

                        <Card style={{backgroundColor:'black'}}>
                            <Card.Body style={{width:'100%'}}>
                                <Form style={{width:'100%', backgroundColor:'white', borderRadius:'15px'}}onSubmit={addComment}>
                                    
                                            <div className='comment-box-wrapper'>
                                                <Form.Control className='comment-box'
                                                as='textarea'
                                                placeholder='Write Comment'
                                                value={commentBody}
                                                onChange={(e)=> setCommentBody(e.target.value)} required />                                                    
                                            </div>

                                    
                                        <div className='comment-button'>
                                                <button type='submit' style={{border:'none', backgroundColor:'transparent'}}>
                                                {
                                                    commentLoading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IoSendSharp /> 
                                                        </>)
                                                }
                                                </button>
                                            </div>
                                    
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card style={{backgroundColor:'black',color:'white'}}>
                                <Card.Header>
                                    <div className='comment-box-label'>
                                        <span>Comments {post.commentCount}</span>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <div>
                                    {
                                    post.comments ? (
                                    post.comments && Object.values(post.comments).map(data=>(
                                        <div key={data.commentID} style={{marginBottom:'8px'}}>
                                            <div className='d-flex h-100 w-100 flex-row align-items-center'>
                                                <div className='d-flex h-100 align-items-center'>
                                                <FaUser className='comment-user-logo' />
                                                <span className='comment-user'>{data.username} </span> 
                                                </div>
                                                <span className='comment-user-date'> 
                                                    {data?.date_posted && (<ReactTimeAgo
                                                    date={new Date(data.date_posted)}
                                                    locale="en-US"
                                                    timeStyle="twitter"/>)}
                                                </span>
                                            </div>
                                            <div className='comment-body'>
                                                {data.body}
                                            </div>
                                            <hr/>
                                        </div>
                                        
                                    ))
                                ) : (
                                    <>
                                        <span className='no-comment-msg'>No comments available yet</span>
                                    </>
                                )
                            }
                            
                            </div>
                            </div>
                            
                                </Card.Body>
                            </Card>
                        
                        </div>
                ) : (
                    <>No Data Available</>
                )
            }
            <br />
                </div>
                    </Col>

                    <Col lg={2}>
                    </Col>
                </Row>
                </Container> 
        </Row>
        </div>
        }
    </div>
    )
}

export default Post
