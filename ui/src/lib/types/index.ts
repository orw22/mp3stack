/**
 * Represents a track
 * @interface
 */
export interface Track {
  _id: string;
  name: string;
  duration: number;
}

/**
 * Represents a playlist
 * @interface
 */
export interface Playlist {
  _id: string;
  name: string;
  private: boolean;
  tracks: Track[];
  followers: string[];
  following?: boolean;
}

/**
 * Represents a user
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
