import express from 'express';
import userRoutes from './userRoutes';
import publicationRoutes from './publicationsRoutes';
import reactionRoutes from './reactionRoutes';
import commentRoutes from './commentRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/publications', publicationRoutes)
router.use('/reactions', reactionRoutes);
router.use('/comments', commentRoutes);

// Manejo de rutas no encontradas
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default router;