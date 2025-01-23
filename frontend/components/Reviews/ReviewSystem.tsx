import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Rating, Avatar, Button, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  comment: string;
  photos: string[];
  clientId: string;
  clientName: string;
  artisanId: string;
  projectId: string;
  date: string;
  verified: boolean;
}

interface ReviewSystemProps {
  artisanId: string;
  projectId?: string;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ artisanId, projectId }) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const { data: reviews, refetch } = useQuery<Review[]>({
    queryKey: ['reviews', artisanId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${artisanId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  const addReviewMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add review');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setRating(null);
      setComment('');
      setPhotos([]);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment || !session?.user) return;

    const formData = new FormData();
    formData.append('rating', rating.toString());
    formData.append('comment', comment);
    formData.append('artisanId', artisanId);
    if (projectId) formData.append('projectId', projectId);
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    try {
      await addReviewMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const averageRating = reviews?.reduce((acc, review) => acc + review.rating, 0) / (reviews?.length || 1);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Avis clients</h2>
        
        <div className="flex items-center mb-6">
          <div className="mr-4">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <Rating value={averageRating} precision={0.5} readOnly />
            <div className="text-sm text-gray-500">{reviews?.length || 0} avis</div>
          </div>
        </div>

        {session?.user && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Votre note</label>
              <Rating
                value={rating}
                onChange={(_, value) => setRating(value)}
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Votre commentaire</label>
              <TextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              disabled={!rating || !comment || addReviewMutation.isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {addReviewMutation.isLoading ? 'Envoi...' : 'Publier l\'avis'}
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Avatar className="mr-4">{review.clientName[0]}</Avatar>
              <div>
                <div className="font-medium">{review.clientName}</div>
                <div className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
              {review.verified && (
                <span className="ml-auto text-green-600 text-sm">✓ Vérifié</span>
              )}
            </div>

            <Rating value={review.rating} readOnly />
            <p className="mt-2 text-gray-700">{review.comment}</p>

            {review.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {review.photos.map((photo, index) => (
                  <div key={index} className="relative h-40">
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
