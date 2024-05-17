export const LOGIN = {
    STATE_LOGIN: "STATE_LOGIN",
    USER_LOGIN: "USER_LOGIN",
    GET_STATES: "GET_STATES",
    SET_DATES: "SET_DATES",
    FECHA_DESDE: "FECHA_DESDE",
    FECHA_HASTA: "FECHA_HASTA"
}


export const LoginReducer = (state, action) => {
    switch (action.type) {
        case LOGIN.STATE_LOGIN:
            return {
                ...state,
                stateLogin: action.payload,
            };
        case LOGIN.USER_LOGIN:
            return {
                ...state,
                userLogin: action.payload,
            };
        case LOGIN.FECHA_DESDE:
            return {
                ...state,
                txtDateDesde: action.payload,
            };
        case LOGIN.FECHA_HASTA:
            return {
                ...state,
                txtDateHasta: action.payload,
            };
        case LOGIN.GET_STATES:
            return {
                ...state,
                ...action.payload
            };
        case LOGIN.SET_DATES:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};
