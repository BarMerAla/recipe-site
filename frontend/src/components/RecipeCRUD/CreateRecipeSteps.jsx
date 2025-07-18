import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateRecipeSteps({ onCreated }) {
    const { id } = useParams();
    const [steps, setSteps] = useState([]);
    const [step, setStep] = useState({
            recipe_id: id,
            step_number: "",
            description: "",
            image: null,
        })

    const [stepImageUploaded, setStepImageUploaded] = useState(false);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL || '';


     const handleStepChange = e => {                
        const { name, value } = e.target;
        setStep(prev => ({ ...prev, [name]: value }))
    }

    const handleStepImageChange = (e) => {              // для загрузки фоток шагов рецепта
        setStep(prev => ({ ...prev, image: e.target.files[0] }))
        console.log("Выбран файл:", e.target.files[0]);
        setStepImageUploaded(true);
        setTimeout(() => setStepImageUploaded(false), 3000);
    };

    const addStep = () => {
        if (!step.description) return; 
        setSteps(prevSteps => [
            ...prevSteps, { 
                ...step, step_number: prevSteps.length + 1,
                image: step.image
            }
        ]);
        setStep({ step_number: steps.length + 1, description: "", image: null});      // Очищаем форму шага
    };


    const handleSubmit = async e => {              
        e.preventDefault();

        // Отправка шагов рецепта на backend

        for (const step of steps) {
            const data = new FormData();
            data.append('recipe_id', id);
            data.append('step_number', step.step_number);
            data.append('description', step.description);
            if (step.image) {
                data.append('image', step.image)
            }
            
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${API}/recipes/${id}/steps/`, data, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
            } catch (err) {
                toast("Ошибка при создании шага!")
                console.log(err);
            }
        }
        onCreated && onCreated();
        toast("Все шаги успешно добавлены!") 
        navigate('/')  // редирект на main page
    };
  
     
    return (
    <div className="container">
    <h1 className="text-center text-xl text-green-800 font-semibold mt-5">Добавление шагов для рецепта</h1>
        <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-5 p-6 bg-white rounded shadow space-y-4'>
            <div className="relative w-full">
            <h3 className='text-center text-fontbold text-blue-900 mb-3'>Добавить шаг</h3>
            <textarea name="description" value={step.description} onChange={handleStepChange} placeholder='Описание шага' 
            className="w-full border px-3 py-2 rounded mb-4" />
                    
            <div>
                <input id="image-upload" name="image" type="file" className='hidden' onChange={handleStepImageChange} accept='image/*' />
                <label htmlFor='image-upload'
                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-green-600 rounded cursor-pointer text-green-700 hover:bg-green-50 transition"
                >
                <svg className="mr-5" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M7 16l3-3 2 2 5-5M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Фото для шага
                </label>
                {stepImageUploaded && (
                <div className='text-green-600 mt-2 text-sm animate-fade'>
                        Фото добавлено!
                </div>
                )}
                </div>
                    <button type="button" onClick={addStep} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Добавить шаг
                    </button>
                    <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                        Сохранить все шаги
                    </button>
                </div>

                <div className='mt-4 mb-4'>
                    <h3 className='text-center text-fontbold text-blue-900 mb-3'>Шаги рецепта</h3>
                    {steps.map((s, idx) => (
                        <div key={idx} className="mb-4 flex items-center gap-4">
                            <span className='font-bold'>Шаг { idx+1 }</span>
                            <span> {s.description}</span>
                            {s.image && (
                                <img 
                                src={URL.createObjectURL(s.image)}
                                alt={`Шаг ${idx+1}`}
                                className='w-16 h-16 object-cover-rounded'
                                />
                            )}
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}