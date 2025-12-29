import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reviewAPI, Review } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface TempleReviewsProps {
  templeId: string;
}

const TempleReviews = ({ templeId }: TempleReviewsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  /* New State */
  const [images, setImages] = useState<FileList | null>(null);

  const [editingReview, setEditingReview] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, [templeId]);

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getByTemple(templeId);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to write a review',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('comment', comment);

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }

      const response = await reviewAPI.create(templeId, formData);
      setReviews([response.data, ...reviews]);
      setComment('');
      setRating(5);
      setImages(null);

      // Reset file input
      const fileInput = document.getElementById('review-images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      toast({
        title: 'Review submitted!',
        description: 'Thank you for sharing your experience',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast({
        title: 'Failed to submit review',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewAPI.delete(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast({
        title: 'Review deleted',
        description: 'Your review has been removed',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast({
        title: 'Failed to delete review',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange?: (val: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`transition-colors ${onChange ? 'cursor-pointer hover:scale-110' : ''}`}
          disabled={!onChange}
        >
          <Star
            className={`h-5 w-5 ${star <= value ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
              }`}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Write Review Form */}
      {!isAuthenticated && (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground mb-4">Please login to share your experience and photos</p>
            <Button asChild>
              <a href="/login">Login to Write a Review</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your experience visiting this temple</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Review</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this temple..."
                  className="min-h-[120px]"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {comment.length}/500 characters
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Add Photos</label>
                <input
                  id="review-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload up to 5 photos (JPG, PNG)
                </p>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
          <CardDescription>
            See what others are saying about this temple
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id}>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{review.user.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating value={review.rating} />
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                        {user && user.id === review.user._id && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                          {review.images.map((img, index) => (
                            <img
                              key={index}
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/..${img}`}
                              alt={`Review image ${index + 1}`}
                              className="h-24 w-24 object-cover rounded-md border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TempleReviews;
