import React, { useEffect, useState } from 'react'
import { Form, Button, ListGroup, Card } from 'react-bootstrap';
import axios from 'axios';

import { useSocket } from './WSconn';
import { useAuth } from './AuthContext';
import { API_ENDPOINT } from './Api';

const TestChat = () => {
    const user = useAuth();
    const socket = useSocket();
    const [member, setMember] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [convoId, setConvoId] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [history, setHistory] = useState([]);
    const fetchMembers = async () => {
        await axios.get(`${API_ENDPOINT}user`,{withCredentials:true}).then(({data})=>{
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
        fetchMembers();
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
            console.log('Chat history',history)
            setHistory(history)
        }
        
            socket.on("history",handleHistory)
        
            return () => {
                socket.off("history",handleHistory)
            }
        
    },[socket])
    useEffect(() => {
        if(history){
            console.log('Raw', history);
            console.log('Data type', typeof(history))
        }
    },[history])

return (
    <div className='w-100 h-100' style={{ height:'100vh',backgroundColor:'black', color:'white'}}>
      <h2>Test Chat</h2>
      { user && (
      <span>Hi {user.username}</span>)
        }
        <br />
      <span>Select User</span>
        <ListGroup>
            {
                (member && !selectedUser) && (
                    member && member.map((data) =>(
                        <ListGroup.Item key={data.user_id} onClick={() => setSelectedUser(data)}>
                            {data.username}
                        </ListGroup.Item>
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
                                            <div key={key} style={{
                                                textAlign: data.sender_id === user.user_id ? 'right' : 'left'
                                            }}>
                                                <span>{data.message}</span>
                                            </div>
                                        ))   
                                        
                                               
                                    )
                                }
                                {
                                    chat && (
                                        chat && chat.map((data, key) => (
                                            <div key={key} style={{
                                                textAlign: data.sender_id === user.user_id ? 'right' : 'left'
                                            }}>
                                                <span>{data.message}</span>
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

    </div>
  )

}

export default TestChat
