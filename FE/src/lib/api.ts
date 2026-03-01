import { getSupabase } from "./supabase";

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "";
};

export interface UploadImageResponse {
  url: string;
}

/**
 * Upload an image to the backend; returns the public URL (WebP stored).
 * Requires the user to be signed in (Supabase session).
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.set("file", file);
  const res = await fetch(`${baseUrl}/api/v1/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { message?: string }).message ?? res.statusText ?? "업로드에 실패했습니다.";
    throw new Error(message);
  }
  const dataRes = (await res.json()) as UploadImageResponse;
  if (!dataRes?.url) {
    throw new Error("업로드 응답에 URL이 없습니다.");
  }
  return dataRes;
}
