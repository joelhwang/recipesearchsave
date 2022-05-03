import { BrowserRouter as Router, Route, Routes, Outlet} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Search from './components/Search';
import MyRecipes from './components/MyRecipes';
import Details from './components/Details';
import React from 'react';
export const UrlContext = React.createContext(null);
export const SetUrlContext = React.createContext(null);
export const IsPrevContext = React.createContext(null);
export const SetIsPrevContext = React.createContext(null);
export const IsLoggedContext = React.createContext(null);
export const SetIsLoggedContext = React.createContext(null);

function App() {
  const [prevUrl, setPrevUrl] = useState(null);
  const [isPrev, setIsPrev] = useState(false);
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    fetchIsLogged();
  }, []);

  const fetchIsLogged = async() => {
    try{
        const data = await fetch('/api/isLogged')
        const logged = await data.text();
        console.log(logged);
        if(logged ==='true'){
          setIsLogged(true);
        }
        if(logged === 'false'){
          setIsLogged(false);
        }
    }
    catch(err){
        console.log(err.message);
    }
  }

  return (
    <Router>
    <div className="App">
      <UrlContext.Provider value={prevUrl}>
      <SetUrlContext.Provider value={setPrevUrl}>
      <IsPrevContext.Provider value={isPrev}>
      <SetIsPrevContext.Provider value={setIsPrev}>
      <IsLoggedContext.Provider value={isLogged}>
      <SetIsLoggedContext.Provider value={setIsLogged}>
      <Navbar/>
      <div className="body">
        <Routes>
          <Route path = '/' element={<Home/>}/>
          <Route path = '/search' element={<Search/>}/>
          <Route path = '/register' element={<Register/>}/>
          <Route path = '/login' element={<Login/>}/>
          <Route path = '/myrecipes' element={<MyRecipes/>}/>
          <Route path = '/details' element={<Details/>}/>
        </Routes>
      </div>
      </SetIsLoggedContext.Provider>
      </IsLoggedContext.Provider>
      </SetIsPrevContext.Provider>
      </IsPrevContext.Provider>
      </SetUrlContext.Provider>
      </UrlContext.Provider>
    </div>
  </Router>

  );
}

export default App;
