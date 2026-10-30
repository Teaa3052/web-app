import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import express from 'express' // učitava express modul - to je biblioteka koja olakšava izradu web servera u Node.js
import { config } from './config.js' // port, CORS origin i ostale postavke iz .env
import authRoutes from './routes/auth.js'
import habitRoutes from './routes/habits.js'
import statsRoutes from './routes/stats.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express() // instanca Express aplikacije - app je moj server pomoću kojeg definiram rute
                    // i ponašanje

app.use(helmet()) // postavlja sigurnosne HTTP headere

const corsOptions = {
    origin: config.corsOrigin, // ograničava samo za moj front
    credentials: true, // dopušta frontendu da šalje i prima cookieje (token za login)
}

app.use(cors(corsOptions)) // omogućava komunikaciju između fornt i backenda
// CORS ide prije express.json(), da i odgovor na neispravan JSON ima CORS headere

app.use(express.json()) // čita JSON podatke i pretvara u JS objekte

app.use(cookieParser()) // čita cookieje iz zahtjeva u objekt req.cookies (npr. req.cookies.token)

app.get('/', (req, res) =>  {
    // Definira rutu: kada netko pošalje GET zahtjev na root URL ('/'), poziva se ova funkcija (tzv. callback)
    // 'req' = zahtjev koji dolazi od klijenta (npr. preglednika)
    // 'res' = odgovor koji tvoj server šalje natrag
    res.send("")
    // Šalje tekst kao odgovor klijentu
}) 

app.use("/api/auth", authRoutes)
app.use("/api/habits", habitRoutes)
app.use("/api/stats", statsRoutes) // statistika navika za zadnjih 30 dana

// ova dva moraju biti NAKON svih ruta: zahtjev do njih dođe samo ako ga nijedna ruta nije obradila
app.use(notFound) // nepostojeća ruta -> 404 JSON
app.use(errorHandler) // bilo koja greška -> uredan JSON odgovor

app.listen(config.port, () => {
    // Pokreće server da sluša zahtjeve na odabranom portu
    console.log(`Working on ${config.port}`)
    // Ispisuje poruku u konzolu da server radi
})

