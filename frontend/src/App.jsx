import MainPage from './components/MainPage/MainPage';
import Header from './components/MainPage/Header';
import FullRecipeWrapper from './components/FullRecipe/FullRecipeWrapper';
import { useState } from 'react';
import SidebarMenu from './components/MainPage/SidebarMenu';
import { Routes, Route } from 'react-router-dom';
import UserRegister from './components/User/UserRegister';
import UserLogin from './components/User/UserLogin';
import UserProfile from './components/User/UserProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import Footer from './components/MainPage/Footer';
import CreateRecipe from './components/RecipeCRUD/CreateRecipe';
import CreateRecipeSteps from './components/RecipeCRUD/CreateRecipeSteps';
import FullRecipeStepsAndCommentsWrapper from './components/FullRecipe/FullRecipeStepsAndCommentsWrapper';
import UpdateRecipe from './components/RecipeCRUD/UpdateRecipe';
import UpdateRecipeSteps from './components/RecipeCRUD/UpdateRecipeSteps';
import UserProfileUpdate from './components/User/UserProfileUpdate';

function App() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const location = useLocation();

  const hideSidebarPaths = ["/profile/me", "/profile/me/", "/login/", "/register/", "/create-recipe", 
  "/profile/update/"];  // скрываем на этих страницах Sidebar

  const hideSidebar = hideSidebarPaths.includes(location.pathname);  // показываем на остальных страницах кроме выше

  const hideFooterPaths = ["/profile/update/"]  // скрываем на этой странице футер
  const hideFooter = hideFooterPaths.includes(location.pathname);
 
  const handleLogin = (token) => {
    console.log("Токен получен:", token);
    // можно сохранить токен, редиректнуть или поменять состояние
    localStorage.setItem("token", token);
  };

  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearch} />
        <div className='flex flex-1'>
        {!hideSidebar && (
          <SidebarMenu onCategorySelect={setCategoryId} />
        )}
            <main className='flex-1 pl-0'>
              <Routes>
                <Route path="/" element={<MainPage search={search} categoryId={categoryId}/>} />

                {/* Пути для полной страницы рецепта и комментарии*/}
                <Route path="/recipes/:id" element={<FullRecipeWrapper search={search} />} />
                <Route path="/recipes/:id/steps" element={<FullRecipeStepsAndCommentsWrapper />} />

                {/* Пути для аутентификации и личного кабинета */}
                <Route path="/login/" element={<UserLogin onLogin={handleLogin} />} />
                <Route path="/register/" element={<UserRegister />} />
                <Route path="/profile/me/" element={<UserProfile search={search} />} />
                <Route path="/profile/update/" element={<UserProfileUpdate />} />

                {/* Пути для создания и редактирования рецептов юзером */}
                <Route path="/create-recipe" element={<CreateRecipe />} />
                <Route path="/recipes/:id/steps/add" element={<CreateRecipeSteps />} />
                <Route path="/recipes/:id/update" element={<UpdateRecipe />} />
                <Route path="/recipes/:id/steps/update" element={<UpdateRecipeSteps />} />
                
              </Routes>
              <ToastContainer position="top-right" autoClose={1000} />
            </main>
          </div>
        {!hideFooter && (
        <Footer />
        )}
      </div>
    </>
  );
}

export default App

