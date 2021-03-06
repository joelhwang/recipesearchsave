import { useState, useEffect, useContext } from 'react';
import RecipeList from './components/RecipeList';
import useComponentDidMount from './useComponentDidMount';
import { SetIsPrevContext} from './App.js'

const RecipeFetch = ({url}) =>{
    const isComponentMounted = useComponentDidMount();
    const [data, setData] = useState(null);
    const [paginatedUrl, setPaginatedUrl] = useState('');
    const [prevUrl, setPrevUrl] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const setIsPrev = useContext(SetIsPrevContext);

    useEffect(() =>{
        setIsPrev(false);
        //only fetches data from api if component is already mounted
        //prevents fetch on initial render when there is no user input
        if(isComponentMounted){
            fetchApi();
        }
    }, [url]);

    useEffect(() =>{
        if(isComponentMounted){
            fetchNextApi();
            window.scrollTo(0, 0);
        }
    }, [paginatedUrl]);

    //fetches data from edamam recipe api
    const fetchApi = async ()=>{
        setIsLoading(true);
        const result = await fetch(url);
        const fetchData = await result.json();
        setData(fetchData);
        setIsLoading(false);
    }

    //pagination for recipes is a simple implmentation where there is only next and prev options
    //current page is tracked with a counter function
    //A navigation bar that displays all the page numbers is not implemented due to limitations to edamam api fetches.
    const counter = (n) =>{
        const currentPage = pageNumber;
        if(n===1){
            setPageNumber(currentPage + 1);
        }
        if(n===-1 && currentPage!==0){
            setPageNumber(currentPage - 1);
        }
    }

    const nextPage = ()=>{
        if(data._links.next.href){
            if(prevUrl === ''){
                setPrevUrl(url);
            }
            if(prevUrl !== ''){
                setPrevUrl(paginatedUrl);
            }
            counter(1);
            setPaginatedUrl(data._links.next.href);
        }
    }

    const prevPage = ()=>{
        if(pageNumber !== 1){
            counter(-1);
            setPaginatedUrl(prevUrl);
        }
    }

    const fetchNextApi = async ()=>{
        setIsLoading(true);
        const result = await fetch(paginatedUrl);
        const fetchData = await result.json();
        setData(fetchData);
        setIsLoading(false);
    }


    return(
        <div>
            {isLoading &&( 
            <h1 className = 'loading'>...Loading</h1>
            )}
            {!isLoading && data && <RecipeList data={data}/>}
            {!isLoading && data && data.hits.length>0 &&(
                <div className='pagination'>
                    <p className = 'pageNav' onClick={prevPage}>Previous</p>
                    <p className = 'pageNum'>{pageNumber}</p>
                    <p className = 'pageNav' onClick={nextPage}>Next</p>
                </div>
            )}
        </div>
    );
}

export default RecipeFetch;