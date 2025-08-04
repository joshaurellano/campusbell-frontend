import { useEffect, useState, useRef }from 'react'
import {Outlet, useNavigate, Navigate} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FaBell } from "react-icons/fa";
import axios from 'axios';

import {API_ENDPOINT} from './Api';

import socketIO from 'socket.io-client';

const ProtectedRoutes = () => {
   
    const [user, setUser] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate ();
    const socket = useRef(null) 
      useEffect(() =>{
          const checkUserSession = async () => {
            setPageLoading(true);
              try {
                  const {data} = await axios.get(`${API_ENDPOINT}auth`,{withCredentials:true})
                //   console.log(data.result)    
                  setUser(data.result);
                  if(!socket.current){
                    socket.current = socketIO(`${API_ENDPOINT}`,{withCredentials:true});

                    socket.current.on('connect', () => {
                    console.log('User Connected', socket.current.id)
                  })
                  }
                 
              } catch(error) {
                console.error(error)
                  //go back to login in case if error
              } finally {
                setPageLoading(false);
              }
          };
          checkUserSession();
      }, []);
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
                user ? <Outlet /> : <Navigate to='/login'/>
            }
        </div>
        }
       
    </div>
  )
}

export default ProtectedRoutes