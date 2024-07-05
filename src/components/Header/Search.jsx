import React from "react";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


function Search( ) {
    
    
    
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const search = (data) => {
        const query = data?.query;
        navigate(`/search/${query}`);
    };
 
//    console.log(Search)
 
   
   
    
    

    return (
        <>
            <form   onSubmit= {handleSubmit(search)}>
                <Input
                    placeholder="Search"
                    {...register("query", { required: true })}
                    className = {"rounded-lg border-2 border-gray-600"}
                />
            </form>
        </> 
    );
}

export default Search;