-- Fix security issues: Block anonymous access and ensure RLS is properly enforced

-- 1. PROFILES TABLE: Block anonymous access to user emails
REVOKE ALL ON public.profiles FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- 2. COUPLES TABLE: Block anonymous access to invite codes
REVOKE ALL ON public.couples FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON public.couples TO authenticated;

-- 3. COUPLE_MEMBERS TABLE: Block anonymous access
REVOKE ALL ON public.couple_members FROM anon, public;
GRANT SELECT, INSERT, DELETE ON public.couple_members TO authenticated;

-- 4. QUICK_MESSAGES TABLE: Block anonymous access
REVOKE ALL ON public.quick_messages FROM anon, public;
GRANT SELECT, INSERT ON public.quick_messages TO authenticated;