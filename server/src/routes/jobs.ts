import { Router } from 'express';
import multer from 'multer';
import { uploadCSV, getJob, getAllJobs } from '../controllers/jobsController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCSV);
router.get('/:id', getJob);
router.get('/', getAllJobs);

export default router;
