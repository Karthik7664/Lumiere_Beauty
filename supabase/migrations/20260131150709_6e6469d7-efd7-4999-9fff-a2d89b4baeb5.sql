-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skin_analyses table to store analysis history
CREATE TABLE public.skin_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL,
  skin_type TEXT NOT NULL,
  hydration_level INTEGER NOT NULL,
  elasticity_level INTEGER NOT NULL,
  radiance_level INTEGER NOT NULL,
  concerns TEXT[] NOT NULL DEFAULT '{}',
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  morning_routine TEXT[] NOT NULL DEFAULT '{}',
  evening_routine TEXT[] NOT NULL DEFAULT '{}',
  recommended_products JSONB NOT NULL DEFAULT '[]',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_analyses ENABLE ROW LEVEL SECURITY;

-- Helper function to check profile ownership
CREATE OR REPLACE FUNCTION public.is_profile_owner(_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = _profile_id
$$;

-- Helper function to check skin analysis ownership
CREATE OR REPLACE FUNCTION public.is_skin_analysis_owner(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = _user_id
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (public.is_profile_owner(id));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (public.is_profile_owner(id));

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (public.is_profile_owner(id));

-- Skin analyses RLS policies
CREATE POLICY "Users can view their own analyses"
  ON public.skin_analyses FOR SELECT
  USING (public.is_skin_analysis_owner(user_id));

CREATE POLICY "Users can insert their own analyses"
  ON public.skin_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON public.skin_analyses FOR UPDATE
  USING (public.is_skin_analysis_owner(user_id));

CREATE POLICY "Users can delete their own analyses"
  ON public.skin_analyses FOR DELETE
  USING (public.is_skin_analysis_owner(user_id));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();