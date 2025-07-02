import { Router } from 'express';
import { createComment, getComments, updateComment, deleteComment, restoreComment, getCommentById } from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware'; 

const router = Router();

router.post('/createComment', authenticateToken, createComment); 
router.get('/comments', getComments);
router.put('/updateComment/:id', authenticateToken, updateComment); 
router.delete('/deleteComment/:id', authenticateToken, deleteComment); 
router.post('/restoreComment/:id', authenticateToken, restoreComment); 
router.get('/getCommentById/:id', getCommentById);

export default router;