import { createClient } from '@supabase/supabase-js';

// Estas variáveis serão configuradas no Vercel no próximo passo.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("As variáveis de ambiente do Supabase não foram encontradas.");
}

// Cria e exporta o cliente Supabase para ser usado em toda a aplicação.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
