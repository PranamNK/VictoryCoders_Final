import { Request, Response } from 'express';
import Temple from '../models/Temple.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all temples
// @route   GET /api/temples
// @access  Public
export const getTemples = async (req: Request, res: Response) => {
  try {
    const { region, search, sort } = req.query;

    let query: any = {};

    // Filter by region
    if (region) {
      query.region = region;
    }

    // Search by name, location, or deity
    if (search) {
      query.$text = { $search: search as string };
    }

    let templesQuery = Temple.find(query);

    // Sort
    if (sort === 'rating') {
      templesQuery = templesQuery.sort({ averageRating: -1 });
    } else if (sort === 'name') {
      templesQuery = templesQuery.sort({ name: 1 });
    } else {
      templesQuery = templesQuery.sort({ createdAt: -1 });
    }

    const temples = await templesQuery;

    res.status(200).json({
      success: true,
      count: temples.length,
      data: temples
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single temple
// @route   GET /api/temples/:id
// @access  Public
export const getTemple = async (req: Request, res: Response) => {
  try {
    const temple = await Temple.findOne({ id: req.params.id });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    res.status(200).json({
      success: true,
      data: temple
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create temple
// @route   POST /api/temples
// @access  Private/Admin
export const createTemple = async (req: Request, res: Response) => {
  try {
    const temple = await Temple.create(req.body);

    res.status(201).json({
      success: true,
      data: temple
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update temple
// @route   PUT /api/temples/:id
// @access  Private/Admin
export const updateTemple = async (req: Request, res: Response) => {
  try {
    const temple = await Temple.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    res.status(200).json({
      success: true,
      data: temple
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete temple
// @route   DELETE /api/temples/:id
// @access  Private/Admin
export const deleteTemple = async (req: Request, res: Response) => {
  try {
    const temple = await Temple.findOneAndDelete({ id: req.params.id });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

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

// @desc    Add temple to favorites
// @route   POST /api/temples/:id/favorite
// @access  Private
export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
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

    if (user.favorites.some((fav) => fav.toString() === (temple._id as any).toString())) {
      return res.status(400).json({
        success: false,
        message: 'Temple already in favorites'
      });
    }

    user.favorites.push(temple._id as any);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove temple from favorites
// @route   DELETE /api/temples/:id/favorite
// @access  Private
export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
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

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== (temple._id as any).toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
