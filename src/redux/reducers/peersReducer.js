/* eslint-disable no-fallthrough */
import { ADD_MESSAGE_TO_CHAT, ADD_PEER, REMOVE_PEER, RESET_PEERS_STATE, UPDATE_CAMERA_STATE } from '../actions/index.js';
import { UPDATE_CHAT } from './../actions/index';

const initialState = {
    peers: [],
    users: [],
    chat: []
}

const peersReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_PEER:
            if(state.peers) {
                const index = state.peers.findIndex((peer) => peer.userID === action.payload.userID)
                if(index === -1) {
                    return {
                        ...state,
                        peers: [...state.peers, {peerID: action.payload.peerID, stream: action.payload.stream, userID: action.payload.userID, roomEndpoint: action.payload.roomEndpoint, isCameraOn: false}],
                        users: [...state.users, {userID: action.payload.userID, roomEndpoint: action.payload.roomEndpoint}]
                    }
                } else {
                    return {
                        ...state
                    }
                }
                
            } else {
                return {
                    ...state,
                    peers: [{peerID: action.payload.peerID, stream: action.payload.stream, userID: action.payload.userID, roomEndpoint: action.payload.roomEndpoint, isCameraOn: false}],
                    users: [{userID: action.payload.userID, roomEndpoint: action.payload.roomEndpoint}]
                }
            }

        case REMOVE_PEER:
                return {
                    ...state,
                    peers: state.peers.filter((peer) => peer.peerID !== action.payload.peerID),
                    users: state.users.filter((user) => user.userID !== action.payload.userID)
                }

        case ADD_MESSAGE_TO_CHAT:
           
                if(state.chat) {
                    return {
                    ...state,
                    chat:[...state.chat, action.payload.newMessage]
                    }
                } else {
                    return {
                        ...state,
                        chat: [action.payload.newMessage]
                    }
                }
        
        case UPDATE_CHAT:
                return {
                ...state,
                chat: action.payload.chat
                }

        case RESET_PEERS_STATE:
            return {
                peers: [],
                users: [],
                chat: []
            }
        case UPDATE_CAMERA_STATE:
            return {
                ...state,
                peers: state.peers.map(peer =>
                    peer.userID === action.payload.userID
                        ? { ...peer, isCameraOn: action.payload.isCameraOn }
                        : peer
                )
            }

        default: 
            return state;
    }
}

export default peersReducer;
