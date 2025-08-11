import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { BookOpen, User, LogOut } from 'lucide-react'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              My Library
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="font-medium">
                Home
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/my-books">
                  <Button variant="ghost" className="font-medium">
                    My Books
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}