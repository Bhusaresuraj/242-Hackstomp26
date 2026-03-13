import { supabase } from "../lib/supabaseClient";

export async function createOrFetchDoctor() {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("No authenticated user");
    return null;
  }

  const email = user.email;
  const name = user.user_metadata?.name || "Doctor";

  console.log("Checking doctor:", name, email);

  const { data: existingDoctor } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingDoctor) {
    console.log("Doctor exists:", existingDoctor);
    return existingDoctor;
  }

  console.log("Doctor not found, creating...");

  const { data, error } = await supabase
    .from("doctors")
    .insert([
      {
        id: user.id,   // 🔥 IMPORTANT
        name: name,
        email: email,
        verified: false
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Doctor creation error:", error);
    return null;
  }

  console.log("Doctor created:", data);

  return data;
}

export async function updateDoctorProfile(id, formData) {

  const { data, error } = await supabase
    .from("doctors")
    .update({
      name: formData.name,
      degree: formData.degree,
      specialization: formData.specialization,
      experience_years: formData.experience_years,
      hospital: formData.hospital,
      bio: formData.bio,
      profile_image: formData.profile_image,
      registration_number: formData.registration_number
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update doctor error:", error);
    return null;
  }

  return data;
}