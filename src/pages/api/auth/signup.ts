import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 })
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    // console.log(error)
    return redirect('/error', 500)
  }

  const _profile = await supabase
  .from('profile')
  .insert([{ email }])
  .select()

  return redirect('/login', 200)
}
