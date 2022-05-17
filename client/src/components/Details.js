import { useState, useEffect, useContext} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Axios from 'axios';
import {SetIsPrevContext, IsLoggedContext} from '../App.js';

const Details = () => {
    const [savedRecipeNames, setSavedRecipeNames] = useState([]);
    const [addText, setAddText] = useState('Add to Recipes');
    const [addStyle, setAddStyle] = useState('header-btn');
    const {state} = useLocation();
    const recipe = state.recipe.recipe;
    const setIsPrev = useContext(SetIsPrevContext);
    const [disabled, setDisabled] = useState(false);
    let navigate = useNavigate();
    const isLogged = useContext(IsLoggedContext);

    useEffect(() => {
        fetchSavedRecipeNames();
        window.scrollTo(0, 0);
    }, []);

    //fetches saved recipe names
    //for disabling the 'save to recipes' button when the current user already has it saved
    const fetchSavedRecipeNames = async()=>{
        try{
            const result = await Axios({ 
                method: 'GET',
                url: "/api/getSavedRecipeNames",
            })
            setSavedRecipeNames(result.data);
        }
        catch(err){
            console.log(err.message);
        }
    }

    //saves currently viewed recipe to list
    const handleSaveRecipe = async(recipe) =>{
        try{
            await Axios({
            method: 'POST',
            data:{
                recipeData: recipe,
            },
            url: "/api/saveRecipe",
            })
        }
        catch(err){
            console.log(err.message);
        }
    }

    //opens link to external site that has the full recipe instructions
    const handleLink = (url) =>{
        window.open(url);
    }
    
    //Navigates back to previous search results
    //IsPrev is a global variable that is set to true so that the app knows that there are 
    //previous search results when redirecting to search page 
    const navigatePrev = ()=>{
        setIsPrev(true);
        navigate('/search');
    }

    return ( 
        <div className='recipe-details'>
            <section className='details'>
                <section className='back-btn'>
                    <span>&#8592;</span>
                    <p className = 'prev-search' onClick={()=>{navigatePrev()}}> Back to Search Results</p>
                </section>
                <section className = 'header'>
                    <h1 className='detail-title'>{recipe.label}</h1>
                    {/* if user does not already have the currently viewed recipe in their list,
                    show button with initial style and not disabled.
                    Upon clicking add, style changes to the 'already-added' and button is disabled */}
                    {isLogged && (!savedRecipeNames.includes(recipe.label)) &&
                        <button 
                            className = {addStyle} 
                            disabled = {disabled}
                            onClick ={()=>{
                                handleSaveRecipe(recipe);
                                setAddText('Added');
                                setAddStyle('already-added');
                                setDisabled(true);
                            }}
                        >{addText}</button>
                    }
                    {isLogged && (savedRecipeNames.includes(recipe.label)) && 
                        <button disabled = 'true' className = 'already-added'>Added</button>
                    }
                </section>
                <img src={recipe.image} />
                <section className = 'health-labels'>
                    {recipe.healthLabels.map((label)=>(
                        <p className = 'health-label'>{label} </p>                    
                    ))}
                </section>
                <section className = 'ingredient-section'>
                    <h2>Ingredients</h2>
                    {recipe.ingredients.map((ingredient)=>(
                        <li className="ingredients" key={ingredient.food}>{ingredient.text}</li>
                    ))}
                </section>
                <button className = 'recipe-url' onClick = {()=>{handleLink(recipe.url)}}>View Full Instructions</button>                 
            </section>
            
        </div>
     );
}
 
export default Details;