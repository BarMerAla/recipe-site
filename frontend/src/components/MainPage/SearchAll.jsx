import { styled } from 'styled-components'
import { useState } from "react";

const SearchForm = styled.form`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SearchInput = styled.input`
    padding: 6px 21px;
    border: 1px solid rgb(25, 61, 35);
    border-radius: 6px;
    font-size: 16px;
`;


export default function SearchAll({ onSearch, placeholder = "Найти рецепт..." }) {
    const [search, setSearch] = useState('');
       
    const handleChange = (e) => {
        setSearch(e.target.value);
        if (onSearch) onSearch(e.target.value.trim());
    }

    
    return (
        <SearchForm>
                <SearchInput 
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={handleChange}
                />
        </SearchForm>
    );
}