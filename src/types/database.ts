export interface Book {
  id: string
  title: string
  author: string
  cover_image?: string
  description?: string
  isbn?: string
  published_year?: number
  genre?: string
  availability: boolean
  created_at: string
}

export interface UserBook {
  id: string
  user_id: string
  book_id: string
  status: 'want-to-read' | 'currently-reading' | 'read'
  rating?: number
  notes?: string
  date_added: string
  date_finished?: string
  book?: Book
}

export interface Profile {
  id: string
  email: string
  created_at: string
}