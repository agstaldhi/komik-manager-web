export const getTitlesList = (fullTitle) => {
  if (!fullTitle) return [];
  // Memecah string dengan separator "|" lalu membersihkan spasi dan mengonversi ke lowercase
  return fullTitle
    .split("|")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
};

export const isDuplicateTitle = (newTitle, existingComics, excludeId = null) => {
  const newTitlesList = getTitlesList(newTitle);
  if (newTitlesList.length === 0) return false;

  return existingComics.some((comic) => {
    // Lewati jika merupakan komik yang sedang di-edit (berdasarkan excludeId)
    if (excludeId && comic.id === excludeId) return false;

    const existingTitlesList = getTitlesList(comic.title);
    // Mengembalikan true jika ada satu saja judul yang beririsan
    return newTitlesList.some((t) => existingTitlesList.includes(t));
  });
};
