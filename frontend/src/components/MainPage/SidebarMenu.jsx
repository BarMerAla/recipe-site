import { useNavigate } from "react-router-dom";
import appetizer from '../../icons/appetizer.png'
import breakfast from '../../icons/breakfast.png'
import dessert from '../../icons/dessert.png'
import hot_meal from '../../icons/hot_meal.png'
import soups from '../../icons/soups.png'
import bakery from '../../icons/bakery.png'
import meal from '../../icons/meal.png'
import { useEffect, useState } from "react";
import axios from 'axios';


const icons = {
    "Все рецепты": meal,
    "Закуски": appetizer,
    "Завтраки": breakfast,
    "Вторые блюда": hot_meal,
    "Супы": soups,
    "Десерты": dessert,
    "Выпечка": bakery,
};


export default function SidebarMenu({ onCategorySelect }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        axios.get(`${API}/categories/`)
        .then(res => {
            console.log("Категории загружены:", res.data);
            const allRecipes = { id:null, name: "Все рецепты"};
            setCategories([allRecipes, ...res.data]);
        })
        .catch(err => 
            console.error("Ошибка загрузки категории..", err)
        );
    }, []);

    const handleClick = (id) => {
        if (onCategorySelect) onCategorySelect(id);
        navigate('/');
    };
    
    return (
        <aside className="fixed left-0 top-20 w-70 h-80 bg-white z-10">
            <div className="py-4 px-6">
                <h2 className="text-xl font-bold mb-4 text-green-600">Меню</h2>
                <ul>
                    {categories.map(cat => (
                        <li key={cat.id}
                        className={`cursor-pointer flex items-center gap-5 px-2 py-2 rounded-s mb-1 hover:bg-lime-100`}
                        onClick={()=> handleClick(cat.id)}
                        >
                        <img src={icons[cat.name]} alt={cat.name} className="w-6 h-6" />
                        <span>{cat.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}


