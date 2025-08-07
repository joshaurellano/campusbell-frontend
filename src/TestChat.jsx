import React, { useEffect, useState } from 'react'
import { Form, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_ENDPOINT } from './Api';

const TestChat = () => {
    const user = useAuth();
    const [member, setMember] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchMembers = async () => {
        await axios.get(`${API_ENDPOINT}user`,{withCredentials:true}).then(({data})=>{
            setMember(data.result)
        })
    }
    useEffect(() =>{
        fetchMembers();
    },[])

    useEffect(() => {
        if(selectedUser){
            console.log(selectedUser)
        }
    },[selectedUser])

    useEffect(() => {
        if(user){
            console.log(user)
        }
    },[user])

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
    </div>
  )

}

export default TestChat
