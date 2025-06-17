// frontend/src/api/music.js
export const fetchTopTracks = async (date) => {
  try {
    const response = await fetch(`/api/music/${date}`);
    const data = await response.json();
    return data.topTracks || [];
  } catch (error) {
    console.error("Music API Error:", error);
    return [];
  }
};
