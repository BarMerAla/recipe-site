import { useState } from 'react';
import axios from 'axios';
import like_icon  from "../../icons/like_icon.png"
import { useParams } from 'react-router';

export default function CommentLike({ commentId, initialLiked, initialCouunt }) {
    const { id } = useParams;
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCouunt);
    const [animate, setAnimate] = useState(false);  // анимация для иконки
    const [error, setError] = useState('');
    const API = import.meta.env.VITE_API_URL || '';

    const handleLike = async () => {
        setAnimate(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API}/comments/${commentId}/like/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            setLiked(res.data.liked);
            setCount(res.data.likes_count);
            setError('');
        } catch (error) {
            setError("Только зарегистированные пользователи могут лайкать!", error);
            setTimeout(() => setError(''), 2000)
        } finally {
            setTimeout(() => setAnimate(false), 300)  // через 300мс убираем анимацию
        }
    };

    return (
        <div className="relative flex items-center">
            <div onClick={handleLike} className={`cursor-pointer flex items-center text-green-700 transition-transform duration-300 
                    ${animate ? "scale-125" : "scale-100"}`}>
                <img src={like_icon} alt="Like" className='w-4 h-4' />
                <span className='ml-1'>{count}</span>
            </div>
        {error && (
            <span className="right-10 text-bg text-red-600 rounded px-4 py-1">
            {error}</span>
       )}
       </div>
    );
}