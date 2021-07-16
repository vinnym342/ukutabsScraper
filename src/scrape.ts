import axios, { AxiosResponse } from "axios";
import fs from "fs";
import { load } from "cheerio";
import cliProgress from "cli-progress";
import { FilterQuery, Document } from "mongoose";

import { ukuUrl, alphabet } from "./constants";
import { getAllPassingPromises, getIncreamentingAxiosPages } from "./helpers";
import Song, { SongI } from "./db/models/song";
import Chord, { ChordI } from "./db/models/chords";
interface Artist {
  name: string;
  link: string;
}

interface SongLinks {
  name: string;
  link: string;
}

interface ArtistData {
  artist: Artist;
  songLinks: SongLinks[];
}

export const generateArtistsAndSongs = async () => {
  // const artists: Artist[] = await getArtists();
  const artists = await getOneArtist();
  const start = Date.now();
  const artistData = await getSongs(artists);
  fs.writeFile(
    "output/artistsSongs.json",
    JSON.stringify(artistData, null, 2),
    function (err: any) {
      if (err) {
        console.log(err);
      }
    }
  );
  const end = Date.now();
  console.log(`it took |${(end - start) / 1000} seconds|`);
};

// For testing
// @todo remove
const getOneArtist = () => {
  return [
    {
      link: "https://ukutabs.com/t/the-beatles/",
      name: "The Beatles"
    }
  ];
};

const getArtists: () => Promise<Artist[]> = async () => {
  const artists: Artist[] = [];

  const artistsPagesPromises = alphabet
    .split("")
    .map((letter) => axios.get(ukuUrl + `/${letter}/`));
  const artistPages: AxiosResponse<any>[] = await getAllPassingPromises(
    artistsPagesPromises
  );

  artistPages.forEach((artistPage) => {
    const $ = load(artistPage.data);
    $(".cat-item").each((i, e) => {
      const linkElem = $(e).find("a");
      const name = linkElem.text();
      const link = linkElem.attr().href;

      artists.push({
        link,
        name
      });
    });
  });

  return artists;
};

const getSongs = async (artists: Artist[]) => {
  const artistsData: ArtistData[] = [];
  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  bar1.start(artists.length, 0);
  for (let i = 0; i < artists.length; i++) {
    bar1.update(i + 1);
    const artist = artists[i];
    const artistPages: AxiosResponse<any>[] = await getIncreamentingAxiosPages(
      artist.link
    );
    const artistSongLinks: SongLinks[] = [];
    artistPages.forEach((page) => {
      const $ = load(page.data);
      $(".archivelist li").each((i, e) => {
        const linkElem = $(e).find("a");
        const link = linkElem.attr().href;
        const name = linkElem.attr().title;
        artistSongLinks.push({ name, link });
      });
    });
    artistsData.push({ artist, songLinks: artistSongLinks });
  }
  console.log("Artist finished!");
  bar1.stop();
  return artistsData;
};

const getChordDocuments = async (chordNames: string[]) => {
  const chords: ChordI[] = [];
  chordNames = [...new Set(chordNames)];
  for (let i = 0; i < chordNames.length; i++) {
    const chordName = chordNames[i];
    const foundChord = await Chord.findOne({
      name: chordName
    } as FilterQuery<ChordI>);
    if (foundChord) {
      chords.push(foundChord);
    } else {
      const newChord = await Chord.create({
        name: chordName
      });
      chords.push(newChord);
    }
  }
  return chords;
};

const populateSong = async (song: SongI & Document<any, any, SongI>) => {
  let page;
  try {
    page = await axios.get(song.link);
  } catch {
    console.log("Couldn't get");
    throw Error();
  }
  const $ = load(page.data);
  const pre = $("pre");
  const aTags = pre.find("a");
  aTags.removeAttr("target");
  aTags.removeAttr("class");
  aTags.removeAttr("href");
  const foundChords: string[] = [];
  aTags.each(async (i, aTag) => {
    const chordName = $(aTag).text();
    foundChords.push(chordName);
  });
  const chordDocuments = await getChordDocuments(foundChords);
  song.chords = chordDocuments;
  song.tabs = pre.html();
  await song.save();
};

export const populateSongsWithTab = async () => {
  const songs = await Song.find({});
  const populateSongPromises: any = [];
  const bar3 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  bar3.start(songs.length, 0);
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    await populateSong(song);
    bar3.increment(1);
  }
  console.log("DONE!");
  bar3.stop();
};
