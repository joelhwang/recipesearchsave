import { useState, useEffect} from 'react';
import Axios from 'axios';

const MyRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [paginatedRecipes, setPaginatedRecipes] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [expandedId, setExpandedId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [numRecipes, setNumRecipes] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    useEffect(() => {
        handlePagination(1);
    }, [savedRecipes]);


    const fetchSavedRecipes = async()=>{
        try{
            const result = await Axios({
                method: 'GET',
                url: "/api/getSavedRecipes",
            })
            setSavedRecipes(result.data);
            setNumRecipes(result.data.length);
            setNumPages(Math.ceil(result.data.length/10));
            setIsLoading(false);    
        } catch (err){
            console.log(err);
        }

    }

    const handleDelete = async(e, id) =>{
        e.preventDefault();
        try{
            await Axios({
                method: 'POST',
                data:{
                    recipeId:id
                },
                url: "/api/deleteRecipe",
            });
            fetchSavedRecipes();
        }catch (err){
            console.log(err);
        }
    }

    const handleClick = (id)=>{
        if(!expanded){
            setExpanded(true);
            console.log(numRecipes);
            console.log(numPages);
            return;
        }
        if(expanded && expandedId === id){
            setExpanded(false);
            return;
        }
    }

    const handleLink = (url) =>{
        window.open(url);
    }

    const handlePagination = (page) =>{
        const startIndex = (page - 1) * 10;
        const endIndex = page * 10;
        const paginatedList = savedRecipes.slice(startIndex, endIndex);
        setPaginatedRecipes(paginatedList);
        window.scrollTo(0, 0);
    }

    const renderPagination = () =>{
        let pageList = [];
        for(let i=1;i<=numPages;i++){
            pageList.push(<span
                className = 'page-num' 
                key = {i}
                onClick = {()=>{
                    handlePagination(i);
                    setCurrentPage(i);
                }}
                >{i}</span>)
        }
        return pageList;
    }

    return ( 
        <div>
            <h1 className = 'my-recipes-title'>My Recipes</h1>
            {numRecipes === 0 &&(
                <h2 className = 'recipes-found'>No Recipes Saved</h2>
            )}
            {isLoading && numRecipes > 0 &&( 
            <h1 className = 'loading'>...Loading</h1>
            )}
            {!isLoading &&  numRecipes > 0 &&(
            <div className='my-recipe-list'>
                <p className = 'current-page'>Page {currentPage} of {numPages}</p>
                {paginatedRecipes.map((recipe)=>(
                    <article className = 'my-recipe-card' key={recipe._id}>
                        <section className='header'>
                            <h2 className = 'title'>{recipe.label}</h2>
                            <button className = 'header-btn'
                                onClick = {(e)=>{
                                    handleDelete(e, recipe._id);
                                }}>Delete</button>
                        </section>
                        <section className = 'my-recipes-preview'>
                            <img src={recipe.image}/>
                            <section className = 'my-health-labels'>
                                {recipe.healthLabels.map((label)=>(
                                    <p className = 'my-health-label'>{label} </p>                    
                                ))}
                            </section>
                        </section>
                        {expanded && expandedId===recipe._id &&(
                            <h4
                            className = 'expand'
                            onClick = {() =>{
                                handleClick(recipe._id);
                                setExpandedId(recipe._id);
                            }}
                            >Click to Shrink</h4>
                        )}

                        { (!expanded || expandedId !== recipe._id) &&(
                        <h4
                        className = 'expand'
                        onClick = {() =>{
                            handleClick(recipe._id);
                            setExpandedId(recipe._id);
                        }}
                        >Click to Expand</h4> 
                        )}
                        

                        { expanded && expandedId===recipe._id && (
                            <div>
                                <section>
                                    <h2>Ingredients</h2>
                                    {recipe.ingredients.map((ingredient)=>(
                                        <li className="ingredients">{ingredient}</li>
                                    ))}
                                    <button className = 'recipe-url' onClick = {()=>{handleLink(recipe.url)}}>View Full Instructions</button> 
                                </section>
                            </div>
                        )}
                    </article>
                ))}
                <section className = 'my-pagination'>
                    {renderPagination()}
                </section>
            </div>
            )}
        </div>
     );
}
 
export default MyRecipes;