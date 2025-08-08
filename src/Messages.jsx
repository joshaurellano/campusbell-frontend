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
    const [history, setHistory] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        //console.log(showSidebar)
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
            console.log(data.result)
            setConvoId(data.result);
        })
    }
    const joinUser = async () => {
        socket.emit('join', {"room_id":convoId})
    }
    const handleChat = async (e) => {
        e.preventDefault();
        console.log('ReceiverID', selectedUser.user_id, 'SenderID',user.user_id, 'Message',message)
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
            console.log('Chat details',chat)
            setChat((prev) => [...prev, chat])
        }
        
            socket.on("message",handleMessage)
        
            return () => {
                socket.off("message",handleMessage)
            }
        
    },[socket])
    
    useEffect(() => {
        if(!socket) return
        
        const handleHistory = (history) => {
            setHistory(history)
        }        
            socket.on("history",handleHistory)
        
            return () => {
                socket.off("history",handleHistory)
            }
        
    },[socket])

    useEffect(() =>{
        if(chat){
            console.log(chat)
        }
    },[chat])

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
                                                        history && (
                                                            history && history.map((data, key) => (
                                                                <div>
                                                                <div key={key} style={{
                                                                    display:'flex',
                                                                    justifyContent: data.sender_id === user.user_id ? 'end' : 'start',
                                                                    marginBottom:'8px'
                                                                }}>
                                                                     <div className='d-flex flex-column'>
                                                                        
                                                                        <div className='d-flex flex-row align-items-center w-100 gap-1'>
                                                                            <Image 
                                                                                src={data.profile_img}
                                                                                height={20}
                                                                                width={20}
                                                                            />
                                                                            <span>{data.sender}</span>
                                                                        </div>

                                                                        <div className='d-flex flex-column'>
                                                                            <span>{data.message}</span>
                                                                            <small>{data?.created_at && (
                                                                                <ReactTimeAgo 
                                                                                    date={new Date(data.created_at)}
                                                                                    locale="en-US" timeStyle="round"
                                                                                />
                                                                            )}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <hr />
                                                                </div>
                                                            ))   
                                                            
                                                                
                                                        )
                                                    }
                                                    
                                                    {
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
                                                    }
                                                </div>
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
