-- Create audiobooks table in public schema
CREATE TABLE IF NOT EXISTS public.audiobooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT NOT NULL,
  duration TEXT NOT NULL, -- e.g., "8h 30m"
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audiobooks_category ON public.audiobooks(category);
CREATE INDEX IF NOT EXISTS idx_audiobooks_language ON public.audiobooks(language);
CREATE INDEX IF NOT EXISTS idx_audiobooks_created_at ON public.audiobooks(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_audiobooks_updated_at
  BEFORE UPDATE ON public.audiobooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.audiobooks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view audiobooks (public read access)
CREATE POLICY "Anyone can view audiobooks"
  ON public.audiobooks
  FOR SELECT
  USING (true);

-- Insert sample audiobooks data (only if table is empty)
INSERT INTO public.audiobooks (title, author, cover, duration, category, language)
SELECT * FROM (VALUES
  -- English Books
  (
    'The Midnight Library',
    'Matt Haig',
    'https://images.unsplash.com/photo-1604435062356-a880b007922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '8h 30m',
    'Mystery',
    'English'
  ),
  (
    'The Starless Sea',
    'Erin Morgenstern',
    'https://images.unsplash.com/photo-1730451309552-44e5690629dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '12h 15m',
    'Fantasy',
    'English'
  ),
  (
    'Beach Read',
    'Emily Henry',
    'https://images.unsplash.com/photo-1711185896459-063a3ccdeced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '6h 45m',
    'Romance',
    'English'
  ),
  (
    'Project Hail Mary',
    'Andy Weir',
    'https://images.unsplash.com/photo-1759234008322-70456fcf6aec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '10h 20m',
    'Sci-Fi',
    'English'
  ),
  (
    'The Silent Patient',
    'Alex Michaelides',
    'https://images.unsplash.com/photo-1760696473709-a7da66ee87a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '7h 10m',
    'Thriller',
    'English'
  ),
  (
    'Where the Crawdads Sing',
    'Delia Owens',
    'https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '11h 5m',
    'Fiction',
    'English'
  ),
  -- Arabic Books
  (
    'ألف ليلة وليلة',
    'مجهول',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '15h 20m',
    'Fantasy',
    'Arabic'
  ),
  (
    'الأيام',
    'طه حسين',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '5h 45m',
    'Non-Fiction',
    'Arabic'
  ),
  (
    'رجال في الشمس',
    'غسان كنفاني',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '3h 30m',
    'Fiction',
    'Arabic'
  ),
  (
    'عزازيل',
    'يوسف زيدان',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '9h 15m',
    'Mystery',
    'Arabic'
  ),
  (
    'موسم الهجرة إلى الشمال',
    'الطيب صالح',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '6h 20m',
    'Fiction',
    'Arabic'
  ),
  (
    'قواعد العشق الأربعون',
    'إليف شافاق',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '11h 40m',
    'Romance',
    'Arabic'
  ),
  -- Somali Books
  (
    'Aqoondarro waa Iftiin la''aan',
    'Maxamed Daahir Afrax',
    'https://images.unsplash.com/photo-1519682577862-22b62b24e493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '7h 50m',
    'Non-Fiction',
    'Somali'
  ),
  (
    'Hal aan tebayey',
    'Maxamed Ibrahim Warsame',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '4h 30m',
    'Fiction',
    'Somali'
  ),
  (
    'Gardarro iyo Geesinnimo',
    'Faarax M.J. Cawl',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '6h 10m',
    'Thriller',
    'Somali'
  ),
  (
    'Sheekooyin Soomaaliyeed',
    'Muuse Cumar',
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '8h 25m',
    'Fantasy',
    'Somali'
  ),
  (
    'Taariikh Soomaaliya',
    'Cali Sugulle',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '10h 5m',
    'Non-Fiction',
    'Somali'
  ),
  (
    'Jacayl iyo Cadar',
    'Maryan Mursal',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '5h 35m',
    'Romance',
    'Somali'
  )) AS v(title, author, cover, duration, category, language)
WHERE NOT EXISTS (SELECT 1 FROM public.audiobooks);

