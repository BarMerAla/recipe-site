import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import backimage from '../../icons/background-image.jpg'
import UpdateAvatar from './UpdateAvatar';
import { useNavigate } from 'react-router-dom';

export default function UserProfileUpdate() {
    const API = import.meta.env.VITE_API_URL || '';
    let url = `${API}/profile/update/`;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        phone: "",
        avatar: null,
    });


    const [passwordForm, setPasswordForm] = useState({
        old_password: "",
        new_password: "",
    })

    const [visible, setVisible] = useState(false);
    const backImage = backimage;  // изображение на задний фон

    const fetchProfile = async () => {   // загрузка данных из профиля юзера
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API}/profile/me/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setForm({
                email: res.data.email || "",
                phone: res.data.phone || "",
                avatar: res.data.avatar || "",

            });
        } catch (err) {
            toast("Ошибка загрузки профиля: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message))
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEmailChange = e => {       // изменение пароля 
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name] : value
        }));
    };

    const handleNumberChange = e => {    // изменение номера
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

    const handlePasswordChange = e => {   // изменение пароля
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name] : value
        }));
    };

    const handleUpdate = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', form.email);
        formData.append('phone', form.phone);

        try {
            const token = localStorage.getItem('token');
            await axios.patch(url, formData, {
                headers: { 
                    Authorization: `Token ${token}`,
                    'Content-type': 'multipart/form-data', 
                }
            });
            toast("Данные успешно обновлены!")
            await fetchProfile(); // <--- добавлено
            return;
        } catch (err) {
            toast("Ошибка обновлении данных: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
        }
    }

    const handlePasswordUpdate = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('old_password', passwordForm.old_password);
        formData.append('new_password', passwordForm.new_password);

        try {
            const token = localStorage.getItem('token');
            await axios.patch(url, formData, {
                headers: { 
                    Authorization: `Token ${token}`,
                    'Content-type': 'multipart/form-data', 
                }
            });
            toast("Пароль успешно обновлен!")
            return;
        } catch (err) {
            toast("Ошибка обновлении пароля: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
        }
    }

    // Функция, которую передаём в UpdateAvatar:
    const handleAvatarSubmit = async () => {
        await fetchProfile();  // обновим профиль — avatarUrl обновится!
    };

    return (
        <div className='min-h-full flex items-center justify-center'
        style={{ 
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}>  

            <div className='w-full max-w-5xl'>
            
                <div className='relative p-8 shadow bg-emerald-50 rounded-t-lg'>

                {/* Кнопка Назад в правом верхнем углу */}
                <button className='absolute w-30 top-6 right-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl
                transition font-medium shadow'
                onClick={() => navigate('/profile/me/')}>
                    Назад
                </button>

                {/* Форма обновления аватара */}
                <h1 className='ml-5 mb-10 mt-2 text-left text-xl text-blue-800 font-semibold mt-2'>Аватар</h1>
                <UpdateAvatar 
                avatarUrl={form.avatar ? `${form.avatar}` : null}
                onAvatarSubmit={handleAvatarSubmit}
                />
             
                {/* Форма обновления профиля */}
                <h1 className='ml-5 mt-10 text-left text-xl text-green-800 font-semibold mt-5'>Настройки профиля</h1>
                <form onSubmit={handleUpdate} className='w-full max-w-xl mt-5 p-6 bg-emerald-50 rounded space-y-4'>

                    <div className='flex items-center'>
                        <label className='w-1/3 text-left pr-4 font-medium text-gray-700'>Ваш e-mail</label>
                        <input type="email" name="email" value={form.email} onChange={handleEmailChange}
                        className="w-2/3 border px-3 py-2 rounded focus:outline-none focus:ring" />
                    </div>

                    <div className="flex items-center">
                        <label className='w-1/3 text-left pr-4 font-medium text-gray-700'>Ваш номер</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleNumberChange}
                        className="w-2/3 border px-3 py-2 rounded focus:outline-none focus:ring" />
                    </div>

                    <button type="submit" className="mt-5 ml-44 w-50 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                    >Обновить данные</button>
                </form>
             
                {/* Форма смены пароля */}
                <h1 className='ml-5 text-left text-xl text-yellow-800 font-semibold mt-5'>Сменить пароль</h1>
                <form onSubmit={handlePasswordUpdate} className='w-full max-w-xl mt-5 p-6 bg-emerald-50 rounded space-y-4'>
                    <div className="flex items-center">
                        <label className='w-1/3 text-left pr-4 font-medium text-gray-700'>Текущий пароль</label>

                        <div className='w-2/3 relative'>
                        <input type={visible ? "text": "password"} name="old_password" value={passwordForm.old_password} onChange={handlePasswordChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring" required />

                        <button type="button"  className="absolute right-3 top-2 text-gray-500 text-sm mr-5"
                        onClick={() => setVisible(!visible)}>{visible ? "Скрыть" : "Показать"}
                        </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <label className='w-1/3 text-left pr-4 font-medium text-gray-700'>Новый пароль</label>

                        <div className="w-2/3 relative">
                        <input type={visible ? "text": "password"} name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring" required />

                        <button type="button"  className="absolute right-3 top-2 text-gray-500 text-sm mr-5"
                        onClick={() => setVisible(!visible)}>{visible ? "Скрыть" : "Показать"}
                        </button>
                        </div>
                    </div>

                    <button type="submit" className="mt-5 ml-44 w-50 bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700 transition"
                    >Обновить пароль</button>
                </form>
                </div>
                <footer>
                    <div className='bg-emerald-900 min-h-25 flex items-center justify-center'>
                        <span className="text-center text-white block">
                        © 2025 Recipe Site
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}