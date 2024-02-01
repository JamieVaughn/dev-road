import { supabase } from '../lib/supabase';

type CheckAuthProps = {
  cookies: any;
  redirect: any;
};
export const checkAuth = async ({ cookies, redirect }: CheckAuthProps) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) return redirect("/login");

  const { data, error } = await supabase.auth.setSession({
    refresh_token: refreshToken.value,
    access_token: accessToken.value,
  });

  if (error) {
    cookies.delete("sb-access-token", { path: "/"});
    cookies.delete("sb-refresh-token", {path: "/"});
    return redirect("/login");
  }

  return data
}