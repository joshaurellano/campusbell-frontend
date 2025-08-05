import { useEffect, useState, useRef }from 'react'
import {Outlet, useNavigate, Navigate} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import axios from 'axios';

import {API_ENDPOINT} from './Api';

import { useSocket } from './WSconn';
import { SocketProvider } from './WSconn';

const ProtectedRoutes = () => {
   
    const [user, setUser] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate ();
    const socket = useSocket();

      useEffect(() =>{
          const checkUserSession = async () => {
            setPageLoading(true);
              try {
                  const {data} = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true})
                //   console.log(data.result)    
                  setUser(data.result);
                  if(socket && socket.connected) {
                    console.log('User connected', socket.id);

                    socket.emit('user_connected', data.result.id)
                  }
              } catch(error) {
                console.error(error)
                  //go back to login in case if error
              } finally {
                setPageLoading(false);
              }
          };
          checkUserSession();
      }, [socket]);
    return (
    <div>
        {
            pageLoading ?
            <>
            <div className='d-flex justify-content-center align-items-center' style={{height:'100vh', width:'100vw', backgroundColor:'black'}}>
                <FaBell style={{color:'#ffac33', fontSize:'25px'}} />
            <h3 style={{color:'white' ,fontWeight:'bold', textShadow: '2px 2px black'}}>Campus Bell </h3>
            <Spinner style={{marginLeft:'4px'}} animation="grow" variant="warning" />
            </div>
        </> : <div>
            {
                user ? 
                <SocketProvider>
                  <Outlet /> 
                </SocketProvider>   
                
                
                : <Navigate to='/login'/>
            }
        </div>
        }
       
    </div>
  )
}

export default ProtectedRoutes