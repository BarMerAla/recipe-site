import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function UserDropdownMenu({ username }) {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const toggleMenu = () => setIsOpen(!isOpen);
    const navigate = useNavigate(); 

    const handleLogout = (e) => {
        e.preventDefault();   // <--- чтобы не отправлялась форма
        logout();
        navigate("/");      // <--- редирект на главную
    }

    return (
        <div className='relative inline-block text-left'>
            {/* Триггер */}
            <button
                onClick={toggleMenu} 
                className='inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-green-500" id="menu-button" aria-expanded="true" aria-haspopup="true'
            >
            <span>{username}</span> 
            <svg className="-mr-1 size-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            </button>

            {/* Меню */}
            {isOpen && (
                <div className="absolute right-0 z-50 mt-1 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden " role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <a href="/profile/me/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-lime-500 transition rounded" role="menuitem" tabindex="-1" id="menu-item-0">
                        Профиль</a>
                        <form method="POST" action="#" role="none">
                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-lime-500 transition rounded" role="menuitem" tabindex="-1" id="menu-item-3">Выйти</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}