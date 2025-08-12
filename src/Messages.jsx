import { useEffect, useState } from 'react'
import { Form, Button, ListGroup, Card, Row, Col, Container, Image } from 'react-bootstrap';
import ReactTimeAgo from 'react-time-ago'

import axios from 'axios';
import { IoReturnDownBack } from "react-icons/io5";

import { useSocket } from './WSconn';
import { useAuth } from './AuthContext';
import { API_ENDPOINT } from './Api';

import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar'

import './Messages.css';

const Messages = () => {
    const user = useAuth();
    const socket = useSocket();
    const [member, setMember] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [convoId, setConvoId] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(showSidebar => !showSidebar)
    }
    const fetchFriends = async () => {
        const id = user.user_id;
        await axios.get(`${API_ENDPOINT}friend/${id}`,{withCredentials:true}).then(({data})=>{
            setMember(data.result);
            setSelectedUser(data.result[0].friends[0]);

        })
    }
    const getConversationID = async () => {
        const id = selectedUser.user_id;
        await axios.get(`${API_ENDPOINT}chat/${id}`,{withCredentials:true}).then(({data})=> {
            setConvoId(data.result);
        })
    }
    const joinUser = async () => {
        socket.emit('join', {"room_id":convoId})
    }
    const handleChat = async (e) => {
        e.preventDefault();
        socket.emit('message',{"receiver_id":selectedUser.user_id,"sender_id":user.user_id,"message":message})
        setMessage('');
    }
 
    useEffect(() =>{
        fetchFriends();
    },[])

    useEffect(() => {
        if(selectedUser){
            getConversationID();
        }
    },[selectedUser])

    useEffect(() => {
        if(convoId){
            joinUser();
        }
    },[convoId])
    
    useEffect(() => {
        if(!socket) return;
        
        const handleMessage = (chat) => {
            setChat(chat)
        }        
            socket.on("chat",handleMessage)
            return () => {
                socket.off("chat",handleMessage)
            }
        
    },[socket])

return (
    <div style={{height:'100vh', width:'100vw', overflow:'auto'}}>
        <Row>
            <TopNavbar handleToggleSidebar={toggleSidebar}/>
        </Row>

        <Row style={{paddingTop:'68px', backgroundColor:'black',width:'100%'}}> 
            <Container fluid style={{width:'100%'}}>
                <Row>
                    <Col lg={2} className='topic-col'>
                        <Sidebar showSidebar={showSidebar} 
                            handleCloseSidebar={() => setShowSidebar(false)}/>
                    </Col>

                    <Col lg={10} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden', color:'white', borderRadius:'5px'}}>
                        <Container style={{height:'100%', width:'100%'}}>
                        <Row style={{height:'100%'}}>
                            <Col lg={3} style={{borderRight:'1px solid white', height:'100%', overflowY:'auto', overflowX:'hidden',}}>
                                <div style={{height:'100%'}}>
                                {
                                    (member) && (
                                    <div style={{height:'100%'}}>
                                        <div style={{color:'white', backgroundColor:'black', height:'100%'}}>
                                            {
                                                member && member.map((data) =>(
                                                    data.friends ? (
                                                        (data.friends).map((friend)=> (
                                                            
                                                            <div className='selected-user' key={friend.user_id} style={{
                                                                color:'white', 
                                                                backgroundColor:selectedUser.user_id === friend.user_id ? 'blue' : 'black', 
                                                                borderRadius:'10px'}} onClick={() => setSelectedUser(friend)}>
                                                                
                                                                    <div className='d-flex flex-row gap-2 align-items-center' style={{padding:'8px'}}>
                                                                        <Image src={friend.profile_img} height={20} width={20} />
                                                                        {friend.username}
                                                                    </div>
                                                                    <hr />
                                                                
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div>No friend yet</div>
                                                    )
                                                ))
                                            }
                                        </div>
                                    </div>
                                        
                                    )
                                    
                                }
                                </div>
                            
                            </Col>

                            <Col lg={9} style={{height:'100%'}}> 
                                <Card style={{height:'100%'}}>
                                    <Card.Header>
                                        <div>
                                            <h4>{selectedUser ? (
                                                    <div className='d-flex align-items-center flex-row gap-1'>
                                                        <Image src={selectedUser.profile_img} height={25} width={25} />
                                                        <span>{selectedUser.username}</span>
                                                    </div>
                                                ): ('Select from your friend list')
                                                }</h4>
                                        </div>
                                    </Card.Header>
                                    <Card.Body style={{height:'100vh', overflowY:'auto', overflowX:'hidden',}}>
                                        {
                                            chat && chat.length > 0 ? (
                                                chat && chat.map((data) => (
                                                    
                                                    <div key={data.message_id} style={{
                                                        display:'flex',
                                                        justifyContent: data.sender_id === user.user_id ? 'end' : 'start',
                                                        marginBottom:'8px'
                                                    }}>
                                                            <div className='d-flex flex-column'>
                                                            <div className='d-flex justify-content-start'>
                                                                <small>{data.sender}</small>
                                                            </div>
                                                            <div className='d-flex flex-row align-items-end w-100 gap-1'>
                                                                <div>
                                                                <Image 
                                                                    src={data.profile_img}
                                                                    height={30}
                                                                    width={30}
                                                                />
                                                                </div>
                                                                <div style={{border:'1px solid black', borderRadius:'12px 12px', width:'max-content',maxWidth:'200px', display:'flex', justifyContent:'start', wordBreak:'break-word',paddingTop:'4px',paddingBottom:'4px',paddingLeft:'10px',paddingRight:'10px'}}>
                                                                    <small>{data.message}</small>
                                                                </div>
                                                            </div>

                                                            <div className='d-flex flex-column'>
                                                                
                                                                <small>{data?.created_at && (
                                                                    <ReactTimeAgo 
                                                                        date={new Date(data.created_at)}
                                                                        locale="en-US" timeStyle="round"
                                                                    />
                                                                )}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))   
                                            ) : (
                                                <div>
                                                    <span>Start a Conversation</span>
                                                </div>
                                            )
                                        }
                                    </Card.Body>
                                    <Card.Footer>
                                        <div>
                                            <Form onSubmit={handleChat}>
                                                <Form.Group>
                                                    <Form.Control value={message}
                                                    onChange={(e) => setMessage(e.target.value)} 
                                                    placeholder='Write a Message' />
                                                </Form.Group>
                                                <br />
                                                <Form.Group>
                                                    <Button type='submit'>Send</Button>
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            
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

export default Messages
