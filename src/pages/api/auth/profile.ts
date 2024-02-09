import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const first_name = formData.get("firstname")?.toString();
  const last_name = formData.get("lastname")?.toString();
  const fcc_id = formData.get("fcc")?.toString();
  const linkedin_id = formData.get("linkedin")?.toString();
  const discord_id = formData.get("discord")?.toString();
  const hobbies = formData.get("hobbies")?.toString();

  if (!email) {
    return new Response("User email not found", { status: 400 });
  }

  const filteredObj = Object.entries({ first_name, last_name, fcc_id, linkedin_id, discord_id, hobbies}).filter(([_, v]) => v?.valueOf && v.trim().length > 0);

  // update
  const { error } = await supabase
  .from('profile')
  .update(Object.fromEntries(filteredObj))
  .eq('email', email)
  .select()

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/profile");
};