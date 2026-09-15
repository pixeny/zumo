import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.js'
import uploadsRouter from './routes/uploads.js'
import teamRouter from './routes/team.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/chat', chatRouter)
app.use('/api/uploads', uploadsRouter)
app.use('/api/team', teamRouter)

const port = process.env.PORT || 8787
app.listen(port, () => {
  console.log(`Zumo server listening on http://localhost:${port}`)
})
