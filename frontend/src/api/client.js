import axios from "axios"

// Jedna axios instanca za sve pozive backendu.
// baseURL: umjesto 'http://localhost:3000/api/auth/login' pišeš samo '/auth/login'
// withCredentials: preglednik sprema cookie s tokenom iz logina i šalje ga uz svaki sljedeći zahtjev
// Primjer: const response = await api.post('/auth/login', { email, password })
export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
})
