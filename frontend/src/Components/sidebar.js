/* Sidebar to navigate */

import React from 'react'
import '../App.css';
import { SidebarData } from './SidebarData';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();

    /* Activate sidebar data */
    
    return (
        <div className="Sidebar">
            <ul className="SidebarList">
                {SidebarData.map((val, key)=> {
                    return (
                        <li
                            key={key}
                            className="row"
                            id={window.location.pathname === val.link ? "active" : ""}
                            onClick={()=> navigate(val.link)}
                        >
                            <div id="icon">{val.icon}</div>
                            <div id="title">{val.title}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Sidebar;