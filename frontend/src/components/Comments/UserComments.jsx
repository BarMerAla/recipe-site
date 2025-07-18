import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import like_icon  from "../../icons/like_icon.png"

export default function UserComments() {
    const [comments, setComments] = useState([]);
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${API}/profile/my-comments/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res =>  setComments(res.data))
        .catch(err => console.error("Ошшбка загрузки комментариев", err));
    }, []);

    return (
        <div>
            <h2 className='text-lg font-bold mb-6 text-lime-900'>Мои комментарии</h2>
            {comments.length === 0 ? (
                <p>Вы пока не оставили комментариев</p>
            ) : (
                comments.map(comment => (
                    <div key={comment.id} className='mb-3 text-base text-gray-800 flex bg-white rounded-xl shadow-md overflow-hidden mx-auto  justify-between mr-7'>
                        <div className="flex flex-col">
                            <p className='ml-3 text-gray-700'>{comment.comment}</p>
                            <p className='ml-3 text-sm text-gray-500 mt-2'>На рецепт: {comment.recipe.name}</p>
                        </div>
                        <div className="flex flex-col items-end text-right mr-5">
                            <div className="mb-4 mt-2 font-medium text-sm">{format(new Date(comment.created), "d MMMM yyyy, HH:mm", { locale: ru})}</div>
                            <div className="flex items-center">
                                <img src={like_icon} alt="" className="w-4 h-4" />
                                <span className="ml-3">{comment.likes_count}</span>
                            </div>
                        </div>         
                    </div>
                ))
            )}
        </div>
    );
}