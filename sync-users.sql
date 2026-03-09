
INSERT INTO public.users (id, email, name, avatar_url, created_at)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'Unknown User') as name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;
