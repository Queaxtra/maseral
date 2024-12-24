## 🎬 Maseral

It is a movie streaming site made with Vidsrc and TMDB. You can watch movies for free without requiring membership or any other situation.

## 🧰 Install

- Download the project.
- Install the modules used in the project. `bun install`
- Run the project. `bun run dev`
*You can also use npm or pnpm.*
## 🛠️ Usage
### TMDB Setup
- Register or login to the TMDB site.
- After logging in or registering, go to settings.
![SS](https://www.upload.ee/image/16616163/Queaxtra_31.png)
- Click on **API** on the left side.
![SS](https://www.upload.ee/image/16616169/Queaxtra_50.png)
- Copy the **API Read Access Token.**
![SS](https://www.upload.ee/image/16616178/Queaxtra_46.png)
- After downloading and installing the project on your computer, open a file named **.env** and type **VITE_APP_APIKEY** into it and paste the token you copied into this value.
![SS](https://www.upload.ee/image/16616187/Queaxtra_35.png)
- The last thing left is to run the project, so open the terminal (open the terminal after defining the project) and type **bun run dev** (type this command after bun install).

### Pocketbase Setup
- Download PocketBase from the [PocketBase](https://pocketbase.io) site.
- Extract and run the PocketBase executable.
- Access PocketBase admin UI at `http://127.0.0.1:8090/_/`.
- Add to your .env file:
```
VITE_APP_PBURL=http://127.0.0.1:8090
VITE_APP_APIKEY=YOUR_TMDB_API_KEY
```

Since I am using **bun** in the project, I am doing it with bun, you can do it with **pnpm, yarn or npm**

## 📁 Core Components

### Database Configuration (db.ts)
- Uses PocketBase as the database solution
- Configured with environment variables for secure connection

### User Management (user.ts)
- Complete user authentication system
- Features: registration, login, logout
- Profile management with update capabilities
- User data retrieval and validation

### Actor Management (actors.ts)
- Fetches popular actors list with pagination
- Retrieves cast information for specific movies
- Integrates with TMDB API for comprehensive actor data

### Movie Management (movies.ts)
- Smart time-based genre recommendations
- Features multiple endpoints:
  - Popular movies listing
  - Top-rated movies
  - Movie search functionality
  - Trailer retrieval
  - Movie details
  - Similar movies recommendations
  - Upcoming movies

### TV Series Management (series.ts)
- Complete TV series handling
- Includes:
  - Series listing
  - Trailer retrieval
  - Search functionality
  - Detailed series information
  - Similar series recommendations

### Favorites System (favorite.ts)
- User-specific movie favoriting system
- Features:
  - Add/remove favorites
  - Check favorite status
  - Retrieve user's favorite list
- Integrated with PocketBase for persistence

### Recommendations Engine (recommendations.ts)
- Keyword-based movie recommendations
- Search functionality for keywords
- Returns curated movie suggestions

## 🔧 Technical Implementation
All components use modern async/await patterns and integrate seamlessly with TMDB's API using environment-based authentication. The system is built with TypeScript for enhanced type safety and better development experience.

## 📝 Note

TMDB and Vidsrc APIs were used in this project. I do not accept any legal obligation.