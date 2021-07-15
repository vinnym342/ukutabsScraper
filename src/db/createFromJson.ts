import cliProgress from "cli-progress";

import Artist from "./models/artist";
import Song from "./models/song";
import artistsSongsJson from "../artistsSongs.json";

export const convertSongs = async () => {
  const updatedArtists: any[] = [];
  const bar2 = new cliProgress.SingleBar(
    {
      clearOnComplete: true
    },
    cliProgress.Presets.shades_classic
  );

  try {
    bar2.start(artistsSongsJson.length, 0);
    for (let i = 0; i < artistsSongsJson.length; i++) {
      const artistSongs = artistsSongsJson[i];

      const artist = await Artist.create({
        name: artistSongs.artist.name,
        link: artistSongs.artist.link
      });
      const songPromises = artistSongs.songs.map((song) => {
        return new Song({ ...song, artist });
      });
      const songs = await Song.insertMany(songPromises);
      artist.songs = songs;
      const updatedArtist = artist.save();
      updatedArtists.push(updatedArtist);
      bar2.increment(1);
    }
    await Promise.all(updatedArtists);
    bar2.stop();
  } catch (e) {
    console.error(e);
  }
};
