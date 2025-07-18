import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import backimage from '../../icons/background-image.jpg'


export default function UserRegister() {
    useEffect(() => {
        console.log('API:', API);
    }, []);

    const initialForm = {
        username: "",
        email: "",
        password: "",
        phone: "",
        avatar: null,
    };
    const [form, setForm] = useState(initialForm);   
    const [visible, setVisible] = useState(false);   // показываем пароль при заполнении
    const navigate = useNavigate();
    const { login } = useAuth();
    const backImage = backimage;
    console.log('UserRegister mounted');
    const API = import.meta.env.VITE_API_URL || '';

    const handleChange = e => {
        const { name, value, files} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: files ? files [0] : value
        }));
    };

    const handleNumberChange = e => {    // внесение номера в стандартном формате
        const { name, value } = e.target;
        let newValue = value;

        if (name === "phone") {    // Удалим все не-цифры, кроме первого +
            newValue = newValue.replace(/[^\d+]/g, '');

            if (!newValue.startsWith('+')) {        // // Убедимся, что номер начинается с +
                newValue = '+' + newValue(/^\+/, '');
            }
        }
        
        setForm(prev => ({
            ...prev,
            [name] : newValue
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v) formData.append(k, v);
        });
        try {
            await axios.post(`${API}/register/`, formData);


            // после успешной регистрации — логиним:
            const loginUser = await axios.post(`${API}/login/`, {
                username: form.username,
                password: form.password,
            });

            const { token, username } = loginUser.data;
            login(token, username);

            toast("Успешная регистрация!")  
            setForm(initialForm);   // очистка формы:
            navigate("/profile/me/") // редирект на личный кабинет 
            } catch (error) {
            console.error(error)
            toast("Ошибка регистрации: " + JSON.stringify(error.response?.data));
        }
    };

    return (
       <div className='flex flex-col items-center justify-space min-h-full'
        style={{ 
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}>  
        <h1 className='text-center text-xl text-green-800 font-semibold mt-5'>Регистрация</h1>
        <form onSubmit={handleSubmit} className='w-[400px] mx-auto mt-5 p-6 bg-cyan-50 rounded shadow space-y-4'>
            {/* ...Поля формы регистрации*/}
           
            <div className="relative w-full">
                <input type="text" name="username" value={form.username} onChange={handleChange}
                placeholder="Никнейм" className="w-full border px-3 py-2 rounded" required/>
                <span className="absolute right-3 top-2 text-red-600 pointer-events-none">*</span>
            </div>

            <div className="relative w-full">
                <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="Email" className="w-full border px-3 py-2 rounded" required />
                <span className="absolute right-3 top-2 text-red-600 pointer-events-none">*</span>
            </div>

            <div className="relative w-full">
                <input type={visible ? "text": "password"} name="password" value={form.password} onChange={handleChange}
                placeholder="Пароль" className="w-full border px-3 py-2 rounded" autoComplete="new-password" required />

                <button type="button"  className="absolute right-3 top-2 text-gray-500 text-sm mr-5"
                 onClick={() => setVisible(!visible)}>{visible ? "Скрыть" : "Показать"}
                </button>

                <span className="absolute right-3 top-2 text-red-600 pointer-events-none">*</span>
            </div>

            <input type="tel" name="phone" value={form.phone} onChange={handleNumberChange}
            placeholder="Контактный номер" className="w-full border px-3 py-2 rounded" />
            
            <div>
            <input id="image-uploaded" type="file" name="avatar" className="hidden" onChange={handleChange} accept="image/*" />
            <label htmlFor='image-uploaded' 
            className='w-full flex items-center justify-center px-4 py-2 bg-white border border-green-600 rounded cursor-pointer text-green-700 hover:bg-green-50 transition'
            >
                <svg className="mr-5" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M7 16l3-3 2 2 5-5M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Фото аватара
                </label>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >Зарегистрироваться</button>
        </form>
        </div>
    );
}