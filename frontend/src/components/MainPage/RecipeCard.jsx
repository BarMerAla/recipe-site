import appetizer from '../../icons/appetizer.png'
import breakfast from '../../icons/breakfast.png'
import dessert from '../../icons/dessert.png'
import hot_meal from '../../icons/hot_meal.png'
import soups from '../../icons/soups.png'
import bakery from '../../icons/bakery.png'
import clock from '../../icons/clock.png'
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast } from 'react-toastify';


export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL || '';


    const handleSave = async (recipeId) => {   // сохраняем рецепт в избранные в личный кабинет
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API}/saved-recipes/`, 
                { recipe_id: recipeId },
                { headers: {
                    Authorization: `Token ${token}`
                }},
            );
            toast("Рецепт сохранен!");
        } catch (error) {
            console.log("AXIOS ERROR:", error.response);
            let msg = "Ошибка сохранения!";
            const data = error.response?.data;
            if (Array.isArray(data) && data.length > 0) {
                msg = data[0];
            } else if (typeof data === "string") {
                msg = data;
            } else if (data?.detail) {
                msg = data.detail;
            } else if (data?.non_field_errors && data?.non_field_errors.length) {
                msg = data.non_field_errors[0];
            } else if (data && Object.values(data).length) {
                msg = Object.values(data).flat()[0];
            } else if (error.message) {
                msg = error.message;
            }
            toast(msg);
        }
    } 


    const categoryIcons = {
        "Завтраки": breakfast,
        "Закуски": appetizer,
        "Вторые блюда": hot_meal,
        "Супы": soups,
        "Десерты": dessert,
        "Выпечка": bakery,
    }

    return (
        <div className="flex bg-white rounded-1xl shadow-md overflow-hidden max-w-2xl mx-auto border-1 border-green-300 mb-5 ml-70">

            {/* Блок с картинкой */}
            <div className="w-1/3 flex flex-col items-center">
                <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover rounded-1xl mb-4"/>
                {/* Кнопки */}
                <div className="flex flex-col w-full gap-4">
                    <button className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-3 rounded-1xl transition"
                        onClick={() => handleSave(recipe.id)}> 
                        Сохранить рецепт
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-1xl transition"
                        onClick={() => navigate(`/recipes/${recipe.id}`)}>
                        Посмотреть рецепт 
                    </button>
                </div>
            </div>

            {/* Блок с описанием */}
            <div className="w-2/3 p-5 flex flex-col justify-start">
                <div>
                    <span title={recipe.name} className="truncate max-w-[600px] block text-2xl font-semibold mb-3 line-clamp-1">{recipe.name}</span>
                    <p className="text-base mb-3 text-gray-700 line-clamp-3">{recipe.description}</p>
                    <div className="space-y-1 text-base text-gray-600">
                        <div>
                            <span className="font-medium">Ингредиенты: </span>
                            <span title={recipe.ingredients} className="line-clamp-2 text-xs">{recipe.ingredients.replace(/\n/g, ', ')}</span>
                        </div>
                        <div>
                            <span className="font-medium">Автор: </span>
                            <span>{recipe.author.username}</span>
                        </div>
                        <div>
                            <span className="font-medium">Дата публикации: </span>
                            <span>
                                {format(new Date(recipe.published), "d MMMM yyyy, HH:mm", { locale: ru })}
                            </span>
                        </div>
                        <div className="flex items-center gap-x-10">
                            <div className="flex items-center gap-2 mt-5">
                                <img src={categoryIcons[recipe.category.name] || appetizer} className='h-8' alt={recipe.category.name} />
                                {/* || appetizer — если нет подходящей, используется дефолтная иконка appetizer */}
                                <span>{recipe.category.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-5">
                                <img src={clock} className='h-8' alt={'Clock'} />
                                <span>{recipe.cooking_time} мин</span>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}