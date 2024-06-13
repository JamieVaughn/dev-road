import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {

  console.log('request kanban', request)
  const data = await request.json()
  console.log('request kanban', data)

  if(!data) return new Response('No body', { status: 400 })

  type KanbanKeys = 'todo' | 'doing' | 'done' | 'review'
  const { lanes, historyHw, historyProj, email } = data

  const hw: Record<KanbanKeys, string[]> = {todo: [], doing: [], review: [], done: []}
  const proj: Record<KanbanKeys, string[]> = {todo: [], doing: [], review: [], done: []}
  lanes.forEach((lane: { title: KanbanKeys, hw: string[], proj: string[] }) => {
      const key = lane.title
      hw[key] = lane.hw
      proj[key] = lane.proj
  })
  supabase
    .from("kanban_hw")
    .update({...hw, history: historyHw})
    .eq("email", email)
    .select()
    .then(r => r)

  supabase
    .from("kanban_proj")
    .update({...proj, history: historyProj})
    .eq("email", email)
    .select()
    .then(r => r)
      
  return new Response(JSON.stringify({message: 'Kanban board updated'}), { status: 200 })
}