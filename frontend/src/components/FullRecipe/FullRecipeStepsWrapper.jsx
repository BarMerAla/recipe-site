import { useEffect, useState } from "react";
import { useParams } from "react-router";
import FullRecipeSteps from "./FullRecipeSteps";
import axios from "axios";

export default function FullRecipeStepsWrapper() {
    const { id } = useParams();
    const [recipeSteps, setRecipeSteps] = useState(null);
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        let url = `${API}/recipes/`

        axios.get(`${url}${id}/steps/`)
        .then(res => setRecipeSteps(res.data));
    }, [id]);

    if (!recipeSteps) return <div>...Загрузка</div>;
    return <FullRecipeSteps recipeSteps={recipeSteps} />;
}