import { useRef, useEffect } from "react";

//checks whether a component is mounted yet
const useComponentDidMount = () => {
    const ref = useRef();
    useEffect(() => {
        ref.current = true;
    }, []);

    return ref.current;
}
 
export default useComponentDidMount;