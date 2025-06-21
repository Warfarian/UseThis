import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { BrowsePage } from './pages/BrowsePage'
import { ItemDetailsPage } from './pages/ItemDetailsPage'
import { AddListingPage } from './pages/AddListingPage'
import { BookingsPage } from './pages/BookingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReviewsPage } from './pages/ReviewsPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-float">
          <div className="w-16 h-16 bg-accent-1 rounded-full flex items-center justify-center">
            <span className="text-canvas font-bold text-2xl">U</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        
        {user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="item/:id" element={<ItemDetailsPage />} />
            <Route path="add-listing" element={<AddListingPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reviews" element={<ReviewsPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  )
}

export default App