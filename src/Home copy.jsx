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

import ReactTimeAgo from 'react-time-ago'

import {API_ENDPOINT} from './Api';

import './Home.css';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'

axios.defaults.withCredentials = true;

function Home () {
    const listInnerRef = useRef();
    // const for user fetching
    const [user, setUser] = useState(null);
    // for post
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
    const navigate = useNavigate();
    //Check if user has session
    useEffect(() =>{
        const checkUserSession = async () => {
            setPageLoading(true);
            try {
                const userInfo = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true}).then(({data})=>{
                    setUser(data.result);
                })
                // console.log(userInfo)
            setPageLoading(false);

            } catch(error) {
                //go back to login in case if error
                navigate ('/login');
            }
        };
        checkUserSession();
    }, []);
  
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
                        <div className='d-flex flex-row align-items-center' style={{gap:'8px'}}>
                        <div className='d-flex align-items-center h-100 w-100' style ={{fontSize:'16px'}}>
                            <Row className='header-row-1'style={{width:'100%'}}>
                                
                                <Col lg={1} sm={2} xs={2} className='card-header-col-1' style={{paddingRight:'0'}}>
                                <Image 
                                className='post-pfp-image'
                                    src={post.profile_image}
                                    roundedCircle
                                    height={40}
                                    width={40}
                                />
                                </Col>

                                <Col lg={11} sm={10} xs={10} className='card-header-col-2 d-flex flex-column' style={{paddingLeft:'0'}}>
                                <Row className='card-header-row1'>
                                <div className='d-flex flex-row' style={{gap:'10px'}}>
                                <Col className='card-header-name pe-0' lg={6} md={6} xs={6} sm={6}>
                                    <div style={{fontWeight:'500', fontSize:'16px'}}>
                                    <span>{post.first_name} {post.last_name}</span>
                                    </div>
                                    </Col>
                                    
                                <Col lg={6} md={6} xs={6} sm={6} className='card-header-username pe-0'>
                                    <div className='d-flex align-items-center h-100' style={{fontSize:'12px',color:'#ADADAD'}}>
                                        <TbPointFilled />
                                        <span>{post.username}</span>
                                    </div>
                                    </Col>
                                </div>

                                    <Col lg={12} md={12} sm={{order: 2, span: 12}} xs={{order: 2, span: 12}} className='card-header-topic'>
                                    {/* d-none d-lg-block d-md-block */}
                                    <div className='d-flex align-items-center h-100' style ={{fontSize:'12px',color:'#ADADAD'}}>
                                        <TbPointFilled />
                                        <span>{post.topic_name}</span>
                                    </div>
                                    </Col>

                                </Row>

                                <div className='card-header-row2 d-flex flex-row align-items-center h-100' style ={{fontSize:'12px',color:'#ADADAD', gap:'5px'}}>
                                    <div className='d-flex flex-row align-items-center'>
                                        
                                        <AiFillClockCircle />
                                        <span style ={{marginLeft:'4px'}}> {post?.date_posted && (<ReactTimeAgo
                                                date={new Date(post.date_posted).toISOString()}
                                                locale="en-US"
                                                timeStyle="twitter"
                                                />)}</span>
                                    </div>

                                    {/* <div>
                                        <Col className='d-block d-lg-none d-md-none'>
                                            <div className='d-flex align-items-center h-100' style ={{fontSize:'12px',color:'#ADADAD'}}>
                                                <TbPointFilled />
                                                <span>{post.topic_name}</span>
                                            </div>
                                        </Col>
                                    </div> */}
                                </div>
                                </Col>
                            </Row>
                        </div>
                         
                        </div>
                        
                        <div>
                        <span className='post-title'>{post.title}  </span><br />
                        </div>

                        <div>
                            
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
