export const getTitlesList = (comic) => {
  if (!comic) return [];
  // Return the main title and all alternative titles in a flat array of lowercase trimmed strings
  return [comic.title, ...(comic.alternativeTitles || [])]
    .map((t) => (t || "").trim().toLowerCase())
    .filter(Boolean);
};

export const isDuplicateTitle = (newComicData, existingComics, excludeId = null) => {
  const newTitlesList = [newComicData.title, ...(newComicData.alternativeTitles || [])]
    .map((t) => (t || "").trim().toLowerCase())
    .filter(Boolean);

  if (newTitlesList.length === 0) return false;

  return existingComics.some((comic) => {
    // Skip if it is the comic currently being edited (for updates)
    if (excludeId && comic.id === excludeId) return false;

    const existingTitlesList = getTitlesList(comic);
    // Returns true if there is any overlap between new and existing titles
    return newTitlesList.some((t) => existingTitlesList.includes(t));
  });
};
