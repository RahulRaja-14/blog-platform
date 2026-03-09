'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSessionAction() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase.from('sessions').select('*').eq('user_id', user.id).single();

  if (!data) {
    await supabase.from('sessions').insert({ user_id: user.id });
  }

  revalidatePath('/', 'layout');
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function createUserProfileAction(id: string, name: string, email: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .insert([
        { id, name, email },
      ]);
    
    if (error) {
      console.error('Error in createUserProfileAction:', error);
      throw new Error(error.message);
    }
  }

export async function revalidateDashboardAction() {
    revalidatePath('/dashboard', 'layout');
}
