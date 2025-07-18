import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchAll from "../MainPage/SearchAll";

export default function UserRecipes() {                 // список рецептов юзера
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const API = import.meta.env.VITE_API_URL || '';

     const filteredRecipes = recipes.filter(   // поиск по названию
        recipe => recipe.name.toLowerCase().includes(search.toLowerCase())
    );
   

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`${API}/my-recipes/`, {
            headers: { Authorization: `Token ${token}` }
        })
        .then(res => setRecipes(res.data));
        setLoading(false);
    }, []);

    return (
        <div className="mt-10 flex flex-col">
        <span className="text-2xl font-semibold mb-5 text-lime-900">Мои рецепты</span>
         {/* Поиск по своим рецептам */}
            <SearchAll placeholder="Искать свой рецепт..." onSearch={setSearch} />
            {loading ? (
                <div>...Загрузка</div>
            ) : (
                filteredRecipes.length === 0 ? (
                    <span className="ml-2 text-gray-400 mt-5 mb-7">У вас нет своих рецептов</span>
                ) : (
                        <div className="grid grid-cols-2 gap-4 mt-5 mb-10">
                        {filteredRecipes.map(recipe => (       
                            <div key={recipe.id} className="bg-white p-2 rounded-xl shadow flex flex-col items-center border-1 border-green-300">
                                <div>
                                    <span title={recipe.name} className="font-semibold text-lg mb-1 text-blue-900 line-clamp-2">
                                        {recipe.name}
                                    </span>
                                </div>
                                 
                                <div>
                                <img src={recipe.image} alt={recipe.name} className="h-30 w-60 object-cover rounded-xl mb-2 mt-3"
                                onClick={() => navigate(`/recipes/${recipe.id}`)}/>
                                </div>
                                
                                <button className="mt-3 mb-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-2 w-60 rounded shadow-lg"
                                onClick={() => navigate(`/recipes/${recipe.id}/update`)}
                                >
                                Изменить рецепт
                                </button>

                                <button className="mt-3 mb-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-2 w-60 rounded shadow-lg"
                                onClick={() => navigate(`/recipes/${recipe.id}/steps/update`)}
                                >
                                Изменить шаги рецепта
                                </button>
                            
                            </div>
                        ))}
                        </div>
                )
                )}
            </div>
    );
}