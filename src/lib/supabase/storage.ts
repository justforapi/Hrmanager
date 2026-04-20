import { createServerClient } from "@/lib/supabase/server";

export async function uploadToBucket(params: {
  bucket: string;
  path: string;
  file: File;
}) {
  const supabase = createServerClient();
  const arrayBuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(params.bucket)
    .upload(params.path, buffer, {
      contentType: params.file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(params.bucket).getPublicUrl(params.path);
  return data.publicUrl;
}
