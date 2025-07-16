import { FaBook, FaBookOpen, FaUsers, FaStar, FaEye } from 'react-icons/fa';
import { useGetBooksQuery, useGetUserStatsQuery, useGetBorrowedBooksQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const { data: booksData, isLoading: booksLoading } = useGetBooksQuery({ page_size: 10 });
  const { data: userStats, isLoading: statsLoading } = useGetUserStatsQuery();
  const { data: borrowedBooks = [], isLoading: borrowedLoading } = useGetBorrowedBooksQuery();

  const books = booksData?.results || [];
  const totalBooks = booksData?.count || 0;
  const userBorrowedCount = userStats?.currently_borrowed || 0;
  const userTotalReads = userStats?.total_books_borrowed || 0;
  const userReviews = userStats?.reviews_written || 0;

  const stats = [
    {
      title: 'Library Books',
      value: totalBooks,
      icon: FaBook,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Books Read',
      value: userTotalReads,
      icon: FaUsers,
      color: 'bg-purple-500'
    },
    {
      title: 'Reviews Written',
      value: userReviews,
      icon: FaStar,
      color: 'bg-yellow-500'
    }
  ];

  const popularBooks = [...books]
    .sort((a, b) => b.read_count - a.read_count)
    .slice(0, 3);

  if (booksLoading || statsLoading || borrowedLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back, {user?.first_name || user?.username}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Books</h3>
          <div className="space-y-3">
            {popularBooks.map((book, index) => (
              <div key={book.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaEye className="mr-1" />
                  {book.read_count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Reading Activity</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Books Read</p>
              <p className="text-2xl font-bold text-primary-600">{userStats?.total_books_borrowed || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Favorite Genres</p>
              <div className="flex flex-wrap gap-2">
                {userStats?.favorite_genres?.map(genre => (
                  <span
                    key={genre.book__genre__name}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                  >
                    {genre.book__genre__name}
                  </span>
                )) || <span className="text-xs text-gray-400">No data yet</span>}
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;