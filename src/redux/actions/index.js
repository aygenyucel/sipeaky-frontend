export const ADD_PEER= 'ADD_PEER';
export const REMOVE_PEER = 'REMOVE_PEER';
export const RESET_PEERS_STATE = 'RESET_PEERS_STATE';
export const UPDATE_PEER_STREAMS = 'UPDATE_PEER_STREAMS'
export const GET_PROFILE = 'GET_PROFILE'
export const GET_PROFILE_ID = 'GET_PROFILE_ID'
export const ADD_NEW_ROOM = 'ADD_NEW_ROOM'
export const DELETE_ROOM ='DELETE_ROOM'
export const RESET_ROOMS_STATE = 'RESET_ROOMS_STATE';
export const GET_ROOMS= 'GET_ROOMS' //fetching /GET
export const UPDATE_ROOM_USERS = 'UPDATE_ROOM_USERS';
export const ADD_MESSAGE_TO_CHAT = 'ADD_MESSAGE_TO_CHAT';
export const UPDATE_CHAT ='UPDATE_CHAT';
export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const REMOVE_ONLINE_USER = 'REMOVE_ONLINE_USER';
export const RESET_ONLINE_USERS = 'RESET_ONLINE_USERS';
export const GET_IS_KICKED = 'GET_IS_KICKED';
export const RESET_PROFILE = 'RESET_PROFILE';
export const UPDATE_CAMERA_STATE = 'UPDATE_CAMERA_STATE';

const BE_DEV_URL = process.env.REACT_APP_BE_DEV_URL;

export const getIsKickedAction = (isKicked) => {
    return {
        type: GET_IS_KICKED,
        payload: isKicked
    }
}

export const addPeerAction = (peerID, stream, userID, roomEndpoint) => {
    addOnlineUsersAction(userID)
    return {
        type:ADD_PEER,
        payload: {peerID, stream, userID, roomEndpoint}
    }
}

export const removePeerAction = (peerID, userID) => {
    removeOnlineUsersAction(userID)
    return {
        type:REMOVE_PEER,
        payload: {peerID, userID}
    }
}

export const addMessageToChatAction = (newMessage) => {
    return {
        type: ADD_MESSAGE_TO_CHAT,
        payload: {newMessage}
    }
}

export const updateChatAction = (chat) => {
    return {
        type: UPDATE_CHAT,
        payload: {chat}
    }
}

export const updateRoomChatAction = (roomID, newMessage, chat) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response= await fetch(`${BE_DEV_URL}/rooms/${roomID}`, 
            {method: "PUT", 
            body: JSON.stringify({chat: chat}), 
            headers: {
                        "Content-Type": "application/json"
                    }})
            if(response.ok) {
                const roomData = await response.json();
                // console.log("######", roomData);

                resolve(roomData)
            } else {
                console.log("sorryyy, there is a problem when fetching!")
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const updatePeerStreamsAction = (peers) => {
    return {
        type: UPDATE_PEER_STREAMS,
        payload: {peers}
    }
}

export const resetPeersStateAction = () => {
    return {
        type: RESET_PEERS_STATE
    }
}
export const resetRoomsStateAction = () => {
    return {
        type: RESET_ROOMS_STATE
    }
}

export const resetOnlineUsersAction = () => {
    return {
        type: RESET_ONLINE_USERS
    }
}
export const signupAndGetTokenAction = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const options = {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        }
            try {
                const response = await fetch(`${BE_DEV_URL}/users/signup`, options);
                if(response.ok) {
                    const data= await response.json()
                    resolve({})
                } else {
                    response.text()
                    .then(text => {
                        throw new Error(text)
                    })
                    console.log("Ops, something went wrong", )
                }
                
            } catch (error) {
                console.log("🚀 error", error)
                reject(error)
            }
    })
}

export const logoutAction = () => {
    return {
      type: RESET_PROFILE
    }
  }

export const loginAndGetTokenAction = async (user) => {
    const loginResponse = await fetch(`${BE_DEV_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if(!loginResponse.ok){
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Invalid email or password");
    }
    
    const { JWTToken } = await loginResponse.json();

    if (!JWTToken) {
        throw new Error("Token not received");
    }
    localStorage.setItem("JWTToken", JWTToken);

    const profileResponse = await fetch(`${BE_DEV_URL}/users/me`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWTToken}`
        }
    });

    if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
    }
    const profile = await profileResponse.json()
    const setUserProfileAction = {
        type: GET_PROFILE,
        payload: profile
    }
            
    const setUserProfileIDAction = {
        type: GET_PROFILE_ID,
        payload: profile._id
    }
    return({setUserProfileAction, setUserProfileIDAction});
}

export const isUserAlreadyLoggedInAction =  async (userState, JWTToken, dispatch) => {
    try {
        if (!JWTToken) return false;
        if (userState) return true;
        const response = await fetch(`${BE_DEV_URL}/users/me`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Bearer " + JWTToken
            }
        });
        if (!response.ok) return false;
        
        const data = await response.json();
        dispatch({type: GET_PROFILE, payload: data})
        dispatch({type: GET_PROFILE_ID, payload: data._id})  
        return true;
        
    } catch (error) {
        console.log(error)
    }
}

export const addNewRoomAction = (newRoomData) => {
    return {
        type: ADD_NEW_ROOM,
        payload: newRoomData
    }
}

export const deleteRoomAction = (deletedRoomID) => {
    return {
        type: DELETE_ROOM,
        payload: deletedRoomID
    }
}

export const getAllRoomsAction = () => {
    return new Promise(async (resolve, reject) => {
            const options = {
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                }
            }
            try {
                const response = await fetch(`${BE_DEV_URL}/rooms`, options)
    
                if(response.ok) {
                    const data = await response.json();
                    
                    const action = {type: GET_ROOMS, payload: data}
                    resolve(action);
                } else {
                    throw new Error("oppppss something went wrong when fetching!")
                }
                
            } catch (error) {
                console.log(error)
                reject(error)
            }
    })
}

export const updateRoomUsersAction = (users, roomID, userID) => {
    return new Promise (async (resolve, reject) => {
        const options = {
            method: "PUT",
            body: JSON.stringify({users: users}),
            headers:{
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch(`${BE_DEV_URL}/rooms/${roomID}`, options)
            
            if(response.ok) {
                const updatedRoom = await response.json()
                const action = {
                    type: UPDATE_ROOM_USERS,
                    payload: {users, roomID, userID}
                }

                resolve(action)
            } else {
                throw new Error("oppppss something went wrong when fetching!")
            }
            
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

//adding online users in the all chat rooms
export const addOnlineUsersAction = (userID) => {
    return {
        type: ADD_ONLINE_USER,
        payload: {userID}
    }
}

//removing online users in the all chat rooms
export const removeOnlineUsersAction = (userID) => {

    return {
        type: REMOVE_ONLINE_USER,
        payload: {userID}
    }
}

export const joinAsGuestAction = async () => {
    const res = await fetch(`${BE_DEV_URL}/users/guest`, { method: "POST" });
    const { JWTToken } = await res.json();

    localStorage.setItem("JWTToken", JWTToken);
    if (!JWTToken) {
        throw new Error("Token not received");
    }

    const profileResponse = await fetch(`${BE_DEV_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JWTToken}`
        }
    });

    if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
    }
    const profile = await profileResponse.json()

    return({ type: GET_PROFILE, payload: profile });
}

export const updateCameraState = (userID, isCameraOn) => {
    return {
        type: UPDATE_CAMERA_STATE,
        payload: {userID, isCameraOn}
    }
}