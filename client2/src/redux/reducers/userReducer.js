const userReducer = (state={userType:null, auth:false}, action) => {
    switch(action.type) {
        case 'SET_TYPE':
            return {...state, userType: action.userType};
        case 'SET_AUTH':
            return {...state, auth: action.auth};
        default:
            return state;
    }
}

export default userReducer;