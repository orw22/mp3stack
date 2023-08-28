export interface Track {
  _id: string;
  name: string;
}

export interface Playlist {
  _id: string;
  name: string;
  tracks: Track[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface TrackWithUrl extends Track {
  url: string;
}
