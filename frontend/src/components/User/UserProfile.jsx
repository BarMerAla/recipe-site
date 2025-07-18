import { useEffect, useState } from "react";
import axios from "axios";
import UserComments from "../Comments/UserComments";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import UserRecipes from "./UserRecipes";
import avatar from '../../icons/default-avatar.avif';


export default function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [saved, setSaved] = useState([]);
    const navigate = useNavigate();
    const defaultAvatar = avatar;    // дефолтный аватар
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {      // Загрузка профиля
        const token = localStorage.getItem('token');
    
        if (!token) return;

        axios.get(`${API}/profile/me/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => setProfile(res.data))
        .catch(err => {
            console.error("Ошибка загрузки профиля: ", err.response?.data || err.message);
            setProfile(null);
    });
    }, []);

    useEffect(() => {      // Загрузка избранных рецептов
        const token = localStorage.getItem('token');
    
        if (!token) return;

        axios.get(`${API}/saved-recipes/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => setSaved(res.data))
        .catch(err => {
            console.error("Ошибка загрузки избранных рецептов: ", err.response?.data || err.message);
            setSaved([]);
    });
    }, []);

    
    const handleREmove = async (savedId) => {   // удаление рецепта из избранных
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API}/saved-recipes/${savedId}/`, 
                { headers: { Authorization: `Token ${token}` } }
            );
            setSaved(prev => prev.filter(item => item.id !== savedId));
            toast("Рецепт удален из избранных!");
        } catch (error) {
            toast("Ошибка удаления!");
        }
    }
    
    if (!profile) return <div>...Загрузка</div>;

    const profileRow = (label, value) => (
        <div className="text-xl font-semibold text-blue-900 mt-5 flex items-center">
            {label}:<span className="text-green-700 ml-20">
                {value?.trim() ? (value) : (
                    <span className="inline-block w-40 h-4 border-b border-gray-400 -ml-10 align-middle"></span>
                )}
            </span>
        </div>
    );

    return (
        <div className="flex gap-10 md:flex-row mt-10">

            <div className="md:w-1/5 w-full">
                    <img src={profile.avatar ? profile.avatar : defaultAvatar} 
                    alt="Аватар"
                    className="ml-10 w-45 h-45 rounded-full object-cover mb-7"
                    />

                <div>
                    <ul>
                    <span className="ml-10">Были в последний раз</span>
                    </ul>
                        <div className="ml-10 mt-5 italic font-medium">
                        {profile.last_login && (
                        new Date(profile.last_login).toLocaleString("ru-RU", {day: '2-digit', month: 'long', 
                            year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                        )} 
                        </div>                   
                </div>
            </div>

            <div className="flex-1 flex-col items-left">
                <div>
                {profileRow("Email", profile.email)}
                {profileRow("Телефон", profile.phone)}
                </div>

                <Link to="/create-recipe">
                    <button type="button" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-2 w-80 rounded shadow-lg mt-10">
                    Создать рецепт
                    </button>
                </Link>

                <Link to="/profile/update/">
                    <button type="button" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-2 w-80 rounded shadow-lg mt-10">
                    Настройки аккаунта
                    </button>
                </Link>

                <div className="mt-10 flex flex-col">
                <UserRecipes />
                <span className="text-2xl font-semibold mb-5 text-lime-900">Избранные рецепты</span>
                {saved.length === 0 ? (
                    <span className="ml-2 text-gray-400 mt-5 mb-7">Нет избранных рецептов</span>
                ) : (
                        <div className="grid grid-cols-2 gap-4 mt-2 mb-10">
                        {saved.map(item => (       
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow flex flex-col items-center border-1 border-green-300">
                                <div>
                                <span className="font-semibold text-lg mb-1 text-blue-900 line-clamp-2">
                                    {item.recipe && item.recipe.name ? item.recipe.name : `Рецепт ${item.recipe.name}`}
                                </span>
                                    <img src={item.recipe.image} alt={item.recipe.name} className="h-30 w-60 object-cover rounded-xl mb-2 mt-3"
                                    onClick={() => navigate(`/recipes/${item.recipe.id}`)}/>
                                </div>

                                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-2 w-60 rounded shadow-lg mt-3"
                                onClick={() => navigate(`/recipes/${item.recipe.id}`)}
                                >
                                К рецепту
                                </button>

                                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-2 w-60 rounded shadow-lg mt-3"
                                onClick={() => handleREmove(item.id)}
                                >
                                Удалить из избранных
                                </button>
                              
                            </div>
                        ))}
                        </div>
                )}
                </div>
             </div>

                <div className="md:w-1/3 w-full">
                   <UserComments />
                </div>            
            </div>
    );
}