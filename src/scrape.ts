import axios, { AxiosResponse } from "axios";
import fs from "fs";
import { load } from "cheerio";
const cliProgress = require("cli-progress");

import { ukuUrl, alphabet } from "./constants";
import { getAllPassingPromises, getIncreamentingAxiosPages } from "./helpers";
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

export const scrapeUku = async () => {
  const artists: Artist[] = await getArtists();
  // const artists = await getOneArtist();
  const start = Date.now();
  // fs.writeFile(
  //   "artists.json",
  //   JSON.stringify(artists, null, 2),
  //   function (err: any) {
  //     if (err) {
  //       console.log(err);
  //     }
  //   }
  // );
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
  bar1.stop();
  return artistsData;
};
