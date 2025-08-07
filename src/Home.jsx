import { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Container,Row,Col,Card,Placeholder,Spinner,Alert,Image} from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
//import { TbShare3 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { TbPointFilled } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdAddModerator } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

// import ReactTimeAgo from 'react-time-ago'
import { useAuth } from './AuthContext';
import {API_ENDPOINT} from './Api';

import './Home.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'

axios.defaults.withCredentials = true;

function Home () {
    const listInnerRef = useRef();
    const user = useAuth();
    const navigate = useNavigate();
    
    const [post, setPost] = useState([]);

    const [newPostLoad, setNewPostLoad] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [shownSkeleton, setShownSkeleton] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

    const [alert, setAlert] = useState(true);
    const [nextId, setNextId] = useState('');
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const toggleSidebar = () => {
        //console.log(showSidebar)
        setShowSidebar(showSidebar => !showSidebar)
    }

    const closeAlert = () => {
        setAlert(false)
        sessionStorage.setItem('displayed', 'true')
    }
    useEffect(() =>{
        const displayed = sessionStorage.getItem('displayed')
        if(displayed === 'true') {
            setAlert(false)
        }
    },[])
     
    const getPosts = async () => {
        if(newPostLoad) return;
        const limit = 10;
        const lastId = nextId?nextId : 0
        
        setPostLoading(true)
        
        if(page !== 1){
            setNewPostLoad(true)
        }
            try{
            await axios.get(`${API_ENDPOINT}post?page=${page}&lastId=${lastId}&limit=${limit}`,{withCredentials: true}).then(({data})=>{
                setShownSkeleton(true)
                setPostLoading(false)
                
                if(page === 1){
                    setPost(data.result)
                } else {
                    setPost((prev) => [...prev, ...data.result])
                }
                setNextId(data.nextID)
                setHasMore(data.more_items)
            })
        } catch(error){
            setHasMore(error.response.data.more_items)
        } finally{
            setNewPostLoad(false)
        }

    }
    const viewPost = (postID) => {
        navigate('/view', {state: {postID}});
    }
  
    const handleReact = async (postID, userID) => {
        const payload = {
            post_id:postID,
            user_id:userID
        }
        await axios.post(`${API_ENDPOINT}react`,payload,{withCredentials:true})
        getPosts();
    }

    const onScroll = () => {
        if(listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

            if(scrollTop + clientHeight >= scrollHeight) {
                setPage(prevPage => prevPage + 1)
            }
        }
        
    }
    useEffect (() => {
        window.addEventListener('scroll',onScroll);

        return () => window.removeEventListener('scroll',onScroll)
    }, [])

    useEffect(() => {
        if (user?.user_id) {
            setPage(1)
        }
    }, [user]);
    
    useEffect(() => {
        getPosts()
    },[page])

    const noOfCards = Array.from({length:3})

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
    <Row>{ alert ? (
            <div>
                <Alert variant="warning" onClose={() => closeAlert()} dismissible>
                <p>
                    Currently open to gmail users for testing purposes. 
                </p>
            </Alert>
            </div>
    ):( <>
    <TopNavbar handleToggleSidebar={toggleSidebar}/>

    </>)}
    </Row>

    <Row style={{paddingTop:'68px', backgroundColor:'black'}}>
        <Container fluid >
            <Row>
            <Col lg={2} className='topic-col'>
                <Sidebar showSidebar={showSidebar} 
                handleCloseSidebar={() => setShowSidebar(false)}/>
                </Col>

            <Col lg={8} sm={12} xs={12} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden'}} onScroll={onScroll}
        ref={listInnerRef}> 
            <div className='container'> 
            { (postLoading && !shownSkeleton) ? (
                <div>{
                noOfCards.map((card,index) =>
                <div key={index}>
                <Card className='post-card'>
                    <Card.Header>
                        <Placeholder style={{ width: '25%' }} size="xs" bg="light" />
                            <br/>
                        <Placeholder xs={2} size="xs" bg="light" />
                            <br/>
                        <Placeholder xs={12} size="lg" bg="light" />
                    </Card.Header>
                    <Card.Body>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} bg="light" />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} bg="light" />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                    </Card.Body>
                    <Card.Footer style={{overflowWrap:'normal', zIndex:0}}>
                         <div className='action-tabs gap-4'>
                            <div>
                            <div id='oval'>
                                 <Placeholder style={{ width: '70%' }} bg="light" />
                            </div>                            
                            
                            </div>

                            <div>
                            <div id='oval'>
                                 <Placeholder style={{ width: '70%' }} bg="light" />
                            </div>
                            </div>
                            <div>
                            <div id='oval' >
                                 <Placeholder style={{ width: '75%' }} bg="light" />
                            </div>
                            </div>
                        </div>
                        
                    </Card.Footer>
                </Card>
                <hr />
                <br />
                
            </div>)}
            </div>) : (
                <div>
                {
                post.length > 0 && (
                post.map((post)=>(
                    <div key={`main-${post.postID}`}>
                    <Card className='post-card'>
                        <Card.Header className='post-card-header'>
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

                        <Card.Body className='pt-0' onClick={()=>viewPost(post.postID)}>
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
                            <span>{post.reactCount}</span>
                            </div>
                            <div className='d-flex' style={{gap:'8px'}}>
                            <span>Comments</span>
                            <span>{post.commentCount}</span>
                            </div>
                        </div>

                         <div className='card-header-date d-flex flex-row align-items-center gap-1'>
                            <AiFillClockCircle />
                            <small>
                                {/* {post?.date_posted && (
                                <ReactTimeAgo 
                                    date={new Date(post.date_posted)} 
                                    locale="en-US" timeStyle="twitter"
                                />)} */}
                                {new Date (post.date_posted).toLocaleString()}
                                </small>
                        </div>
                        
                        </Card.Body>
                        <Card.Footer style={{overflowWrap:'normal', zIndex:0}}>
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
                            <div>
                            {/* <div id='oval' style={{color:'white'}}>
                                <div className='d-flex h-100 align-items-center'>
                                <TbShare3 />
                                <span style={{marginLeft:'4px'}}>Share</span>
                                </div>
                            </div> */}
                            </div>
                            </div>
                        </Card.Footer>
                    </Card>
                    <hr/>
                         
                    </div>
                ))
                )
            }</div>)}
        
            {
                newPostLoad &&(
                    <div className='h-100 w-100 d-flex justify-content-center'>
                        <Spinner variant='light' animation="border" />
                        <br />
                    </div>
                    
                ) 
            }
        <br />       
            </div>
            {
                !hasMore && (
                    <div className='h-100 w-100 d-flex justify-content-center text-white'>
                        <span> - - End of posts - - </span>
                    </div>
                )
            }
            </Col>

            <Col lg={2} className='d-none d-sm-block' style={{height:'100vh', overflow:'scroll'}}>
                 <div style={{width:'100%'}}>
                    <Card style={{backgroundColor:'black', width:'100%'}}>
                        <div className='d-flex flex-column '>
                        <span style={{fontWeight:'bold',color:'white'}}>New Post</span>
                        <div>
                        <div>
                        {
                        post.length > 0 && (
                        post.slice(0,10).map((post)=>(
                            <div key={`side-${post.postID}`}>
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

export default Home
