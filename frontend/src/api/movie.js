// src/api/movie.js
export const fetchMovies = async (date) => {
  try {
    const response = await fetch(`http://localhost:5000/api/movies/${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    return data.movies || [];
  } catch (error) {
    console.error('🎬 Movie API Error:', error);
    return [];
  }
};
