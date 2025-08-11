-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT,
  description TEXT,
  isbn TEXT,
  published_year INTEGER,
  genre TEXT,
  availability BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_books table for tracking user's reading progress
CREATE TABLE public.user_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('want-to-read', 'currently-reading', 'read')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_finished TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, book_id)
);

-- Enable RLS on books table
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_books table
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;

-- Create policies for books table (public read access)
CREATE POLICY "Books are publicly readable" 
ON public.books 
FOR SELECT 
USING (true);

-- Create policies for user_books table (user-specific access)
CREATE POLICY "Users can view their own books" 
ON public.user_books 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add books to their library" 
ON public.user_books 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" 
ON public.user_books 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" 
ON public.user_books 
FOR DELETE 
USING (auth.uid() = user_id);

-- Insert some sample books
INSERT INTO public.books (title, author, cover_image, description, published_year, genre) VALUES
('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop', 'Your journey to mastery in software development', 1999, 'Technology'),
('Clean Code', 'Robert C. Martin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', 'A handbook of agile software craftsmanship', 2008, 'Technology'),
('The Midnight Library', 'Matt Haig', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', 'A novel about infinite possibilities', 2020, 'Fiction'),
('Atomic Habits', 'James Clear', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', 'Tiny changes, remarkable results', 2018, 'Self-Help'),
('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', 'A reclusive Hollywood icon tells her story', 2017, 'Fiction');