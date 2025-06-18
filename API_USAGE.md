# Time Travelers – API Usage Guide

## 🔐 Authentication

### `GET /api/auth/check-auth`
- **Purpose**: Check login status (used on initial load)  
- **Used in**: `AuthContext.js → checkAuthStatus()`

### `POST /api/auth/login`
- **Purpose**: Log in a user and start session  
- **Used in**: `AuthContext.js → login()`

### `POST /api/auth/logout`
- **Purpose**: Log out current session  
- **Used in**: `AuthContext.js → logout()`

---

## 🌤 Weather API

### `GET /api/time/:date/weather`
- **Purpose**: Fetch historical weather on a specific date  
- **Params**: `:date` in `YYYY-MM-DD`  
- **Used in**: `TimeResultPage.js → fetchWeatherData()`  
- **🛠 Uses External API**: [Open-Meteo](https://open-meteo.com/)

---

## 📰 News API

### `GET /api/news/:date`
- **Purpose**: Get major news headlines for the date  
- **Params**: `:date` in `YYYY-MM-DD`  
- **Used in**: `TimeResultPage.js → fetchNewsArticles()`  
- **🛠 Uses External API**: [The Guardian Open Platform](https://open-platform.theguardian.com/documentation/)

---

## 🎬 Movie API

### `GET /api/movies/:date`
- **Purpose**: Get top movie releases around the date  
- **Params**: `:date` in `YYYY-MM-DD`  
- **Used in**: `TimeResultPage.js → fetchMovieData()`  
- **🛠 Uses External API**: [TMDB](https://www.themoviedb.org/documentation/api)

---

## 💰 Price API

### `GET /api/price/:date`
- **Purpose**: Fetch historical exchange rates and consumer goods prices  
- **Params**: `:date` in `YYYY-MM-DD`  
- **Used in**: `TimeResultPage.js → fetchPriceData()`  
- **🛠 Uses External APIs**: [Frankfurter](https://www.frankfurter.app/), [BLS](https://www.bls.gov/developers/)

---

## 🎵 Music API

### `GET /api/music/:date`
- **Purpose**: Return top music tracks on the given date  
- **Params**: `:date` in `YYYY-MM-DD`  
- **Used in**: `TimeResultPage.js → fetchTopTracks()`  
- **🛠 Uses External API**: [Last.fm](https://www.last.fm/api)

---

## 🎂 Celebrity API

### `GET /api/celeb/:month/:day`
- **Purpose**: Return famous births and deaths on that date  
- **Params**: `:month` (1–12), `:day` (1–31)  
- **Used in**: `TimeResultPage.js → fetchCelebrityData()`  
- **🛠 Uses External API**: [byabbe.se](https://byabbe.se/on-this-day/)

---

## 💾 Time Capsule API

### `POST /api/capsules`
- **Purpose**: Save a time capsule with weather, prices, news, movies, etc.  
- **Used in**: `TimeResultPage.js → saveTimeCapsule()`

### `GET /api/capsules/:userId` *(optional)*
- **Purpose**: Get all capsules saved by a user  
- **Used in**: `MyPage.js` or similar if implemented

---

## 🧭 Summary Table

| Endpoint                        | Purpose                                   | Frontend Usage        |
|--------------------------------|-------------------------------------------|------------------------|
| `GET /api/auth/check-auth`     | Check login status                        | `AuthContext.js`       |
| `POST /api/auth/login`         | Log in user                               | `AuthContext.js`       |
| `POST /api/auth/logout`        | Log out user                              | `AuthContext.js`       |
| `GET /api/time/:date/weather`  | Weather info                              | `TimeResultPage.js`    |
| `GET /api/news/:date`          | News headlines                            | `TimeResultPage.js`    |
| `GET /api/movies/:date`        | Top movies                                | `TimeResultPage.js`    |
| `GET /api/price/:date`         | Exchange rates and consumer prices        | `TimeResultPage.js`    |
| `GET /api/music/:date`         | Top music tracks                          | `TimeResultPage.js`    |
| `GET /api/celeb/:month/:day`   | Celebrity births & deaths                 | `TimeResultPage.js`    |
| `POST /api/capsules`           | Save time capsule                         | `TimeResultPage.js`    |
| `GET /api/capsules/:userId`    | Load user capsules (if implemented)       | `MyPage.js (optional)` |

---

## 📌 Notes

- All endpoints return **JSON**.  
- Frontend uses `credentials: include` for session-based authentication.  
- All dates follow the **ISO YYYY-MM-DD** format.  
- Auth state is managed globally using **React Context** (`AuthContext.js`).

---

✅ Author: **Jaeuk Kwon (2025)**  
✅ Project: **Time Travelers – Final Project for ITM 519**  
✅ Last Updated: **2025-06-18**
