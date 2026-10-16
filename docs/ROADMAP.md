# Roadmap

Checklista razvoja. Kvačicu (`[x]`) stavljaš kad je korak pregledan i commitan.

**Način rada:** Claude objašnjava i zadaje zadatke, Tea piše kod, Claude pregledava.
Za prebacivanje napiši _„preuzmi ovaj korak"_ i onda taj korak piše Claude, uz objašnjenje.

---

## Faza 0: Temelji

### 0.1 Git higijena

- [x] Commitati trenutni shadcn rad
- [x] `.gitignore` u korijenu repoa (`node_modules/`, `.env`, `dist/`, `uploads/`)
- [x] Maknuti backend `node_modules` iz gita (`git rm -r --cached`)
- [x] Premjestiti `backend/`, `frontend/` i `README.md` iz `web-app/` u korijen repoa (`git mv`)
- [x] Očistiti backend `package.json` (maknuti react/tailwind/vite/express-validator, dodati `dev` skriptu)
- [x] Premjestiti `forest.jpg` u `frontend/public/`

### 0.2 Baza i migracije

- [x] Nova baza `selfimprovement_dev` + zasebni korisnik baze za aplikaciju
- [x] `.env` → `DATABASE_URL`, `.env.example` u gitu
- [x] `node-pg-migrate` + prva migracija: tablica `users`
- [x] Model usklađen sa shemom (snake_case u bazi, camelCase u JS-u), obrisan `database.sql`

### 0.3 Backend auth

- [x] `config.js` (env varijable, fail fast) // proučit
- [x] Login: jedan odgovor, JWT u httpOnly cookieju, ista poruka za krivi email i krivu lozinku
- [x] `requireAuth` middleware
- [x] `GET /api/auth/me`, `POST /api/auth/logout`
- [x] Zod `validate(schema)` middleware
- [x] `AppError` + centralni `errorHandler` + 404 handler // proučit
- [x] CORS s `credentials: true` // proučit

### 0.4 Frontend temelji

- [x] `.env` → `VITE_API_URL`
- [x] `src/api/client.js` (axios instanca)
- [x] `AuthContext` + `useAuth()`
- [x] `ProtectedRoutes` preko contexta
- [x] `AppLayout` (sidebar + `<Outlet/>`), placeholder rute, 404 stranica
- [x] Login/Register: API klijent, shadcn komponente, tekstovi na engleskom
- [x] Logout preko backenda
- [x] README ažuriran

---

## Faza 1: Navike (od baze do sučelja)

- [ ] Migracija: `habits`, `habit_logs`
- [ ] API: CRUD navika + označavanje (`PUT`/`DELETE /api/habits/:id/logs/:date`)
- [ ] Streak za daily, weekly i monthly navike
- [ ] Dashboard: dohvaćanje podataka ručno (`useEffect`)
- [ ] Refaktor na TanStack Query (+ optimistično ažuriranje)
- [ ] AddHabitDialog: react-hook-form + zod
- [ ] Stranica `/habits` (uređivanje, arhiviranje)
- [ ] Integracijski testovi (Vitest + supertest)

## Faza 2: Statistika navika

## Faza 3: Bilježnice i dnevnik

## Faza 4: Planovi i ciljevi

## Faza 5: Kalendar

## Faza 6: Mediji (slike, video)

## Faza 7: Dijeljenje s drugim korisnicima

## Faza 8: Mobitel (PWA) i deploy

_Faze 2–8 detaljno razrađujemo kad dođemo do njih._
