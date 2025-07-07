import React from 'react'
import {useNavigate} from 'react-router-dom';

import {Nav,Navbar,Container,Button,Form,Row,Col,Spinner,Card,FloatingLabel} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

function ForgotPassword() {

const navigate = useNavigate();

  return (
    <div style={{ height:'100vh',width:'100vw',display:'flex', justifyContent:'center',alignItems:'center'}}>
        <Card style={{width:'300px',height:'300px'}}>
            <Card.Body>
                <div style={{
                    display:'flex',
                    width:'100%',
                    height:'100%',
                    alignItems:'center',
                }}>
                <Form style={{width:'100%'}}>
                    <Form.Group style={{marginBottom:'8px'}}>
                        <Form.Control
                        placeholder='Enter your new password'>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group style={{marginBottom:'8px'}}>
                        <Form.Control
                        placeholder='Re enter your password'>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Button>Update password</Button>
                    </Form.Group>
                </Form>
                </div>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ForgotPassword
