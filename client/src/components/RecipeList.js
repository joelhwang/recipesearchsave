import { useNavigate } from 'react-router-dom'

const RecipeList = ({data}) => {
    let navigate = useNavigate();

    //passes recipe data from search results to recipe details page
    const navigateDetails = (recipeData)=>{
        navigate('/details', {state:{recipe:recipeData}});
    }

    return ( 
        <div>
            {data.hits.length === 0 &&(
                <h2 className='recipes-found'>No Recipes Found</h2>
            )}
            {data.hits.length > 0 &&(
                <div>
                    <h2 className = 'recipes-found'>Recipes Found</h2>
                    <div className='search-results'>
                        {data.hits.map((hit)=>(
                            <article className = 'recipe-card' key={hit.recipe.uri}>
                                <h2>{hit.recipe.label}</h2>
                                <section className = 'preview'>
                                    <img src={hit.recipe.image}/>
                                    <h4 className = 'details-link' onClick={()=>{navigateDetails(hit)}}>View Details</h4>
                            </section>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default RecipeList;