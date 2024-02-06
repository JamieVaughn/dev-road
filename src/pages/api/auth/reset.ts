import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  if (!email) {
    return new Response("Email is required", { status: 400 });
  }
  let { data, error } = await supabase.auth.resetPasswordForEmail(email)
  if(error) return new Response(error.message, { status: 500 });
  if(data) return new Response("Password reset email sent", { status: 200 });
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/login?reset=true");
};