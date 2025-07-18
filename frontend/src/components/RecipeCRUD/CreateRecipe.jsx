import { useState, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreateRecipe({ onCreated }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        ingredients: "",
        cooking_time: "",
        image: null,
        category_id: "",
    });
    const [categories, setCategories] = useState([]);
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        // Загрузка категории для выбора
        const token = localStorage.getItem('token');
        axios.get(`${API}/categories/`, {
            headers: { Authorization: `Token ${token}` }
        })
        .then(res => setCategories(res.data));
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'category_id' ? parseInt(value) : value }));
    };

    const handleImageChange = (e) => {
        setForm(prev => ({ ...prev, image: e.target.files[0] }))
        console.log("Выбран файл:", e.target.files[0]);
        setImageUploaded(true);
        setTimeout(() => setImageUploaded(false), 3000);
    };

    const handleSubmit = async e => {              
        e.preventDefault();
        const data = new FormData();

         // Отправка основных полей рецепта на backend
        Object.keys(form).forEach(key => {
            if (form[key]) data.append(key, form[key]);
        });


        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API}/recipes/`, data, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            toast("Рецепт добавлен!");
            const recipe = response.data;  // получаем id рецепта после создания краткого рецепта
            onCreated && onCreated(recipe);  // вызываем onCreated
            navigate(`/recipes/${recipe.id}/steps/add`)   // навигация к созданию шагов рецепта
        } catch (err) {
            toast("Ошибка при создании рецепта!")
        }
    };


    return (
        <div className="container">
        <h1 className="text-center text-xl text-green-800 font-semibold mt-5">Создание краткого рецепта</h1>
            <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-5 p-6 bg-white rounded shadow space-y-4'>
                <div className="relative w-full">
                <input name="name" value={form.name} onChange={handleChange} placeholder='Название' 
                className="w-full border px-3 py-2 rounded" required />
                </div>

                <div className="relative w-full">
                <textarea name="description" value={form.description} onChange={handleChange} placeholder='Описание' 
                className="w-full border px-3 py-2 rounded" required />
                </div>

                <div className="relative w-full">
                <textarea name="ingredients" value={form.ingredients} onChange={handleChange} placeholder='Ингредиенты / Не оставляйте пробелы между строками'
                className="w-full border px-3 py-2 rounded" required />
                </div>

                <div className="relative w-full">
                <input name="cooking_time" type="number" value={form.cooking_time} onChange={handleChange} placeholder='Время в минутах' 
                className="w-full border px-3 py-2 rounded" required />
                </div>
            
                <select name="category_id" value={form.category_id} onChange={handleChange}
                className="w-full border px-3 py-2 rounded" required>
                    <option value="" disabled>Выберите категорию</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                
                <div className='mb-4'>
                <input id="image-upload" name="image" type="file" className='hidden' onChange={handleImageChange} accept='image/*' />
                <label htmlFor='image-upload'
                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-green-600 rounded cursor-pointer text-green-700 hover:bg-green-50 transition"
                >
                <svg className="mr-5" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M7 16l3-3 2 2 5-5M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Главное фото рецепта
                </label>
                {imageUploaded && (
                    <div className='text-green-600 mt-2 text-sm animate-fade'>
                        Фото добавлено!
                    </div>
                )}
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                Добавить рецепт
                </button>
            </form>
        </div>
    );
}