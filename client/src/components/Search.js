import RecipeFetch from '../RecipeFetch';
import { useContext, useState, useEffect } from 'react';
import {UrlContext, SetUrlContext, SetIsPrevContext, IsPrevContext} from '../App.js'

const Search = () => {
    const { REACT_APP_EDAMAM_ID, REACT_APP_EDAMAM_KEY } = process.env;
    const [ingredient, setIngredient] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [dietType, setDietType] = useState('');
    const [exclusiveDiet, setExclusiveDiet] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [mealType, setMealType] = useState('');
    const [dishType, setDishType] = useState('');
    const [url, setUrl] = useState('');
    const prevUrl = useContext(UrlContext);
    const setPrevUrl = useContext(SetUrlContext);
    const isPrev = useContext(IsPrevContext);
  
    //isPrev will be true if a user clicke the 'back to search results' button on a recipe's details page
    //prevUrl is a global variable that is set when a search is initiated to store the fetch url of the last search.
    //Thus, if a user clicks the 'back to search results' button on a recipe's details page, the app will know the fetch url.
    useEffect(() =>{
        if(isPrev && prevUrl != null){
            setUrl(prevUrl);
        }
    }, []);

    const handleSubmit = (e) =>{
        e.preventDefault();
        
        //tempUrl concatenates filters and sets the url at the end to prevent re-render everytime a single filter is set
        //this avoids making too many edamam api requests (I am on the free tier)
        let tempUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${ingredient}&app_id=${REACT_APP_EDAMAM_ID}&app_key=${REACT_APP_EDAMAM_KEY}`

        if(dietType !== ''){
            tempUrl=tempUrl.concat(`&diet=${dietType}`);
        }
        if(exclusiveDiet !== ''){
            tempUrl=tempUrl.concat(`&health=${exclusiveDiet}`);
        }
        if(cuisineType !== ''){
            tempUrl=tempUrl.concat(`&cuisineType=${cuisineType}`);
        }
        if(mealType !== ''){
            tempUrl=tempUrl.concat(`&mealType=${mealType}`);
        }
        if(dishType !==''){
            tempUrl=tempUrl.concat(`&dishType=${dishType}`)
        }
        setPrevUrl(tempUrl);
        setUrl(tempUrl);
        
    }


    const handleClick = ()=>{
        if(!expanded){
            setExpanded(true);
            return;
        }
        if(expanded){
            setExpanded(false);
            return;
        }
    }

    return ( 
        <div>
            <div className='search'>
                <h1>Enter an Ingredient</h1>
                <form onSubmit = {handleSubmit}>
                    <section className = 'basic-search'>
                        <input
                            type="text" 
                            value = {ingredient} 
                            onChange= {(e)=> setIngredient(e.target.value)}
                            required
                        />
                        <button className = 'basic-btn'>Search Recipes</button>
                    </section>
                </form>
                {expanded && (
                    <section className = 'filter-toggle'>
                        <span className='filter-text' onClick={handleClick}>Hide Filters</span>
                        <span className='symbol'> &#10548;</span>
                    </section>
                )}
                {!expanded && (
                    <section className = 'filter-toggle'>
                        <span className='filter-text' onClick={handleClick}>Show Filters</span>
                        <span className='symbol'> &#10549;</span>
                    </section>
                )}
                    
                {expanded &&(
                    <div className='filters'>
                        <section>
                            <label>Diet Type </label>
                            <select value={dietType} onChange= {(e)=> setDietType(e.target.value)}>
                                <option value="">---</option>
                                <option value="balanced">balanced</option>
                                <option value="high-fiber">high-fiber</option>
                                <option value="high-protein">high-protein</option>
                                <option value="low-carb">low-carb</option>
                                <option value="low-fat">low-fat</option>
                                <option value="low-sodium">low-sodium</option>
                            </select>
                        </section>
                        
                        <section>
                            <label>Exclusive Diet Type </label>
                            <select value={exclusiveDiet} onChange= {(e)=> setExclusiveDiet(e.target.value)}>
                                <option value="">---</option>
                                <option value="alcohol-cocktail">alcohol-cocktail</option>
                                <option value="alcohol-free">alcohol-free</option>
                                <option value="celery-free">celery-free</option>
                                <option value="crustacean-free">crustacean-free</option>
                                <option value="dairy-free">dairt-free</option>
                                <option value="DASH">DASH</option>
                                <option value="egg-free">egg-free</option>
                                <option value="fish-free">fish-free</option>
                                <option value="fodmap-free">fodmap-free</option>
                                <option value="gluten-free">gluten-free</option>
                                <option value="immuno-supportive">immuno-supportive</option>
                                <option value="keto-friendly">keto-friendly</option>
                                <option value="kidney-friendly">kidney-friendly</option>
                                <option value="kosher">kosher</option>
                                <option value="low-fat-abs">low-fat-abs</option>
                                <option value="low-potassium">low-potassium</option>
                                <option value="low-sugar">low-sugar</option>
                                <option value="lupine-free">lupine-free</option>
                                <option value="Mediterranean">miditerranean</option>
                                <option value="mollusk-free">mollush-free</option>
                                <option value="mustard-free">mustard-free</option>
                                <option value="no-oil-added">no oil added</option>
                                <option value="paleo">paleo</option>
                                <option value="peanut-free">peanut-free</option>
                                <option value="pescatarian">pescatarian</option>
                                <option value="pork-free">pork-free</option>
                                <option value="red-meat-free">red-meat-free</option>
                                <option value="sesame-free">sesame-free</option>
                                <option value="shellfish-free">shellfish-free</option>
                                <option value="soy-free">soy-free</option>
                                <option value="sugar-conscious">sugar-conscious</option>
                                <option value="sulfite-free">sulfite-free</option>
                                <option value="tree-nut-free">tree-nut-free</option>
                                <option value="vegan">vegan</option>
                                <option value="vegetarian">vegetarian</option>
                                <option value="wheat-free">wheat-free</option>
                            </select>
                        </section>

                        <section>
                            <label>Cuisine Type </label>
                            <select value={cuisineType} onChange= {(e)=> setCuisineType(e.target.value)}>
                                <option value="">---</option>
                                <option value="American">American</option>
                                <option value="Asian">Asian</option>
                                <option value="British">British</option>
                                <option value="Caribbean">Caribbean</option>
                                <option value="Central Europe">Central Europe</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Eastern Europe">Eastern Europe</option>
                                <option value="French">French</option>
                                <option value="Indian">Indian</option>
                                <option value="Italian">Italian</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Middle Eastern">Middle Eastern</option>
                                <option value="Nordic">Nordic</option>
                                <option value="South American">South American</option>
                                <option value="South East Asian">South East Asian</option>
                            </select>
                        </section>

                        <section>
                            <label>Meal Type </label>
                            <select value={mealType} onChange= {(e)=> setMealType(e.target.value)}>
                                <option value="">---</option>
                                <option value="Breakfast">breakfast</option>
                                <option value="Lunch">lunch</option>
                                <option value="Dinner">dinner</option>
                                <option value="Snack">snack</option>
                                <option value="Teatime">teatime</option>
                            </select>
                        </section>

                        <section>
                            <label>Dish Type </label>
                            <select value={dishType} onChange= {(e)=> setDishType(e.target.value)}>
                                <option value="">---</option>
                                <option value="Biscuits and Cookies">Biscuits and Cookies</option>
                                <option value="Bread">bread</option>
                                <option value="Cereals">cereals</option>
                                <option value="Condiments and sauces">condiments and sauces</option>
                                <option value="Desserts">desserts</option>
                                <option value="Drinks">drinks</option>
                                <option value="Main Course">main course</option>
                                <option value="Pancake">pancake</option>
                                <option value="Preps">preps</option>
                                <option value="Preserve">preserve</option>
                                <option value="Salad">salad</option>
                                <option value="Sandwiches">sandwiches</option>
                                <option value="Side dish">side dish</option>
                                <option value="Soup">soup</option>
                                <option value="Starter">starter</option>
                                <option value="Sweets">sweets</option>
                            </select>
                        </section>
                    </div>
                )}
            </div>
            <RecipeFetch url={url}/>
        </div>
     );
}
 
export default Search;