import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StarRating } from '@/components/StarRating'
import { useToast } from '@/hooks/use-toast'
import { UserBook } from '@/types/database'
import { supabase } from '@/integrations/supabase/client'
import { Calendar, User, Trash2 } from 'lucide-react'

interface MyBookCardProps {
  userBook: UserBook
  onUpdate: () => void
}

const statusOptions = [
  { value: 'want-to-read', label: 'Want to Read', color: 'bg-blue-100 text-blue-800' },
  { value: 'currently-reading', label: 'Currently Reading', color: 'bg-green-100 text-green-800' },
  { value: 'read', label: 'Read', color: 'bg-purple-100 text-purple-800' },
]

export const MyBookCard = ({ userBook, onUpdate }: MyBookCardProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const book = userBook.book!

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      const updates: any = { status: newStatus }
      if (newStatus === 'read' && !userBook.date_finished) {
        updates.date_finished = new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_books')
        .update(updates)
        .eq('id', userBook.id)

      if (error) throw error

      toast({
        title: "Status updated",
        description: `Book status changed to "${statusOptions.find(s => s.value === newStatus)?.label}".`,
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = async (newRating: number) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_books')
        .update({ rating: newRating })
        .eq('id', userBook.id)

      if (error) throw error

      toast({
        title: "Rating updated",
        description: `You rated "${book.title}" ${newRating} star${newRating !== 1 ? 's' : ''}.`,
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_books')
        .delete()
        .eq('id', userBook.id)

      if (error) throw error

      toast({
        title: "Book removed",
        description: `"${book.title}" has been removed from your library.`,
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const currentStatus = statusOptions.find(s => s.value === userBook.status)

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
        
        <div className="space-y-3 mt-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
            <Select value={userBook.status} onValueChange={handleStatusChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
            <StarRating
              rating={userBook.rating || 0}
              onRatingChange={handleRatingChange}
            />
          </div>
        </div>

        {userBook.date_finished && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Finished: {new Date(userBook.date_finished).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={loading}
          className="w-full text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove from Library
        </Button>
      </CardFooter>
    </Card>
  )
}