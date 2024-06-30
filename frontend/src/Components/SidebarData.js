/* Sidebar contents */

import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const SidebarData = [
    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/home"
    },

    {
        title: "Month",
        icon: <CalendarMonthIcon />,
        link: "/month"
    },

    {
        title: "Week",
        icon: <ViewWeekIcon />,
        link: "/week"
    },

    {
        title: "Notes",
        icon: <FormatListBulletedIcon />,
        link: "/notes"
    }
]