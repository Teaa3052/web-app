import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api/client"

const AuthContext = createContext(null)

// omotava cijelu aplikaciju i svima unutra daje: user, loading, login, logout
export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null) // prijavljeni korisnik ili null
    const [loading, setLoading] = useState(true) // true dok ne dođe odgovor od /me

    // izvrši se jednom, kad se app učita: pitaj backend tko je prijavljen
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await api.get('/auth/me')
                setUser(response.data.user) // cookie postoji i vrijedi
            } catch {
                setUser(null) // 401: nitko nije prijavljen
            } finally {
                setLoading(false) // sad znamo odgovor, u oba slučaja
            }
        }
        checkAuth()
    }, []) // [] = samo jednom, pri prvom prikazu

    // prijava: backend postavi cookie, a mi zapamtimo korisnika
    async function login(email, password) {
        const response = await api.post('/auth/login', { email, password })
        setUser(response.data.user)
    }

    // odjava: backend obriše cookie, a mi zaboravimo korisnika
    async function logout() {
        await api.post('/auth/logout')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// kratica: umjesto useContext(AuthContext) svugdje pišem useAuth()
// (hook je namjerno u istoj datoteci kao Provider, pa gasimo upozorenje za Fast Refresh - samo za ovaj red)
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}