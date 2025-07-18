import { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import { useParams } from 'react-router'
import axios from 'axios';
import { toast } from 'react-toastify';


export default function UpdateRecipe({ onUpdated}) {
    const { id } = useParams();
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
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL || '';

    // Получение категорий и рецепта для заполнения формы
    useEffect(() => {
        const token = localStorage.getItem('token');

        // Категории
        axios.get(`${API}/categories/`, {     
            headers: { Authorization: `Token ${token}` }
        })
        .then(res => setCategories(res.data))
        .catch(err => {
        console.log("Ошибка при загрузке категорий", err);
        });

        // сам рецепт
        axios.get(`${API}/recipes/${id}/`, {    
             headers: { Authorization: `Token ${token}` }
        })  
        .then(res => {
            const recipe = res.data;
            setForm({
                name: recipe.name || "",
                description: recipe.description || "",
                ingredients: recipe.ingredients || "",
                cooking_time: recipe.cooking_time || "",
                image: null,
                category_id: recipe.category ? recipe.category.id: "",  // тут категории если нет, выбираем пустое значение
            });
            setPreview(recipe.image); // <-- ссылка на текущее изображение
        });
    }, [id]);

    const handleChange = e => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setForm(prev => ({...prev, image: file }))
        if (file) {
            setPreview(URL.createObjectURL(file));  // превью для выбранного файла
        }
        setImageUploaded(true);
        setTimeout(() => setImageUploaded(false), 3000);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const data = new FormData();

        Object.keys(form).forEach(key => {
            if (form[key]) data.append(key, form[key]);
        });

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API}/recipes/${id}/`, data, {
                headers: { Authorization: `Token ${token}` }
            });
            toast("Изменения сохранены!")
            onUpdated && onUpdated();
            navigate(`/recipes/${id}`);  // редирект на страницу рецепта
        } catch (err) {
            toast("Ошибка при изменении рецепта!")
            console.log(err)
        }
    };

    return (
        <div className="container">
            <h1 className="text-center text-xl text-green-800 font-semibold mt-5">Редактирование рецепта</h1>
            <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-5 p-6 bg-white rounded shadow space-y-4'>
                <div className="relative w-full">
                <input name="name" value={form.name} onChange={handleChange} 
                className="w-full border px-3 py-2 rounded" />
                </div>

                <div className="relative w-full">
                <textarea name="description" value={form.description} onChange={handleChange}  
                className="w-full border px-3 py-2 rounded" />
                </div>

                <div className="relative w-full">
                <textarea name="ingredients" value={form.ingredients} onChange={handleChange} 
                className="w-full border px-3 py-2 rounded" />
                </div>

                <div className="relative w-full">
                <input name="cooking_time" type="number" value={form.cooking_time} onChange={handleChange} 
                className="w-full border px-3 py-2 rounded" />
                </div>
        
                <select name="category_id" value={form.category_id} onChange={handleChange}
                className="w-full border px-3 py-2 rounded" required>
                    <option value="" disabled>Выберите категорию</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            
                <div className='mb-4'>
                {preview && (
                    <img src={preview} alt="Текушее изображение"  className="w-40 mb-2 rounded shadow" />
                )}
                <input id="image-upload" name="image" type="file" className='hidden' onChange={handleImageChange} accept='image/*' />
                <label htmlFor='image-upload'
                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-green-600 rounded cursor-pointer text-green-700 hover:bg-green-50 transition"
                >
                <svg className="mr-5" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M7 16l3-3 2 2 5-5M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {preview ? "Изменить главное фото" : "Главное фото рецепта"}
                </label>
                {imageUploaded && (
                    <div className='text-green-600 mt-2 text-sm animate-fade'>
                        Фото добавлено!
                    </div>
                )}
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                Сохранить изменения
                </button>
            </form>
        </div>
    );

}