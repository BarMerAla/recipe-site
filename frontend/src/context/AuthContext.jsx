import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (token && username) {
            setUser({ username });
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token, username) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setUser({ username });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value = {{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// кастомный хук
export function useAuth() {
  return useContext(AuthContext);
}