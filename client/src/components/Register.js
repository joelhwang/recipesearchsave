import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { SetIsLoggedContext } from '../App';
import FlashMessage from 'react-flash-message';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [message, setMessage] = useState(null);
    const setIsLogged = useContext(SetIsLoggedContext);
    let navigate = useNavigate();

    //post request for register page
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setMessage(null);
        
        try{
           const result = await Axios({
                method: 'POST',
                data:{
                    username: username,
                    password: password,
                    verifyPassword: verifyPassword
                },
                url: "/api/register",
            });
            
            if(result.data.message){
                setMessage(result.data.message)
                return;
            }
            if(result.data){
                setMessage(result.data)
                return;
            }
            setIsLogged(true);
            navigate('/search');
            
        }catch (err){
            console.log(err);
            navigate('/register');
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
                <h1 className = 'form-header'>Register</h1>
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
                <section className = 'input'>
                    <label>Re-enter Password </label>
                    <input 
                        type="password" 
                        value={verifyPassword}
                        onChange={(e)=> setVerifyPassword(e.target.value)}
                        minLength="8" 
                        required
                    />  
                </section>
                <button className = 'submit-btn'>Submit</button>
            </form>
        </div>
     );
}
 
export default Register;