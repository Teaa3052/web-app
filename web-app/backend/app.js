import cors from 'cors'
import helmet from 'helmet'
import express from 'express' // učitava express modul - to je biblioteka koja olakšava izradu web servera u Node.js
import authRoutes from './routes/auth.js'

const app = express() // instanca Express aplikacije - app je moj server pomoću kojeg definiram rute
                    // i ponašanje
const port = 3000 // broj porta na kojem će server "slušati" zahtjeve


app.use(express.json()) // čita JSON podatke i pretvara u JS objekte

app.use(helmet()) // postavlja sigurnosne HTTP headere

const corsOptions = {
    origin: 'http://localhost:3000', // backend je na 3000 poslije ćemo promjenit
} // ograničava samo za moj front 

app.use(cors(corsOptions)) // omogućava komunikaciju između fornt i backenda

app.get('/', (req, res) =>  {
    // Definira rutu: kada netko pošalje GET zahtjev na root URL ('/'), poziva se ova funkcija (tzv. callback)
    // 'req' = zahtjev koji dolazi od klijenta (npr. preglednika)
    // 'res' = odgovor koji tvoj server šalje natrag
    res.send("Hello World")
    // Šalje tekst Hello World kao odgovor klijentu
}) 

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    // Pokreće server da sluša zahtjeve na odabranom portu
    console.log(`Working on ${port}`)
    // Ispisuje poruku u konzolu da server radi
})

