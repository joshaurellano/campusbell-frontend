import { useEffect, useState } from 'react'
import { Form, Button, ListGroup, Card, Row, Col, Container, Image } from 'react-bootstrap';
import ReactTimeAgo from 'react-time-ago'

import axios from 'axios';

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
            console.log(data.result)
            setMember(data.result)
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
        if(!socket) return
        
        const handleMessage = (chat) => {
            setChat(chat)
        }        
            socket.on("chat",handleMessage)
            return () => {
                socket.off("chat",handleMessage)
            }
        
    },[socket])

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

                    <Col lg={10} style={{height:'calc(100vh - 68px)', overflowY:'auto', overflowX:'hidden', color:'white'}}>
                        <h2>Test Chat</h2>
                        { user && (
                        <span>Hi {user.username}</span>)
                            }
                            <br />
                       
                            <ListGroup>
                                <ListGroup.Item disabled>
                                    Select User
                                </ListGroup.Item>
                                {
                                    (member && !selectedUser) && (
                                        
                                        member && member.map((data) =>(                                
                                            data.friends ? (
                                                data.friends && data.friends.map((friend) => (
                                                    <ListGroup.Item action key={friend.user_id} onClick={() => setSelectedUser(friend)}>
                                                        {friend.username}
                                                    </ListGroup.Item>
                                                ))
                                            ) : (
                                                <>
                                                <ListGroup.Item> You don't have friends yet </ListGroup.Item>
                                                </>
                                            )
                                        ))
                                        
                                    )
                                 
                                }
                            </ListGroup>
                            {
                                selectedUser && (
                                    <div>
                                        <Card>
                                            <Card.Header>
                                                {selectedUser.username}
                                            </Card.Header>
                                            <Card.Body>
                                                <div>
                                                    {
                                                        chat && (
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
                                                            
                                                                
                                                        )
                                                    }
                                                    </div>
                                                    {/* {
                                                        chat && (
                                                            chat && chat.map((data, key) => (
                                                                <div>
                                                                    <div key={key} style={{
                                                                        display:'flex',
                                                                        justifyContent: data.sender_id === user.user_id ? 'end' : 'start'
                                                                    }}>
                                                                        <div className='d-flex flex-column'>
                                                                            <div className='d-flex flex-row align-items-center'>
                                                                                <Image 
                                                                                    src={selectedUser.profile_img}
                                                                                    height={20}
                                                                                    width={20}
                                                                                />
                                                                                <span>{user.username}</span>
                                                                            </div>
                                                                            <div className='d-flex flex-column'>
                                                                                <span>{data.message}</span>
                                                                                 <small>{data?.created_at && (
                                                                                <ReactTimeAgo 
                                                                                    date={new Date(data.created_at)}
                                                                                    locale="en-US" timeStyle="twitter"
                                                                                />
                                                                                )}</small>
                                                                            </div>
                                                                        </div>
                                                                    
                                                                    </div>
                                                                    <hr />
                                                                </div>
                                                            ))   
                                                            
                                                                
                                                        )
                                                    } */}
                                                
                                                <div>
                                                    <Form onSubmit={handleChat}>
                                                        <Form.Group>
                                                            <Form.Control value={message}
                                                            onChange={(e) => setMessage(e.target.value)}/>
                                                        </Form.Group>
                                                        <br />
                                                        <Form.Group>
                                                            <Button type='submit'>Send</Button>
                                                        </Form.Group>
                                                    </Form>
                                                </div>
                                            </Card.Body>
                                        </Card>

                                    </div>
                                )
                            }

                    </Col>
                </Row>

            </Container>

        </Row>
      </div>
  )

}

export default Messages
