import { supabase } from "./supabase";
import { Vacancy } from "./types";

export async function fetchVacancies(): Promise<Vacancy[]> {
  const { data, error } = await supabase.from("vacancies").select("*");

  if (error) {
    console.error("Error fetching vacancies:", error);
    return [];
  }

  return data || [];
}

export async function addVacancy(
  vacancy: Omit<Vacancy, "id">
): Promise<Vacancy | null> {
  const { data, error } = await supabase
    .from("vacancies")
    .insert([vacancy])
    .select();

  if (error) {
    console.error("Error adding vacancy:", error);
    return null;
  }

  return data?.[0] || null;
}

export async function updateVacancy(vacancy: Vacancy): Promise<Vacancy | null> {
  const { data, error } = await supabase
    .from("vacancies")
    .update(vacancy)
    .eq("id", vacancy.id)
    .select();

  if (error) {
    console.error("Error updating vacancy:", error);
    return null;
  }

  return data?.[0] || null;
}

export async function deleteVacancy(id: string): Promise<boolean> {
  const { error } = await supabase.from("vacancies").delete().eq("id", id);

  if (error) {
    console.error("Error deleting vacancy:", error);
    return false;
  }

  return true;
}
