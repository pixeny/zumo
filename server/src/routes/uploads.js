import { Router } from 'express'
import multer from 'multer'
import { uploadToImgHippo } from '../lib/imghippo.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const router = Router()

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'file is required' })
  }
  try {
    const url = await uploadToImgHippo(req.file.buffer, req.file.originalname, req.file.mimetype)
    res.json({ url })
  } catch (err) {
    console.error('upload failed', err)
    res.status(500).json({ error: err.message || 'Upload failed' })
  }
})

export default router
