import { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import { useParams } from 'react-router'
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UpdateRecipeSteps() {    // редактирование шагов рецепта
    const { id } = useParams();
    const [steps, setSteps] = useState([]);
    const [deletedStepIds, setDeletedStepIds] = useState([]);
  
    const [imageUploaded, setImageUploaded] = useState(false);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const token = localStorage.getItem('token');

        // получение рецепта и его шагов
        axios.get(`${API}/recipes/${id}/steps/`, {    
             headers: { Authorization: `Token ${token}` }
        })  
        .then(res => { 
            console.log(res)
            setSteps(res.data.map(step => ({
                ...step,
                imageFile: null,  // для нового выбранного файла на клиенте
                preview: step.image  // ссылка на текущее изображение
            })));
        });
    }, [id]);

    // Изменение описания шага
    const handleStepChange = (idx, e) => {
        const { name, value } = e.target;
        setSteps(prev => prev.map((step, i) => i === idx ? {...step, [name]: value } : step));
    }

    // Изменение фото шага
    const handleImageChange = (idx, e) => {
        const file = e.target.files[0]
        setSteps(prev => prev.map((step, i) => i === idx ? {
            ...step, 
            imageFile: file,
            preview: file ? URL.createObjectURL(file) : step.preview
        }: step
        ));

        if (file) {
            setPreview(URL.createObjectURL(file));  // превью для выбранного файла
        }
        setImageUploaded(true);
        setTimeout(() => setImageUploaded(false), 3000);
    }

    // Удалить шаг и на сервере и в клиенте
    const handleDeleteStep = (idx) => {
        setSteps(prev => {
            const deleted = prev[idx];
            // только добавляем id в массив на удаление (НЕ отправляем на сервер!)
            if (deleted.id) setDeletedStepIds(ids => [...ids, deleted.id]);
            return prev.filter((_, i) => i !== idx);  // оставляем только те элементы, чей индекс НЕ равен удаляемому.
         });
        }

    // Добавить новый шаг
    const handleAddStep = () => {
        setSteps(prev => [
            ...prev,
            {
                step_number: prev.length + 1,
                description: "",
                image: null,
                imageFile: null,
                preview: null
            }
        ])
    }

    // Сохранить изменения (отправить все шаги)
    const handleSubmit = async e => {
        e.preventDefault();
        
        console.log("steps:", steps)
            steps.forEach((step, idx) => {
                console.log(`Шаг ${idx + 1}: "${step.description}`);
            });
        
        // Пересчитываем step_number (номера шагов) перед отправкой на сервер
        const reindexedSteps = steps.map((step, idx) => ({
            ...step,
            step_number: idx + 1
        }));

         // Отправка на сервер:
        try {
            const token = localStorage.getItem('token');

            // Удаляем только то, что есть в deletedStepIds (и только один раз)
        
            for (const stepId of deletedStepIds) {
                try {
                await axios.delete(`${API}/recipes/${id}/steps/${stepId}/`, {
                        headers: { Authorization: `Token ${token}` }
                    });
                } catch (err) {
                    if (err.response && err.response.status !== 404) {
                        throw err; // вывод только если ошибка на 404
                    }  // 404 игнорируем — значит, шаг уже удалён
                }
            }
        

            for (const step of reindexedSteps) {
                const data = new FormData();

                data.append('step_number', step.step_number);
                data.append('description', step.description);
                if (step.imageFile) data.append('image', step.imageFile);

                if (step.id) {
                    // PATCH
                    await axios.patch(`${API}/recipes/${id}/steps/${step.id}/`, data, {
                        headers: { Authorization: `Token ${token}` }
                    });
                } else {
                    // POST новый шаг
                    data.append('recipe_id', id);
                    await axios.post(`${API}/recipes/${id}/steps/`, data, {
                        headers: { Authorization: `Token ${token}` }
                    });
                }
            }
            setDeletedStepIds([]); // очищаем после сохранения!
            toast("Изменения сохранены!")
            navigate(`/recipes/${id}`);  // редирект на страницу рецепта
        } catch (err) {
            toast.error("Ошибка при изменении рецепта!");
            if (err.response && err.response.data) {
            console.error(err.response.data);
            toast.error(JSON.stringify(err.response.data));
            } else {
            console.error(err);
            }
        }
    };
    

    return  (
        <div className="container">
        <h1 className="text-center text-xl text-green-800 font-semibold mt-5">Редактирование шагов рецепта</h1>
            <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-5 p-6 bg-white rounded shadow space-y-4'>

                {steps.map((step, idx) => (
                <div key={step.id || idx} className='relative w-full'>
                    <div className='flex justify-between items-center mb-3'>
                        <span className='font-semibold'>Шаг {idx + 1}</span>
                        <button type="button" onClick={() => handleDeleteStep(idx)} className='text-red-600 hover:underline'>
                            Удалить шаг
                        </button>
                    </div>
                    <textarea name="description" value={step.description} onChange={e => handleStepChange(idx, e)}
                    placeholder="Описание шага" className='w-full border px-3 py-2 rounded mb-2' 
                    />
                    <div>
                        {step.preview && (
                            <img src={step.preview} alt="" className='w-32 mb-2 rounded shadow' />
                        )}
                        <input id={`step-image-${idx}`} type="file" accept="image/*" className='hidden'
                        onChange={e => handleImageChange(idx, e)}
                        />
                        <label htmlFor={`step-image-${idx}`}
                        className='inline-block px-3 py-1 bg-white border border-green-600 rounded cursor-pointer text-green-700 hover:bg-green-50 transition'>
                        {step.preview ? "Изменить фото" : "Добавить фото"}
                        </label>
                    </div>
                </div>
                ))}

                <div className="mb-4">
                    <button type="button" onClick={handleAddStep} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Добавить шаг
                    </button>
                </div>

                <div className='mb-4'>
                    <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </div>
    );
}