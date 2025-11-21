import { useEffect, useState } from "react";

const UseFetch = (url) =>{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        fetch(url)
        .then(res => res.json())
        .then(data => {
            setData(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err);
            setLoading(false);
        })
    },[url])
    return {
        data,
        loading,
        error
    }
}

export default UseFetch;