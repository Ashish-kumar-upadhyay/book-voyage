import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { MyBookCard } from '@/components/MyBookCard'
import { useAuth } from '@/context/AuthContext'
import { UserBook } from '@/types/database'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BookOpen, Library, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const MyBooks = () => {
  const { user, loading: authLoading } = useAuth()
  const [userBooks, setUserBooks] = useState<UserBook[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUserBooks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_books')
        .select(`
          *,
          book:books(*)
        `)
        .eq('user_id', user.id)
        .order('date_added', { ascending: false })

      if (error) throw error
      setUserBooks(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your books. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserBooks()
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const stats = {
    total: userBooks.length,
    wantToRead: userBooks.filter(book => book.status === 'want-to-read').length,
    currentlyReading: userBooks.filter(book => book.status === 'currently-reading').length,
    read: userBooks.filter(book => book.status === 'read').length,
    avgRating: userBooks.filter(book => book.rating).reduce((acc, book) => acc + (book.rating || 0), 0) / userBooks.filter(book => book.rating).length || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your library...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Library className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">My Library</h1>
          </div>
          <p className="text-muted-foreground">Track your reading journey and manage your book collection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Want to Read</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">{stats.wantToRead}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Books in your wishlist</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Reading</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">{stats.currentlyReading}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Books you're reading now</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.read}</div>
              {stats.avgRating > 0 && (
                <div className="text-sm text-muted-foreground">
                  Avg rating: {stats.avgRating.toFixed(1)} ⭐
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Books Grid */}
        {userBooks.length === 0 ? (
          <div className="text-center py-12">
            <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-6">Start building your reading collection by adding some books!</p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userBooks.map((userBook, index) => (
              <div
                key={userBook.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MyBookCard userBook={userBook} onUpdate={fetchUserBooks} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}