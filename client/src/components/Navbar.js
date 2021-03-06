import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { IsLoggedContext, SetIsLoggedContext } from '../App';

const Navbar = () => {
    //global variables for checking whether a user is logged
    //depending on isLogged, certain options will be displayed in the navbar
    const isLogged = useContext(IsLoggedContext);
    const setIsLogged = useContext(SetIsLoggedContext);
    const navigate = useNavigate();

    const handleLogout = async() => {
        await fetch("/api/logout")
        .catch(err => {
            console.log(err);
        });
        setIsLogged(false);
        navigate('/');
    };

    return (
        <nav className='navbar'>
            <h1>Recipe Search & Save</h1>
            <div className='links'>
                <Link to ="/search" className='search-link'>Search</Link>
                {!isLogged && (
                    <span>
                        <Link to="/login" className='login-link'>Login</Link>
                        <Link to="/register" className='register-link'>Register</Link>
                    </span>
                )}
                {isLogged &&(   
                    <span>
                        <Link to ="/myrecipes" className='my-recipes-link'>My Recipes</Link>
                        <span className = 'logout-btn' onClick={handleLogout}>Logout</span>
                    </span>
                )}
            </div>
        </nav>
     );
}
 
export default Navbar;