export default function FullRecipeSteps({ recipeSteps }) {
    return (
        <div>
            <hr className="my-10 border-t-2 border-lime-200" />
            <h2 className="text-xl font-semibold mb-5 text-lime-900 mt-10 text-center">Пошаговый рецепт</h2>
            {recipeSteps.length === 0 ? (
                <div className="ml-3">Нет шагов для этого рецепта</div>
            ): (
                recipeSteps.map(step => (
                    <div key={step.id} className="mb-7 text-lg text-gray-800">
                        <div className="mb-4 mt-2 font-bold ml-3">Шаг {step.step_number}</div>
                        <div className="flex flex-col md:flex-row items-center gap-5">
                              {/* Картинка справа */}
                            {step.image && (
                                <img src={step.image} alt={`step ${step.step_number}`} className="md:w-1/3 rounded-xl"
                                style={{minHeight: 200, maxHeight: 200, minWidth: 250, maxWidth: 250, marginTop: 10}}/>
                            )}
                            {/* Описание слева */}
                            <div className="md:w-2/3 text-[17px] text-gray-800 mb-2 mt-3 md:mb-0 mr-3">
                                {step.description}
                            </div>
                        </div>
                    </div>
                    
                ))
            )}
        </div>
    );
}