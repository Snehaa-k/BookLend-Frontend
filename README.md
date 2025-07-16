# Book Lending & Recommendation System

A modern React application built with Vite and Tailwind CSS for managing book lending and recommendations.

## Features

### 🔐 User Authentication
- Login/Register interface (currently static - accepts any credentials)
- JWT-ready structure for future backend integration

### 📚 Book Browsing
- View all available books with covers, descriptions, and metadata
- Filter by genre, author, and availability status
- Search functionality across titles and authors
- Responsive grid layout

### 📖 Lending System
- Borrow available books with one click
- Automatic availability tracking
- Read count tracking for popularity metrics
- Return books functionality

### 📋 My Books
- View currently borrowed books
- See borrowing and due dates
- Easy return functionality

### 🎯 Recommendations
- Personalized recommendations based on borrowing history
- Fallback to popular books for new users
- Genre-based suggestions
- Top 5 curated results

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **State Management**: React useState hooks
- **Data**: Static mock data (ready for API integration)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd book-lending-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header
│   ├── Login.jsx           # Authentication component
│   ├── BookCard.jsx        # Individual book display
│   ├── FilterBar.jsx       # Search and filter controls
│   ├── BrowseBooks.jsx     # Main book browsing view
│   ├── BorrowedBooks.jsx   # User's borrowed books
│   └── Recommendations.jsx # Personalized suggestions
├── data/
│   └── mockData.js         # Static data for books and users
├── App.jsx                 # Main application component
├── index.css               # Tailwind CSS imports and custom styles
└── main.jsx                # Application entry point
```

## Features in Detail

### Book Management
- Each book includes: title, author, genre, availability, read count, description, and cover image
- Real-time availability updates when books are borrowed/returned
- Popularity tracking through read counts

### Filtering & Search
- Multi-criteria filtering (genre, author, availability)
- Real-time search across book titles and authors
- Responsive filter controls

### Recommendation Engine
- Analyzes user's borrowing history for genre preferences
- Combines personal preferences with global popularity
- Provides diverse recommendations while respecting user taste

## Future Enhancements

### Backend Integration Ready
- Component structure supports easy API integration
- State management prepared for async operations
- Authentication flow ready for JWT implementation

### Planned Features
- User profiles and reading statistics
- Book reviews and ratings
- Advanced recommendation algorithms
- Admin panel for book management
- Email notifications for due dates
- Book reservation system

## Demo Credentials

For the static version, use any email/password combination to log in.

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Customization
- Modify `src/data/mockData.js` to change book data
- Update Tailwind config in `tailwind.config.js` for styling changes
- Add new components in `src/components/` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.