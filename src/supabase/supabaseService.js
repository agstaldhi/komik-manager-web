import { supabase } from "./supabase";

// Helper: Map Supabase PostgreSQL row to frontend model (joining titles with ' | ')
const mapSupabaseToFrontend = (item) => {
  if (!item) return null;
  const fullTitle = [item.title, ...(item.alternative_titles || [])].join(" | ");
  return {
    id: item.id,
    title: fullTitle,
    episode: item.episode,
    link: item.link,
    isNSFW: item.is_nsfw,
    thumbnail: item.thumbnail || "",
    updatedAt: item.updated_at,
  };
};

// Helper: Split frontend title string into main title and alternative titles array
const splitTitle = (fullTitle) => {
  const parts = (fullTitle || "").split("|").map((t) => t.trim());
  return {
    title: parts[0] || "",
    alternative_titles: parts.slice(1).filter((t) => t.length > 0),
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
    const { title, alternative_titles } = splitTitle(comicData.title);
    const { data, error } = await supabase
      .from("comics")
      .insert([
        {
          title,
          alternative_titles,
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
    const { title, alternative_titles } = splitTitle(comicData.title);
    const { data, error } = await supabase
      .from("comics")
      .update({
        title,
        alternative_titles,
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
    const insertData = comicsArray.map((comic) => {
      const { title, alternative_titles } = splitTitle(comic.title);
      return {
        title,
        alternative_titles,
        episode: parseInt(comic.episode),
        link: comic.link,
        is_nsfw: comic.isNSFW || false,
        thumbnail: comic.thumbnail || "",
      };
    });

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
