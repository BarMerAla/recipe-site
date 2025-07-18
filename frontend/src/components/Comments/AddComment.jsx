import { useState } from 'react';
import axios from 'axios';

export default function AddComment({ recipeId, onCommentAdded }) {  // отправка комментарии
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const API = import.meta.env.VITE_API_URL || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(!text.trim()) {
            setError("Комментарии не может быть пустым!")
            return;
        }

    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API}/recipes/${recipeId}/comments/`, {
            comment: text
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        });

        setText('');
        setError('');
        if (onCommentAdded) onCommentAdded(); // Чтобы обновить список комментариев
        } catch (err) {
            setError("Только зарегистированные пользователи могут отправить комментарий");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='my-5'>
            <div className='flex flex-col'>
                <textarea value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className='flex-1 border border-gray-300 rounded-md p-2 ml-1 mr-1'
                    placeholder='Напишите свой комментарий...'
                    rows="3"
                />
                {error && <p className="text-red-600 mt-1">{error}</p>}
                <div className="mt-2 flex justify-end">
                <button 
                    type="submit" 
                    className='mt-2 bg-green-600 text-white px-3 py-2 w-50 rounded hover:bg-green-700 mr-1'
                    >
                    Отправить
                </button>
                </div>
            </div>
        </form>
    );
}