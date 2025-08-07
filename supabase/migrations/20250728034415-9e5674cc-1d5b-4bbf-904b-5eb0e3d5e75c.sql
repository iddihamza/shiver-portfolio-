-- Fix database function search paths for security
-- This prevents search path attacks on SECURITY DEFINER functions

-- 1. Fix get_character_profile_user_id function
ALTER FUNCTION public.get_character_profile_user_id(uuid) SET search_path = '';

-- 2. Fix has_role function  
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = '';

-- 3. Fix get_story_user_id function
ALTER FUNCTION public.get_story_user_id(uuid) SET search_path = '';

-- 4. Fix update_story_word_count function
ALTER FUNCTION public.update_story_word_count() SET search_path = '';

-- 5. Fix get_chapter_user_id function
ALTER FUNCTION public.get_chapter_user_id(uuid) SET search_path = '';

-- 6. Fix get_current_user_role function
ALTER FUNCTION public.get_current_user_role() SET search_path = '';

-- 7. Fix handle_new_user function
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- 8. Fix get_character_user_id function
ALTER FUNCTION public.get_character_user_id(uuid) SET search_path = '';

-- 9. Fix update_updated_at_column function
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';