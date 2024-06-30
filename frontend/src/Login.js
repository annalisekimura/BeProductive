import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import './login.css'
import myImage from './icons8-rainbow-48.png';
import pencil from './icons8-pencil-48.png';
import notebook from './icons8-notebook-64.png';
import postIt from './icons8-post-it-64.png';
import heart from './icons8-heart-80.png';
import clock from './icons8-clock-48.png';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    //handle login

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/login', {email, password})
        .then(res => {
            console.log(res);
            if(res.data == 'No record') {
                navigate('/login');
            } else if(res.data.success) {
                localStorage.setItem('loggedIn', res.data.success);
                localStorage.setItem('user', res.data.user);
                localStorage.setItem('token', res.data.token);
                navigate('/home');
            }

        })
        .catch(err => console.log(err));

    }

    //handle sign-up

    function handleSignup(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/register', { email, password })
            .then(res => {
                console.log(res);
                if (res.data.success) {
                    alert('Registration successful!');
                    // Optionally, you can automatically log in the user after signup
                    localStorage.setItem('loggedIn', true);
                    localStorage.setItem('user', email); // Assuming email is used as user identifier
                    // Assuming your backend sends a token for authentication
                    localStorage.setItem('token', res.data.token);
                    navigate('/home');
                }
            })
            .catch(err => console.log(err));
    }


  return (
    <div>
        <div className='containerLog'>
            <h1 className='header'>
                BeProductive
            </h1>
            <img src={myImage} alt="Rainbow" className="rainbow-image" />
            <img src={pencil} alt="Pencil" className="pencil-image" />
            <img src={notebook} alt="Noteboook" className="notebook-image" />
            <img src={postIt} alt="PostIt" className="postIt-image" />
            <img src={clock} alt="Clock" className="clock-image" />
            <img src={heart} alt="Heart" className="heart-image" />
            <form id="hello" onSubmit={handleSubmit}>
                <div className='enterUser'>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                        placeholder='Enter Email'
                        className='form-control'
                        id='email'
                        onChange={e => setEmail(e.target.value)}
                    />
                    
                </div>
                <div className='enterPas'>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder='Enter Password'
                        className='form-control'
                        id='password'
                        onChange={e => setPassword(e.target.value)}
                    />
                    
                </div>
                <button type='submit' className='btn'>Login</button>
                <div className='Or'>
                    ------------------ or ------------------
                </div>
                <button onClick={handleSignup} className='btn2'>Sign Up</button>
                
            </form>


        </div>
        
    </div>
  )
}

export default Login