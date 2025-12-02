import { Request, Response } from 'express';
import Review from '../models/Review.js';
import Temple from '../models/Temple.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get reviews for a temple
// @route   GET /api/temples/:id/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response) => {
  try {
    const temple = await Temple.findOne({ id: req.params.id });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    const reviews = await Review.find({ temple: temple._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create review
// @route   POST /api/temples/:id/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment, visitDate } = req.body;

    const temple = await Temple.findOne({ id: req.params.id });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user has already reviewed this temple
    const existingReview = await Review.findOne({
      temple: temple._id,
      user: user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this temple'
      });
    }

    const review = await Review.create({
      temple: temple._id,
      user: user._id,
      rating,
      comment,
      visitDate: visitDate || undefined
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Make sure user owns the review
    if (review.user.toString() !== (user._id as any).toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Make sure user owns the review or is admin
    if (review.user.toString() !== (user._id as any).toString() && user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
