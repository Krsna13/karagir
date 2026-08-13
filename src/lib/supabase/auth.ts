import { supabase } from './client';

export const signInWithPhone = async (phone: string, passwordHash: string) => {
  // Convert phone to pseudo-email to bypass Supabase SMS restrictions
  const pseudoEmail = `${phone}@karagir.local`;
  const securePass = passwordHash.length < 6 ? passwordHash.padEnd(6, '0') : passwordHash;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: pseudoEmail,
    password: securePass,
  });
  
  return { data, error };
};

export const signUpWithPhone = async (phone: string, passwordHash: string, name: string) => {
  const pseudoEmail = `${phone}@karagir.local`;
  const securePass = passwordHash.length < 6 ? passwordHash.padEnd(6, '0') : passwordHash;
  const { data, error } = await supabase.auth.signUp({
    email: pseudoEmail,
    password: securePass,
    options: {
      data: {
        full_name: name,
        phone: phone // store original phone in metadata
      }
    }
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
