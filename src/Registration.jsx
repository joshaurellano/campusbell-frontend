import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Navbar,Nav,Container,Button,Form,Row,Col,Spinner,Card,Alert, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {API_ENDPOINT} from './Api';

import { FiInfo } from "react-icons/fi";

import './Registration.css';

function Registration () {
    const navigate = useNavigate();
    const [userName,setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [program, setProgram] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [town, setTown] = useState('');
    const [barangay, setBarangay] = useState('');
    const [street, setStreet] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [userNameError,setUserNameError] = useState('');
    const [passWordError, setPassWordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [middleNameError, setMiddleNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [programError, setProgramError] = useState('');
    const [regionError, setRegionError] = useState('');   
    const [provinceError, setProvinceError] = useState('');   
    const [cityError, setCityError] = useState('');   
    const [townError, setTownError] = useState('');   
    const [barangayError, setBarangayError] = useState('');   
    const [streetError, setStreetError] = useState('');   
    const [houseNoError, setHouseNoError] = useState('');       
    const [successAlertShow, setSuccessAlertShow] = useState(false);
    const [errorAlertShow, setErrorAlertShow] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);

        //set loading state to true to trigger spinner to show
        setLoading(true);
        try{
            // send to backend the given registration details
            const response = await axios.post(`${API_ENDPOINT}auth/register`,{
                username:userName,
                password:passWord,
                email,
                first_name:firstName,
                last_name:lastName,
                phone_number:phoneNumber,
                program,
                region,
                province,
                city,
                town,
                barangay,
                street,
                house_no:houseNo,

            });
            // console.log(response);
            const otpGen = await axios.post(`${API_ENDPOINT}otp/generate`,{
                email:response.data.email,
                purpose_id:'3'
            })
            // set loading state to false after operation
            setLoading(false)
            setError('');
            setSuccessAlertShow(true);
            //if no error, go back to login page
        } catch(error) {
            setErrorAlertShow(true);
            console.error(error.response.data.message)
            if(error.response.data.message.includes("Username")){
                setUserNameError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Password")){
                setPassWordError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Email")){
                setEmailError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Phone Number")){
                setPhoneNumberError(error.response.data.message)
            }
            else if(error.response.data.message.includes("First Name")){
                setFirstNameError(error.response.data.message)
            }
            else if(error.response.data.message.includes("Middle Name")){
                setMiddleNameError(error.response.data.message)
            }else if(error.response.data.message.includes("Last Name")){
                setLastNameError(error.response.data.message)
            }else if(error.response.data.message.includes("Region")){
                setRegionError(error.response.data.message)
            }else if(error.response.data.message.includes("Province")){
                setProvinceError(error.response.data.message)
            }else if(error.response.data.message.includes("City")){
                setCityError(error.response.data.message)
            }else if(error.response.data.message.includes("Town")){
                setTownError(error.response.data.message)
            }else if(error.response.data.message.includes("Barangay")){
                setBarangayError(error.response.data.message)
            }else if(error.response.data.message.includes("Street")){
                setStreetError(error.response.data.message)
            }else if(error.response.data.message.includes("House Number")){
                setHouseNoError(error.response.data.message)
            }else if(error.response.data.message.includes("Program")){
                setProgramError(error.response.data.message)
            }
            
            setLoading(false);

            setError(error.response.data.message);
        }
    };
    function closeAlert (){
        setSuccessAlertShow(false)
        navigate('/login');
    }
    
    const renderTooltip = (props) => (
        <Tooltip id="tooltip" {...props}>
        Fields with "*" are required
        </Tooltip>
    );

    return (
        <div style={{
                backgroundImage: "url('https://res.cloudinary.com/dv7ai6yrb/image/upload/v1749185659/element5-digital-jCIMcOpFHig-unsplash_yjxbqj.jpg')" ,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight:'100vh',
                width: "100%",
                position:'relative'}}>
            <div className='overlay'>
        <Navbar data-bs-theme='dark'>
            <Container>
                <Navbar.Brand>
                    <Nav.Link as={Link} to='/login' style={{color:'white',textShadow:'1px 1px black',fontWeight:'bold'}}>
                        Campus Bell
                    </Nav.Link>
                </Navbar.Brand>
            </Container>
        </Navbar>

        <Container>
            <Row className = 'justify-content-md-center'>
                <Col xs={12} lg={6} style={{color:'white',}}>
                <div className='d-flex flex-column' style={{
                    gap:'16px',
                    height:'100%',
                    justifyContent:'center'}}>
                    <br />
                    <div>
                        <h2 style={{fontWeight:'bold', fontSize:'32px',textShadow: '1px 1px black'}}>Helping each students Grow and Build Together</h2>
                    </div>
                    <div style={{marginTop:'8px'}}>
                        <span className='message-1'>Built for students. By students</span>
                    </div>
                    <div className='message-2'>
                        <span>
                            Find Answers 
                        </span>
                        <br/>
                        <span>
                            Share Knowledge 
                        </span>
                        <br/>
                        <span>
                            Create something great, together
                        </span>
                    </div>
                    <div style={{marginTop:'8px'}}>
                        <span className='message-3'>
                            A safe space to ask anything. Let your thoughts be heard
                        </span>
                    </div>
                    <div style={{marginTop:'8px',textShadow: '1px 1px black'}}>
                        <span className='message-4'>
                            Already have an Account? Login <span style={{textShadow:'none'}}><Link to={'/login'}> Here </Link></span>
                        </span>
                    </div>
                </div>
                </Col>
                <Col xs={12} lg={6}>
                <div>
                    <div className='container'>
                            <br />
                            <div>
                                {
                                    successAlertShow && (
                                        <Alert variant="success" onClose={() => closeAlert()} dismissible>
                                        <Alert.Heading>Success!</Alert.Heading>
                                        <p>
                                        Please check your email for OTP code.
                                        Close this alert go back to login
                                        </p>
                                    </Alert>
                                    )
                                }
                            </div>
                            <div>
                                {
                                    errorAlertShow && (
                                        <Alert variant="danger" onClose={() => setErrorAlertShow(false)} dismissible>
                                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                        <p>
                                        This can happen sometimes. Check your details first and try again
                                        </p>
                                    </Alert>
                                    )
                                }
                            </div>
                            <Card className='registration-card'>
                                <Card.Body>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}}>
                                <span className='form-heading-1'>Register</span>
                                <span className='form-heading-2'>Campus Bell</span> <br/>
                                
                                </div>
                                <div>
                                <Form noValidate validated={validated}onSubmit={handleSubmit}>
                                
                                 <OverlayTrigger
                                    placement="right"
                                    overlay={renderTooltip}
                                    >
                                    <FiInfo style={{marginBottom:'8px', color:'#74787e'}}/>
                                    </OverlayTrigger>
                                
                                <Form.Group controlId = 'formUsername'>
                                    <p style={{marginBottom:'8px', fontWeight:'500'}}>Account Information</p>
                                    <Form.Label><span style={{color:'red'}}>* </span>Username:</Form.Label>
                                    <Form.Control 
                                        type='text' 
                                        style={{border:'none', borderBottom:'1px solid gray',}}
                                        placeholder='johnSmith123'
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}isInvalid={!!userNameError} required />
                                    <Form.Control.Feedback type='invalid'>{userNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId='formPassword'>
                                <Form.Label><span style={{color:'red'}}>* </span>Password:</Form.Label>
                                <Form.Control
                                        type='password'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Enter your password'
                                        value={passWord}
                                        onChange={(e) => setPassWord(e.target.value)}isInvalid={!!passWordError} required/>
                                <Form.Control.Feedback type='invalid'>{passWordError}</Form.Control.Feedback>
                            </Form.Group> <br/>
                            
                            <p style={{fontWeight:'500'}}>Personal Information</p>
                            <Form.Group controlId = 'formFirstName'>
                                    <Form.Label><span style={{color:'red'}}>* </span> First Name:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='John'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}isInvalid={!!firstNameError} required />
                                    <Form.Control.Feedback type='invalid'>{firstNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                                <Form.Group controlId = 'formMiddleName'>
                                    <Form.Label>Middle Name:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Will'
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}isInvalid={!!middleNameError} />
                                    <Form.Control.Feedback type='invalid'>{middleNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formLastName'>
                                    <Form.Label><span style={{color:'red'}}>* </span>Last Name:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Smith'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}isInvalid={!!lastNameError} required />
                                    <Form.Control.Feedback type='invalid'>{lastNameError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formEmail'>
                                    <Form.Label><span style={{color:'red'}}>* </span>Email:</Form.Label>
                                    <Form.Control
                                        type='email'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='someone@email.com'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}isInvalid={!!emailError} required />
                                    <Form.Control.Feedback type='invalid'>{emailError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formPhoneNumber'>
                                    <Form.Label><span style={{color:'red'}}>* </span>Phone Number:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='09123456789'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}isInvalid={!!phoneNumberError} required />
                                    <Form.Control.Feedback type='invalid'>{phoneNumberError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formProgram'>
                                    <Form.Label>Program:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='BS-Information System'
                                        value={program}
                                        onChange={(e) => setProgram(e.target.value)}isInvalid={!!programError} />
                                    <Form.Control.Feedback type='invalid'>{programError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <p style={{fontWeight:'500'}}>Address</p>
                            <Form.Group controlId = 'formRegion'>
                                    <Form.Label>Region:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='5'
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}isInvalid={!!regionError} />
                                    <Form.Control.Feedback type='invalid'>{regionError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formProvince'>
                                    <Form.Label>Province:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Camarines Sur'
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}isInvalid={!!provinceError} />
                                    <Form.Control.Feedback type='invalid'>{provinceError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formCity'>
                                    <Form.Label>City:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Caloocan City'
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}isInvalid={!!cityError} />
                                    <Form.Control.Feedback type='invalid'>{cityError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formTown'>
                                    <Form.Label>Town:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='San Jose'
                                        value={town}
                                        onChange={(e) => setTown(e.target.value)}isInvalid={!!townError} />
                                    <Form.Control.Feedback type='invalid'>{townError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formBarangay'>
                                    <Form.Label>Barangay:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Calauag'
                                        value={barangay}
                                        onChange={(e) => setBarangay(e.target.value)}isInvalid={!!barangayError} />
                                    <Form.Control.Feedback type='invalid'>{barangayError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formStreet'>
                                    <Form.Label>Street:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='Green Valley'
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}isInvalid={!!streetError} />
                                    <Form.Control.Feedback type='invalid'>{streetError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId = 'formHouseNo'>
                                    <Form.Label>House Number:</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{border:'none', borderBottom:'1px solid gray'}}
                                        placeholder='077'
                                        value={houseNo}
                                        onChange={(e) => setHouseNo(e.target.value)}isInvalid={!!houseNoError} />
                                    <Form.Control.Feedback type='invalid'>{phoneNumberError}</Form.Control.Feedback>
                                </Form.Group> <br/>

                            <Form.Group controlId='formButton'>
                                {/* {error && <p style={{color:'red'}}>{error}<br /></p>} */}
                                {error.length > 0 && (
                                    error.map((error) =>(
                                    <>
                                    <span style={{color:'red'}}>{error}</span>
                                    <br />
                                    </>
                                    ))
                                    
                                )
                                
                                }
                                <Button variant='success' style={{borderRadius:'10px', width:'100%'}} 
                                block='block' type='submit' disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            /> <span>Please Wait</span>
                                        </> 
                                    ) : ('Register')}
                                </Button>
                            </Form.Group>
                            </Form>
                            </div>
                                </Card.Body>
                            </Card>
                    </div>
                </div>
            </Col>

            
            </Row>
        </Container>
        </div>
        </div>
    )
}
export default Registration;