import { useEffect, useState } from 'react'
import { BookCard } from '@/components/BookCard'
import { Book } from '@/types/database'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BookOpen, Sparkles } from 'lucide-react'

export const Home = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('availability', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your next great read...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-white/80 mr-3 animate-float" />
              <BookOpen className="h-12 w-12 text-white animate-float" />
              <Sparkles className="h-8 w-8 text-white/80 ml-3 animate-float" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              Discover Your Next
              <span className="block text-amber-200">Great Read</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Track your reading journey, discover new books, and connect with a community of book lovers.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Books Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Books</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of books across various genres and discover your next favorite story.
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No books available</h3>
            <p className="text-muted-foreground">Check back later for new additions to our library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <div
                key={book.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} onAddToLibrary={fetchBooks} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}