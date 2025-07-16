import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBook, FaRocket } from 'react-icons/fa';
import { useGetBooksQuery, useCreateBookMutation, useDeleteBookMutation, useGetGenresQuery, useCreateGenreMutation, useDeleteGenreMutation } from '../api/apiSlice';
import CreateBookForm from './CreateBookForm';
import EditBookForm from './EditBookForm';
import CreateGenreForm from './CreateGenreForm';
import QuickSetup from './QuickSetup';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [showCreateBook, setShowCreateBook] = useState(false);
  const [showCreateGenre, setShowCreateGenre] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editingGenre, setEditingGenre] = useState(null);
  
  const { data: booksData, isLoading: booksLoading } = useGetBooksQuery({ page_size: 50 });
  const { data: genres } = useGetGenresQuery();
  const [deleteBook] = useDeleteBookMutation();
  const [deleteGenre] = useDeleteGenreMutation();

  const books = booksData?.results || [];

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId).unwrap();
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

  const handleDeleteGenre = async (genreId) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      try {
        await deleteGenre(genreId).unwrap();
      } catch (err) {
        console.error('Failed to delete genre:', err);
      }
    }
  };

  if (booksLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
            <p className="text-gray-600">Manage books and library content</p>
          </div>
          {books.length === 0 && (
            <button
              onClick={() => setShowQuickSetup(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FaRocket />
              <span>Quick Setup</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'books'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Books ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('genres')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'genres'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Genres ({genres?.length || 0})
          </button>
        </nav>
      </div>

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Manage Books</h3>
            <button
              onClick={() => setShowCreateBook(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add New Book</span>
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {books.map((book) => (
                <li key={book.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaBook className="text-primary-500 mr-3" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{book.title}</h4>
                          <p className="text-sm text-gray-500">by {book.author}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Genre: {book.genre?.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              book.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {book.available ? 'Available' : 'Borrowed'}
                            </span>
                            <span className="text-xs text-gray-500">Read {book.read_count} times</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Genres Tab */}
      {activeTab === 'genres' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Manage Genres</h3>
            <button
              onClick={() => setShowCreateGenre(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add New Genre</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genres?.map((genre) => (
              <div key={genre.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{genre.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(genre.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingGenre(genre)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteGenre(genre.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateBook && (
        <CreateBookForm
          onClose={() => setShowCreateBook(false)}
          genres={genres || []}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onClose={() => setEditingBook(null)}
          genres={genres || []}
        />
      )}

      {(showCreateGenre || editingGenre) && (
        <CreateGenreForm
          genre={editingGenre}
          onClose={() => {
            setShowCreateGenre(false);
            setEditingGenre(null);
          }}
        />
      )}

      {showQuickSetup && (
        <QuickSetup
          onClose={() => setShowQuickSetup(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;