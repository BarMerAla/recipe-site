import { useEffect, useState} from 'react';
import axios from 'axios';
import PopularRecipesCard from './PopularRecipesCard';

export default function RightSidebar() {
    const [popular, setPopular] = useState([]);
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        axios.get(`${API}/recipes/popular/`)
        .then(res => setPopular(res.data))
        .catch(err => {
            console.error("Ошибка загрузки популярных рецептов", err)
        });
    }, []);

    return (
        <div className='fixed top-20 z-10 right-4 w-110 p-4 rounded-xl ml-6'>
            <h2 className="text-xl font-bold mb-4 text-amber-800">Популярные рецепты</h2>
            {popular && popular.length > 0 ? (
                popular.map(recipe => (
                <PopularRecipesCard key={recipe.id} recipe={recipe} />
            ))
            ) : (
                    <div>Нет популярных рецептов</div>
                )}
            </div>
        )
}