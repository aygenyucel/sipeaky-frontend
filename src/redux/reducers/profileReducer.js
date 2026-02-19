import { GET_PROFILE, GET_PROFILE_ID, GET_IS_KICKED, RESET_PROFILE } from "../actions"


const initialState = {
    data: null,
    profileID: "",
    isKicked: false
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE:
            return {
                ...state,
                data: action.payload
            }
        case  GET_PROFILE_ID:
            return {
                ...state,
                profileID: action.payload
            }
        case GET_IS_KICKED:
            return {
                ...state,
                isKicked: action.payload
            }
        case RESET_PROFILE:
            return initialState;
        default: 
            return state
    }

}

export default profileReducer;