const INITIAL_STATE = {
    userType: null,
    auth: false
}

const userReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case 'SET_TYPE':
            return {...state, userType: action.userType};
        case 'SET_AUTH':
            return {...state, auth: action.auth};
        case 'PURGE':
            return INITIAL_STATE;
        default:
            return state;
    }
}

export default userReducer;