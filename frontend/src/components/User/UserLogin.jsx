import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import backimage from '../../icons/background-image.jpg'


export default function UserLogin() {
    const initialForm = {
        username: '', 
        password: ''
    }
    const [form, setForm] = useState(initialForm);
    const [visible, setVisible] = useState(false);   // показываем пароль при заполнении
    const navigate = useNavigate();
    const { login } = useAuth();
    const backImage = backimage;
    const API = import.meta.env.VITE_API_URL || '';

    const handleChange = e => setForm(f => {
        const updated = {...f, [e.target.name]: e.target.value };
        return updated;
    }
    );

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/login/`, form);
            const { token, username } = res.data;
        
            login(token, username);

            setForm(initialForm); // очистка формы
            toast(`Вы вошли как ${username}`)
            navigate("/");  // редирект после входа
        } catch (error) {
            const msg = error.response?.data?.detail || error.message || "Неизвестная ошибка";
            toast.error("Ошибка входа: " + msg);
        }
    };

    return (
        <div className='flex flex-col items-center justify-space min-h-full'
        style={{ 
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}>  
            <h1 className='text-center text-xl text-blue-800 font-semibold mt-5'>Вход</h1>
            <form onSubmit={handleSubmit} className='w-[400px] mx-auto mt-5 p-6 bg-cyan-50 rounded shadow space-y-4'>
                <input type="text" name="username" value={form.username} onChange={handleChange}
                placeholder="Никнейм" className="w-full border px-3 py-2 rounded" required/>

                <div className="relative w-full">
                <input type={visible ? "text": "password"} name="password" value={form.password} onChange={handleChange}
                placeholder="Пароль" className="w-full border px-3 py-2 rounded" autoComplete="new-password" required />
                <button type="button"  className="absolute right-3 top-2 text-gray-500 text-sm mr-5"
                onClick={() => setVisible(!visible)}>{visible ? "Скрыть" : "Показать"}
                </button>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Войти</button>
            </form>
        </div>
    );
}