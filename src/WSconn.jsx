import { useEffect, createContext , useContext , useState, useRef }from 'react'
import {Outlet, useNavigate, Navigate} from 'react-router-dom';
import { io } from 'socket.io-client';
import {API_ENDPOINT} from './Api';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if(!socketRef.current) {
            socketRef.current = io(API_ENDPOINT, {withCredentials: true});

            socketRef.current.on('connect', () => {
                console.log('Socket connected',socketRef.current.id);
                setConnected(true);
            })

            socketRef.current.on('disconnect', () => {
                setConnected(false);
            })
        }

        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, [])
    
    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    )
}
