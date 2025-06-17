export const fetchCelebrityData = async (month, day) => {
  const response = await fetch(`http://localhost:5000/api/celeb/${month}/${day}`);
  const data = await response.json();
  return data; // { born: [], died: [] }
};