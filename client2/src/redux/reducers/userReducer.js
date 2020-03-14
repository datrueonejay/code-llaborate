const userReducer = (state={type:null, auth:false}, action) => {
    switch(action.type) {
        case 'SET_TYPE':
            return {...state, type: action.userType};
        case 'SET_AUTH':
            return {...state, auth: action.auth};
        default:
            return state;
    }
}

export default userReducer;