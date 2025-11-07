
export const loginUser = () => async (dispatch) => {
    try {
        dispatch({ type: "AUTH_REQUEST"});

        const { data } = await axios.post("/auth/login", credentials);

        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({ type: "AUTH_SUCCESS", payload: data.user});
    } catch (error) {
        dispatch({
            type: "AUTH_FAIL",
            payload: error.response?.data?.message || "Login Failed"
        })
    }
}

export const registerUser = (info) => async (dispatch) => {
    try {
        dispatch({ type: "REGISTOR_REQUEST"});
        await axios.post("/auth/registor", info);
        dispatch({ type:"REGISTOR_SUCCESS"});
    } catch (error) {
        dispatch({
            type: "REGISTOR_FAIL",
            payload: error.response?.data?.message || "Registration failed"
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT"})
};