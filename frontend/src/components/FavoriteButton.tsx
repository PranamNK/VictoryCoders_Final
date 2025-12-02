import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { templeAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  templeId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const FavoriteButton = ({
  templeId,
  variant = 'ghost',
  size = 'icon',
  className = ''
}: FavoriteButtonProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isFavorite = user?.favorites?.includes(templeId) || false;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events

    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to save favorites',
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await templeAPI.removeFromFavorites(templeId);
        toast({
          title: 'Removed from favorites',
          description: 'Temple removed from your favorites',
        });
      } else {
        await templeAPI.addToFavorites(templeId);
        toast({
          title: 'Added to favorites',
          description: 'Temple added to your favorites',
        });
      }
      // Reload user data to update favorites
      window.location.reload(); // Simple reload for now, could be optimized with state management
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast({
        title: 'Failed to update favorites',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={loading}
      className={className}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''
          }`}
      />
    </Button>
  );
};

export default FavoriteButton;
