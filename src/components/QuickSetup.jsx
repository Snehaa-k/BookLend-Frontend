import { useState } from 'react';
import { useCreateGenreMutation, useCreateBookMutation, useGetGenresQuery } from '../api/apiSlice';

const QuickSetup = ({ onClose }) => {
  const [createGenre] = useCreateGenreMutation();
  const [createBook] = useCreateBookMutation();
  const { data: genres = [] } = useGetGenresQuery();
  const [isLoading, setIsLoading] = useState(false);

  const sampleGenres = ['Fiction', 'Science Fiction', 'Romance', 'Mystery', 'Fantasy'];
  
  const sampleBooks = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', description: 'A classic American novel' },
    { title: '1984', author: 'George Orwell', genre: 'Science Fiction', description: 'A dystopian masterpiece' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', description: 'A timeless romance' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'An epic fantasy adventure' },
    { title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'Mystery', description: 'Classic detective stories' }
  ];

  const setupSampleData = async () => {
    setIsLoading(true);
    try {
      // Create genres first
      const genreMap = {};
      for (const genreName of sampleGenres) {
        const existingGenre = genres.find(g => g.name === genreName);
        if (existingGenre) {
          genreMap[genreName] = existingGenre.id;
        } else {
          const result = await createGenre({ name: genreName }).unwrap();
          genreMap[genreName] = result.id;
        }
      }

      // Create books
      for (const book of sampleBooks) {
        await createBook({
          title: book.title,
          author: book.author,
          description: book.description,
          genre: genreMap[book.genre]
        }).unwrap();
      }

      alert('Sample data created successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to create sample data:', err);
      alert('Failed to create sample data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup</h3>
        <p className="text-gray-600 mb-6">
          This will create sample genres and books to get you started with the library system.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={setupSampleData}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Sample Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSetup;