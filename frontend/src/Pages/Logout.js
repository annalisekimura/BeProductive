import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Logout() {

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    }

    useEffect (() => {
        handleLogout();

    }, [])
}

export default Logout;