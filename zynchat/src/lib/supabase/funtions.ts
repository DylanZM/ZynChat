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
  const pair = getFriendshipPair(userId, friendId);
  const { error } = await supabase.from('friends').insert(pair);
  if (error) throw error;
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


