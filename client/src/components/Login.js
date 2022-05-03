import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { SetIsLoggedContext } from '../App';
import FlashMessage from 'react-flash-message';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const setIsLogged = useContext(SetIsLoggedContext);
    let navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setMessage(null);
        try{
            await Axios({
                method: 'POST',
                data:{
                    username: username,
                    password: password,
                },
                url: "/api/login",
            });
            setIsLogged(true);
            navigate('/search');
            
        }catch (err){
            console.log(`error: ${err}`)
            setMessage('Username or password is incorrect');
        }
        
    }

    return (
        <div>
            {message &&(
                <FlashMessage duration={5000} persistOnHover={true}>
                    <p className='error-msg'>{message}</p>
                </FlashMessage>  
            )}
            <form onSubmit={handleSubmit} className = 'user-form' >
                <p>{message}</p>
                <h1 className = 'form-header'>Login</h1>
                <section className = 'input'>
                    <label>Username </label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e)=> setUsername(e.target.value)}
                        minLength="6" 
                        required
                    /> 
                </section>
                <section className = 'input'>
                    <label>Password </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        minLength="8" 
                        required
                    />
                </section>
                <button className = 'submit-btn'>Submit</button>
            </form>
        </div> 
     );
}
 
export default Login;