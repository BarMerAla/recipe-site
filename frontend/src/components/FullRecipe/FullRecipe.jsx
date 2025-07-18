import appetizer from '../../icons/appetizer.png'
import breakfast from '../../icons/breakfast.png'
import dessert from '../../icons/dessert.png'
import hot_meal from '../../icons/hot_meal.png'
import soups from '../../icons/soups.png'
import bakery from '../../icons/bakery.png'
import clock from '../../icons/clock.png'
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import FullRecipeStepsWrapper from '../FullRecipe/FullRecipeStepsWrapper'
import CommentsWrapper from '../Comments/CommentsWrapper'
import AddComment from '../Comments/AddComment'
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function FullRecipe({ recipe }) {
    const [comments, setComments] = useState([]);
    const API = import.meta.env.VITE_API_URL || '';

    const fetchComments = async (e) => {
        try {
            const res = await axios.get(`${API}/recipes/${recipe.id}/comments/`);
            setComments(res.data);
        } catch (err) {
            console.error("Ошибка загрузки комментариев", err);
        }
    };

    useEffect(() => {
        if (!recipe?.id) {
            fetchComments()
        }
    }, [recipe?.id]);
    

    const categoryIcons = {
            "Завтраки": breakfast,
            "Закуски": appetizer,
            "Вторые блюда": hot_meal,
            "Супы": soups,
            "Десерты": dessert,
            "Выпечка": bakery,
        }

    const ingredients = recipe.ingredients
        ? recipe.ingredients.split(/\n|,|\r/).map((item, idx) => item.trim()).filter(Boolean)
        : [];

    return (
            <div className="max-w-2xl mx-auto mb-8 mt-3 ml-70 bg-lime-50 rounded-xl">
                 {/* Название и основное описание */}
                <h2 className="text-2xl font-semibold mb-5 text-green-900 text-center">{recipe.name}</h2>

                {/* Блок с кратким описанием на фоне */}
                <div className="bg-lime-100 rounded-xl p-5 mb-7 text-lg text-gray-800 shadow">
                    {recipe.description}
                </div>
                        
                <div className="flex gap-8 flex-col md:flex-row">
                    
                    {/* Левая часть: ингредиенты, инфо */}
                    <div className="md:w-1/2 w-full ml-5">
                        <h3 className="text-xl font-semibold mb-3 text-lime-900">Ингредиенты</h3>
                        <ul className="mb-6 pl-5 list-disc text-base space-y-1">
                            {ingredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            ))}
                        </ul>

                        {/* Доп. инфа (иконки, время, категория) */}
                        <div className="flex flex-wrap items-center gap-6 mb-4 text-gray-700">
                            <div className="flex items-center gap-2">
                                <img src={categoryIcons[recipe.category?.name] || appetizer} className="h-6" alt="Категория"/>
                                <span className="font-medium">{recipe.category?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={clock} className="h-6" alt="Время"/>
                                <span className='font-medium'>{recipe.cooking_time} мин</span>
                            </div>     
                        </div>           
                        <div className="text-base text-gray-700 font-semibold mb-2">
                                Автор: <span className="font-normal">{recipe.author?.username}</span>
                        </div>
                        <div className="text-base text-gray-700 font-semibold mb-2">
                            Дата публикации:{" "}
                            <span className='font-normal'>
                                {format(new Date(recipe.published), "d MMMM yyyy, HH:mm", { locale: ru })}
                            </span>
                        </div>
                    </div>
                        {/* Правая часть: фото */}
                        <div className="md:w-1/2 w-full flex flex-col items-center">
                            <h3 className="text-xl font-semibold mb-3 text-lime-900">Фото готового блюда</h3>
                            <img
                                src={recipe.image}
                                alt={recipe.name}
                                className="w-full max-w-md object-cover rounded-2xl shadow"
                                style={{maxHeight: 200, maxWidth: 350, background: "#f2f2f2"}}
                            />
                        </div>
                    </div>
                    <div>
                        <FullRecipeStepsWrapper />
                    </div> 
                    <div>
                        <AddComment recipeId={recipe.id} onCommentAdded={fetchComments} />
                    </div>
                    <div>
                        <CommentsWrapper  />
                    </div> 
            </div>
        );
}