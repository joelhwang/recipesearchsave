import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    return ( 
        <div className = 'home-background'> 
            <section className = 'home-component'>
                <h1 className = 'home-title'>Welcome to Recipe Search and Save</h1>
                <section className = 'home-btns'>
                    <Link className='home-search-btn' to="/search">Search for Recipes</Link>
                    <Link className='home-account-btn' to="/login">Login</Link>
                    <Link className='home-account-btn' to="/register">Register</Link>
                </section>
            </section>
        </div>
     );
}
 
export default Home;