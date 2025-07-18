import axios from 'axios';
import { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import Pagination from './Pagination';
import RightSidebar from './RightSidebar';
import { useLocation } from 'react-router';

export default function MainPage({ search, categoryId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);    // параметр для пагинации
    const [totalPages, setTotalPages] = useState(1);  // параметр для пагинации
    const API = import.meta.env.VITE_API_URL || '';
    const location = useLocation();

    const filteredRecipes = data.filter(                                        // фильтр для поиска
        recipe => recipe.name.toLowerCase().includes(search.toLowerCase())
    );                          

    useEffect(() => {         
        setLoading(true);
        setData([]);
        let params = [];

        if (categoryId) params.push(`category=${categoryId}`);
        params.push(`page=${page}`)

        let url = `${API}/recipes/?${params.join("&")}`;   // изменили путь с учетом пагинации

        axios.get(url)
            .then((response) => {
                setData(response.data.results ?? []);
                setTotalPages(Math.ceil(response.data.count / 10)); //  общее количество рецептов на 1 страницу (10 рецептов)
            })
            .catch((error) => {
            console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [categoryId, page]);

    useEffect(() => {
        setPage(1); // Сбросить на первую страницу при смене категории
    }, [categoryId]);

    useEffect(() => {
    if (location.pathname === '/') {
        axios.get(`${API}/recipes/?page=1`)
        .then(res => setData(res.data.results ?? []));
    }
    }, [location.pathname]);

    return (
        <div className='bg-white min-h-screen flex flex-row p-6'>
            {/* Основной контент / карты рецептов */}
            <div className='flex-1 flex flex-col'>
                <div className='flex-1'>
                {loading ? <p>Загрузка...</p> : (
                filteredRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))
                )}
                </div>
                <div className='w-full flex justify-center'>
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </div>
            </div> 
            {/* Правый Sidebar */}
            <RightSidebar />
        </div>
    );
}
