import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Row } from 'react-bootstrap';

import {API_ENDPOINT} from './Api';

import TopNavbar from './components/TopNavbar';

axios.defaults.withCredentials = true;

const ViewProfile = () => {
    const [profile, setProfile] = useState([]);

    const location = useLocation();
    const user_id = location.state.userId;

    const viewUser = async () => {
        const id = user_id;
        try {
            await axios.get(`${API_ENDPOINT}user/view/${id}`,{withCredentials:true}).then(({data})=>{
              console.log(data.result)
              setProfile(data.result)
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        viewUser()
    },[user_id])

return (
    <div style={{height:'100vh'}}>
      <Row>
        <TopNavbar />
      </Row>

      <Row style={{paddingTop:'68px', backgroundColor:'black', height:'100%'}}>
        <div>
        </div>
      </Row>
    </div>
  )
}

export default ViewProfile
