# mp3stack

Responsive web-based MP3 player with ability to play and queue tracks, create and edit playlists, and view and follow other users' playlists. Svelte is used for the UI due to its speed, reactivity, and easily configurable stores, with Express.js utilised on the backend. MongoDB GridFS is integrated for storing and streaming MPEG audio files effectively. Tracks are cached both on the server (with Memurai) and in memory on the client in each user session, resulting in fast performance throughout the stack.

![Screenshot](images/screenshot.png)
