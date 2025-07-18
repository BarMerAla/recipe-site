import { useNavigate } from 'react-router-dom';

export default function PopularRecipesCard({ recipe }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-lime-50 shadow mb-3">
            <img src={`${recipe.image}`} 
            alt={recipe.name} className="w-14 h-14 object-cover rounded-lg" 
            onClick={() => navigate(`/recipes/${recipe.id}`)} />
            <div className="flex flex-col gap-2">
                <div className="font-semibold text-sm">
                    {recipe.name}
                </div>
                <div className="text-xs text-gray-500">
                    Сохранили {recipe.saved_count} раз
                </div>
            </div>
        </div>
        )
}