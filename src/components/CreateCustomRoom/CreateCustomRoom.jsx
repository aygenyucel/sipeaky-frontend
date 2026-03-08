/* eslint-disable react-hooks/exhaustive-deps */
import "./createCustomRoom.css"
import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewRoomAction } from "../../redux/actions";
import { v1 as uuid } from "uuid";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CreateCustomRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const userData =  useSelector(state => state.profileReducer.data);

    const [capacity, setCapacity] = useState(2);
    const [language, setLanguage] = useState("English");
    const [level, setLevel] = useState("B1");
    const [userID, setUserID] = useState(null);
    const [endpoint] = useState("") //random room link created by UUID

    const languageOptions = [
        { value: "English", label: "English" },
        { value: "Spanish", label: "Spanish" },
        { value: "French", label: "French" },
        { value: "German", label: "German" },
        { value: "Italian", label: "Italian" },
        { value: "Portuguese", label: "Portuguese" },
        { value: "Turkish", label: "Turkish" }
    ];  
   
    const handleSubmit = (e) => {
        e.preventDefault()
        createNewRoom()
        .then(({data, roomEndpoint, roomID}) => {
            dispatch(addNewRoomAction(data))
            navigate(`/chatroom/${roomEndpoint}`, {state: {user: userData, roomID: roomID}})
        })
        .catch((err) => {console.log(err)});
    }


    const createNewRoom = async () => {
        const randomEndpoint = uuid()
        const newRoom = {
            capacity: capacity,
            language: language  ,
            level: level,
            users:[userID],
            creatorUserID: `${userID}`,
            hostUserID:`${userID}`,
            endpoint: randomEndpoint,
            roomStartedAt: new Date()
        }
        const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms`, {
            
            method: "POST",
            body: JSON.stringify(newRoom),
            headers:{
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            throw new Error("Failed to create room");
        }
        const data = await response.json();
        return({
            data,
            roomEndpoint: data.endpoint,
            roomID: data._id
        })
    }

    useEffect(() => {
        setUserID(userData._id)
    }, [])

    const  handleChangeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage.value)
      };

    return <>
            <div className="create-custom-room position-relative">
                <button className=" create-room-btn"  onClick={handleShow}>
                    Create Study Room 
                </button>

                <Modal show={show} onHide={handleClose} animation={true} className= "d-flex justify-content-center align-items-center">
                    <div className="modal-div">
                        <Modal.Header closeButton className="d-flex justify-content-center align-items-center">
                            <Modal.Title className="modal-title" >CREATE NEW ROOM</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 mt-2 create-room-form-group">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Select defaultValue={2} id="roomCapacity" onChange={(e) => setCapacity(e.target.value)}>
                                        <option value= {2} >2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 create-room-form-group">
                                        <Form.Label className="form-label">Language</Form.Label>
                                        <Select className="select-language"
                                            defaultValue={"English"}
                                            placeholder= {language ? language : "English" }
                                            value={language}
                                            onChange={handleChangeLanguage}
                                            options={languageOptions}
                                        />
                                    
                                </Form.Group>
                                <Form.Group className="mb-3 create-room-form-group">
                                    
                                    <Form.Label>Language level</Form.Label>
                                    <Form.Select placeholder="Beginner" defaultValue={'Beginner'} id="roomLevel" onChange={e => setLevel(e.target.value)}>
                                        <option value="Beginner" >Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Native">Native Speaker</option>
                                    </Form.Select>
                                </Form.Group>
                                <button className="save-room-btn d-flex justify-content-center align-items-center" variant="primary" type="submit">
                                    CREATE AND JOIN
                                </button>
                            </Form>
                        </Modal.Body>
                    </div>
                </Modal>
            </div>
    </>
} 

export default CreateCustomRoom;