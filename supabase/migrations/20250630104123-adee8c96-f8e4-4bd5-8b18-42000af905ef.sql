
-- Update the handle_new_user function to support creating admin accounts
-- This will allow setting a user as admin during signup if specified
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
END;
$$;

-- Create a function to manually promote a user to admin (for initial setup)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update their role to admin
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$;
