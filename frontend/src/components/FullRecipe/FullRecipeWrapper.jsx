import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FullRecipe from "./FullRecipe";
import axios from "axios";
import RightSidebar from "../MainPage/RightSidebar";

export default function FullRecipeWrapper() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const API = import.meta.env.VITE_API_URL || '';
   
    useEffect(() => {
        let url = `${API}/recipes/`

        axios.get(`${url}${id}/`)
        .then(res => setRecipe(res.data));
    }, [id]);

    if (!recipe) return <div>...Загрузка</div>;
    return (
        <div className='flex flex-row p-6'>
        <FullRecipe recipe={recipe} />
        <RightSidebar />
        </div>
    )

}