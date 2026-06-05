import { supabase } from "./supabase";

// Helper: Map Supabase PostgreSQL row to frontend model
const mapSupabaseToFrontend = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title || "",
    alternativeTitles: item.alternative_titles || [],
    episode: item.episode,
    link: item.link,
    isNSFW: item.is_nsfw,
    thumbnail: item.thumbnail || "",
    updatedAt: item.updated_at,
  };
};

// Get all comics from Supabase
export const getAllComics = async () => {
  try {
    const { data, error } = await supabase
      .from("comics")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return (data || []).map(mapSupabaseToFrontend);
  } catch (error) {
    console.error("Error getting all comics from Supabase:", error);
    throw error;
  }
};

// Add new comic
export const addComic = async (comicData) => {
  try {
    const { data, error } = await supabase
      .from("comics")
      .insert([
        {
          title: (comicData.title || "").trim(),
          alternative_titles: comicData.alternativeTitles || [],
          episode: parseInt(comicData.episode),
          link: comicData.link,
          is_nsfw: comicData.isNSFW || false,
          thumbnail: comicData.thumbnail || "",
        },
      ])
      .select();

    if (error) throw error;
    return mapSupabaseToFrontend(data[0]);
  } catch (error) {
    console.error("Error adding comic:", error);
    throw error;
  }
};

// Update comic
export const updateComic = async (comicId, comicData) => {
  try {
    const { data, error } = await supabase
      .from("comics")
      .update({
        title: (comicData.title || "").trim(),
        alternative_titles: comicData.alternativeTitles || [],
        episode: parseInt(comicData.episode),
        link: comicData.link,
        is_nsfw: comicData.isNSFW || false,
        thumbnail: comicData.thumbnail || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", comicId)
      .select();

    if (error) throw error;
    return mapSupabaseToFrontend(data[0]);
  } catch (error) {
    console.error("Error updating comic:", error);
    throw error;
  }
};

// Delete comic
export const deleteComic = async (comicId) => {
  try {
    const { error } = await supabase
      .from("comics")
      .delete()
      .eq("id", comicId);

    if (error) throw error;
    return comicId;
  } catch (error) {
    console.error("Error deleting comic:", error);
    throw error;
  }
};

// Bulk upload
export const bulkUploadComics = async (comicsArray) => {
  try {
    const insertData = comicsArray.map((comic) => ({
      title: (comic.title || "").trim(),
      alternative_titles: comic.alternativeTitles || [],
      episode: parseInt(comic.episode),
      link: comic.link,
      is_nsfw: comic.isNSFW || false,
      thumbnail: comic.thumbnail || "",
    }));

    const { data, error } = await supabase
      .from("comics")
      .insert(insertData)
      .select();

    if (error) throw error;
    return data.length;
  } catch (error) {
    console.error("Error bulk uploading comics:", error);
    throw error;
  }
};
