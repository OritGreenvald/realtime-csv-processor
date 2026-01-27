import { Router } from 'express';
import multer from 'multer';
import { uploadCSV, getJob, getAllJobs, downloadErrorReport } from '../controllers/jobsController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCSV);
router.get('/:id', getJob);
router.get('/', getAllJobs);
router.get('/:id/error-report', downloadErrorReport);


export default router;



