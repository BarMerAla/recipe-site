import { styled } from 'styled-components'
import SearchAll from './SearchAll';
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import UserDropdownMenu from '../User/UserDropdownMenu';
import { useLocation, useNavigate } from "react-router-dom";


const HeaderContainer = styled.header`
    font-size: 20px;
    height: 60px;
    display: flex;
    padding: 0 2rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    background:rgb(244, 252, 255);
    gap: 32px;
`;

const LeftBlock = styled.div`
    display: flex;
    align-items: center;
    gap: 80px;  // расстояние между заголовком и поиском
`;

const RightBlock = styled.div`
    display: flex;
    align-items: center;
    gap: 32px;  // расстояние между заголовком и поиском
`;

export default function Header({ onSearch }) {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const hideSearchRegexps = [/^\/profile\/me\/?$/, /^\/login\/?$/, /^\/register\/?$/, /^\/create-recipe\/?$/, /^\/profile\/update\/?$/,
    /^\/recipes\/\d+\/steps\/add\/?$/, /^\/recipes\/\d+\/update\/?$/, /^\/recipes\/\d+\/steps\/update\/?$/];  // скрытие поиска на этих путях

    const hideSearch = hideSearchRegexps.some(re => re.test(location.pathname)); // скрытие поиска
 
    const handleSearch = (value) => {     // тут эта функция редиректит на MainPage при активизации поиска
        onSearch(value);    // обновляет состояние поиска в App
        if (location.pathname !== "/") {
            navigate("/");
        }
    }

   
    return (
        <HeaderContainer>
            <LeftBlock>
            <Link to="/" className='text-2xl font-mono font-medium tracking-wide text-green-800'>Лучшие рецепты</Link>
            {!hideSearch && (
                <SearchAll onSearch={handleSearch} />
            )}
            </LeftBlock>
            <RightBlock>
                {isAuthenticated ? (
                    <div className='flex items-center gap-2'>
                    <span>
                        <UserDropdownMenu username={user.username} />
                    </span>
                    </div>
                ): (
                    <>
                        <Link to="/login/" className='text-xl font-mono font-medium tracking-wide text-blue-800'>Вход</Link>
                        <Link to="/register/" className='text-xl font-mono font-medium tracking-wide text-green-800'>Регистрация</Link>
                    </>
                )}
            </RightBlock>
        </HeaderContainer>
    );
}