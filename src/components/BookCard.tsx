import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Book } from '@/types/database'
import { supabase } from '@/integrations/supabase/client'
import { BookOpen, Calendar, User } from 'lucide-react'

interface BookCardProps {
  book: Book
  onAddToLibrary?: () => void
}

export const BookCard = ({ book, onAddToLibrary }: BookCardProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAddToLibrary = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add books to your library.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_books')
        .insert({
          user_id: user.id,
          book_id: book.id,
          status: 'want-to-read'
        })

      if (error) {
        if (error.code === '23505') { // unique constraint violation
          toast({
            title: "Already in library",
            description: "This book is already in your library.",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Book added!",
          description: `"${book.title}" has been added to your library.`,
        })
        onAddToLibrary?.()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book to library. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-book transition-all duration-300 bg-gradient-card border-0 overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={book.cover_image || '/placeholder.svg'}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
          {book.title}
        </h3>
        <div className="flex items-center space-x-1 text-muted-foreground mb-2">
          <User className="h-4 w-4" />
          <p className="text-sm">{book.author}</p>
        </div>
        {book.published_year && (
          <div className="flex items-center space-x-1 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <p className="text-sm">{book.published_year}</p>
          </div>
        )}
        {book.genre && (
          <Badge variant="secondary" className="mb-3">
            {book.genre}
          </Badge>
        )}
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {book.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="amber"
          className="w-full"
          onClick={handleAddToLibrary}
          disabled={loading}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {loading ? 'Adding...' : 'Want to Read'}
        </Button>
      </CardFooter>
    </Card>
  )
}