import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getFriendshipPair(userId: string, friendId: string) {
  return userId < friendId
    ? { user_id: userId, friend_id: friendId }
    : { user_id: friendId, friend_id: userId };
}

export async function addFriend(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from('friends')
    .select('id')
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

  if (error) throw error;
  if (data && data.length > 0) {
    return;
  }

  // Inserta la amistad en ambos sentidos
  const { error: insertError } = await supabase.from('friends').insert([
    { user_id: userId, friend_id: friendId },
    { user_id: friendId, friend_id: userId }
  ]);
  if (insertError) throw insertError;
}



export async function friendshipExists(userId: string, friendId: string) {
  const pair = getFriendshipPair(userId, friendId);
  const { data, error } = await supabase
    .from('friends')
    .select('id')
    .match(pair)
    .single();
  return !!data && !error;
}


