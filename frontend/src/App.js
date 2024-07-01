import './App.css';
import Sidebar from './Components/sidebar';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Home from './Pages/Home';
import { EventProvider } from './Pages/EventContext';
import MonthPage from './Pages/MonthPage';
import WeekPage from './Pages/Week';
import Notes from './Pages/Notes'
import { WeekProvider } from './Pages/WeekContext';
import { useState } from 'react';
import Login from './Login';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Logout from './Pages/Logout';

import { ChakraProvider, theme, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Container, Box} from '@chakra-ui/react';

export async function notifyUser (notificationText = "Event reminder") {
  if(!("Notification" in window)) {
    alert("Browser does not support notifications");
  } else if (Notification.permission === "granted") {
    const notification = new Notification(notificationText);
  } else if(Notification.permission !== "denied") {
    await Notification.requestPermission().then((permission) => {
      if(permission === "granted") {
        const notification = new Notification(notificationText);
      }
    });
  }
}



function App() {
  const [userResponded, setUserResponded] = useState(false);

  const loggedIn = localStorage.getItem('loggedIn');


  async function enableNotifsAndClose () {
    await notifyUser().then(() => {
      setUserResponded(true);
    })
  }

  
  function disableNotifsAndClose () {
    setUserResponded(true);
  }


  

  return (!(userResponded) && !(Notification.permission === "granted") && ( (loggedIn === 'false') || (loggedIn == null)) ) ? (

    <EventProvider>
    <ChakraProvider theme={theme}>
      <Container>
        <Alert status="success">
          <AlertIcon />
          <Box>
            <AlertTitle>Notifications</AlertTitle>
            <AlertDescription>
              Would you like to enable notifications?
            </AlertDescription>
          </Box>
          <Button colorScheme='teal' size='sm' onClick={enableNotifsAndClose}>
            Sure!
          </Button>
          <Button colorScheme='gray' size='sm' onClick={disableNotifsAndClose}>
            No thanks!
          </Button>
        </Alert>
      </Container>
    </ChakraProvider>
    <WeekProvider>

      <Router>
        <div className="App">
            <div className="PageContent">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/month" element={<MonthPage />} />
                <Route path="/week" element={<WeekPage />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
=

            </div>

        </div>

      </Router>
      
    </WeekProvider>
    </EventProvider>
  ) : ( (loggedIn === 'false') || (loggedIn == null)) ? (
    <EventProvider>
      <WeekProvider>

      <Router>

        <div className="App">

            <div className="PageContent">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/month" element={<MonthPage />} />
                <Route path="/week" element={<WeekPage />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/logout" element={<Logout />} />
                
              </Routes>


            </div>

        </div>

      </Router>
      </WeekProvider>
    </EventProvider>
      

  ) : ( loggedIn == 'true')  ? (

    <EventProvider>
      <WeekProvider>
      <Router>

        <div className="App">

            <div className="PageContent">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/month" element={<MonthPage />} />
              <Route path="/week" element={<WeekPage />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>

            </div>

        </div>

      </Router>
      
    </WeekProvider>
  </EventProvider>

  ) :
    <>

      <h1>You have disabled notifications</h1>
    </>



}


export default App;