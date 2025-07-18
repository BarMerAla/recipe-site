import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Comments from './Comments';

export default function CommentsWrapper({ refreshToken }) {
    const { id } = useParams();
    const [comments, setComments] = useState(null);
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        let url = `${API}/recipes/`

        axios.get(`${url}${id}/comments/`)
        .then(res => setComments(res.data));
    }, [id]);

    if (!comments) return <div>...Загрузка</div>;
    return <Comments comments={comments} />;
}