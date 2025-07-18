import { useRef, useState, useEffect } from 'react';
import avatar from '../../icons/default-avatar.avif';
import { toast } from 'react-toastify';
import axios from 'axios';


export default function UpdateAvatar({ avatarUrl, onAvatarChange, onAvatarSubmit }) {
    const API = import.meta.env.VITE_API_URL || '';
    let url = `${API}/profile/update/`;
    const defaultAvatar = avatar;    // дефолтный аватар
    const fileInputRef = useRef();
    const [preview, setPreview] = useState(null); // для превью
    const [file, setFile] = useState(null);   // реальный файл для отправки
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {  // изменение аватара
        const file = e.target.files[0]
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
            if (onAvatarChange) onAvatarChange(file);
        }
    }

     // Клик по аватарке
    const handleAvatarClick = () => fileInputRef.current.click();
    
    const handleSubmit = async e => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file)
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.patch(url, formData, {
                headers: { Authorization: `Token ${token}` ,
                'Content-Type': 'multipart/form-data',
                }   
            }); 
            if (onAvatarSubmit) onAvatarSubmit(file);
            toast("Аватар успешно обновлен!")
            setFile(null);       // сбрасываем выбор
            setPreview(null);    // сбрасываем превью
            if (onAvatarSubmit) onAvatarSubmit(); // родитель сам обновит avatarUrl через fetchProfile
            return;
        } catch (err) {
            toast("Ошибка обновления аватара: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col md:flex-row items-center gap-10'>
            <div className='group relative'>
                <img src={preview ? preview: (avatarUrl || defaultAvatar)}
                className={`w-40 h-40 rounded-full object-cover border-4 border-green-400 
                shadow-lg cursor-pointer transition duration-200 ${preview ? "ring-4 ring-blue-400" : ""}`}
                onClick={handleAvatarClick} 
                alt="Аватар" />

                {/* Оверлей появляется при наведении */}
                <div className='absolute inset-0 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-40 
                rounded-full transition'
                onClick={handleAvatarClick}>
                <span className='text-white opacity-0 group-hover:opacity-100 text-lg font-semibold'>
                    Изменить
                </span>
                </div>

                {/* Скрытый инпут */}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className='hidden' />
            </div>

            <div className="flex flex-col items-start">
                {/* Текст перед кнопкой */}
                <span className="mb-2 text-gray-700 text-base">
                    Здесь вы можете сменить свой аватар
                </span>
            <button type="submit" 
            className={`mt-5 ml-1 w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-100`}
            disabled={!file || loading}
            >
                {loading ? "Загрузка..." : "Сменить аватар"}
            </button>
            </div>
        </form>
    )
}
