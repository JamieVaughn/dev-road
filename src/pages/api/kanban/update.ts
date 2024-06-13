import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // const formData = await request.formData()
  // const email = formData.get('email')?.toString()
  // const user_id = formData.get('user_id')?.toString()
  // const lane = formData.get('lane')?.toString()
  // const body = {
  //   hw: {
  //     todo: lanes()[0].hw,
  //     doing: lanes()[1].hw,
  //     review: lanes()[2].hw,
  //     done: lanes()[3].hw,
  //   },
  //   proj: {
  //     todo: lanes()[0].proj,
  //     doing: lanes()[1].proj,
  //     review: lanes()[2].proj,
  //     done: lanes()[3].proj,
  //   },
  //   history: history(),
  // }
  const data = await request.json()
  console.log('request kanban', data)

  if(!data) return new Response('No body', { status: 400 })

  type KanbanKeys = 'todo' | 'doing' | 'done' | 'review'
  const { lanes, history, email } = data
  console.log('lanes', lanes, 'history', history, 'email', email)
  const hw: Record<KanbanKeys, string[]> = {todo: [], doing: [], review: [], done: []}
  const proj: Record<KanbanKeys, string[]> = {todo: [], doing: [], review: [], done: []}
  lanes.forEach((lane: {title: KanbanKeys | 'in review', hw: string[], proj: string[]}) => {
      const key = lane.title === 'in review' ? 'review' : lane.title
      hw[key] = lane.hw
      proj[key] = lane.proj
  })
  supabase
      .from("kanban")
      // .update({"test": "lest"})
      .update({hw, proj, history})
      .eq("email", email)
      .select()
      .then(r => r)
      
      return
}