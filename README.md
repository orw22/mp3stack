# mp3stack

Web-based MP3 player with ability to play and queue tracks, create and edit playlists, and view and follow other users' playlists. Svelte was chosen for building the web UI thanks to its high performance, reactivity, and built-in writable stores. The backend was devised with ExpressJS, with multer and mongoose being used for audio file upload handling and database interaction, respectively. MongoDB's GridFS was used for MP3 file storage and auto-caching.
