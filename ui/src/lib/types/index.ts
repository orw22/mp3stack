/**
 * @interface
 */
export interface Track {
  _id: string;
  name: string;
}

/**
 * @interface
 */
export interface Playlist {
  _id: string;
  name: string;
  tracks: Track[];
}

/**
 * @interface
 */
export interface User {
  _id: string;
  name: string;
  email: string;
}

/**
 * Represents a track with a local blob URL.
 * @interface
 * @extends {Track}
 */
export interface TrackWithUrl extends Track {
  url: string;
}
