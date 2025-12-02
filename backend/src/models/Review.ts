import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  temple: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  visitDate?: Date;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    temple: {
      type: Schema.Types.ObjectId,
      ref: 'Temple',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    visitDate: {
      type: Date
    },
    helpful: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one review per user per temple
reviewSchema.index({ temple: 1, user: 1 }, { unique: true });
reviewSchema.index({ temple: 1, createdAt: -1 });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (templeId: mongoose.Types.ObjectId) {
  const Temple = mongoose.model('Temple');

  const stats = await this.aggregate([
    { $match: { temple: templeId } },
    {
      $group: {
        _id: '$temple',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Temple.findByIdAndUpdate(templeId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Temple.findByIdAndUpdate(templeId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

// Update temple rating after save
reviewSchema.post('save', async function () {
  await (this.constructor as any).calculateAverageRating(this.temple);
});

// Update temple rating after remove
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await (this.constructor as any).calculateAverageRating(this.temple);
});

export default mongoose.model<IReview>('Review', reviewSchema);
