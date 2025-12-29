import express from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, upload.array('images', 5), createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
