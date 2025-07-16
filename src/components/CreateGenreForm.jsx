import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useCreateGenreMutation, useUpdateGenreMutation } from '../api/apiSlice';

const CreateGenreForm = ({ genre, onClose }) => {
  const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();
  const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation();
  const isEditing = !!genre;
  
  const [name, setName] = useState(genre?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await updateGenre({ id: genre.id, name }).unwrap();
      } else {
        await createGenre({ name }).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err.data?.message || `Failed to ${isEditing ? 'update' : 'create'} genre`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{isEditing ? 'Edit Genre' : 'Add New Genre'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Science Fiction, Romance, Mystery"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="btn-primary disabled:opacity-50"
            >
              {isCreating || isUpdating 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Genre' : 'Create Genre')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGenreForm;