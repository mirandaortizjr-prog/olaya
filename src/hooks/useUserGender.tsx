import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserGender = (userId: string | null) => {
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchGender = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('gender')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          setGender(data.gender);
        }
      } catch (err) {
        console.error('Error fetching user gender:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGender();
  }, [userId]);

  return { gender, loading };
};
