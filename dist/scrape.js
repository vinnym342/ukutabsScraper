"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeUku = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const cheerio_1 = require("cheerio");
const cliProgress = require("cli-progress");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const scrapeUku = () => __awaiter(void 0, void 0, void 0, function* () {
    const artists = yield getArtists();
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
    const artistData = yield getSongs(artists);
    fs_1.default.writeFile("output/artistsSongs.json", JSON.stringify(artistData, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
    const end = Date.now();
    console.log(`it took |${(end - start) / 1000} seconds|`);
});
exports.scrapeUku = scrapeUku;
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
const getArtists = () => __awaiter(void 0, void 0, void 0, function* () {
    const artists = [];
    const artistsPagesPromises = constants_1.alphabet
        .split("")
        .map((letter) => axios_1.default.get(constants_1.ukuUrl + `/${letter}/`));
    const artistPages = yield helpers_1.getAllPassingPromises(artistsPagesPromises);
    artistPages.forEach((artistPage) => {
        const $ = cheerio_1.load(artistPage.data);
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
});
const getSongs = (artists) => __awaiter(void 0, void 0, void 0, function* () {
    const artistsData = [];
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(artists.length, 0);
    for (let i = 0; i < artists.length; i++) {
        bar1.update(i + 1);
        const artist = artists[i];
        const artistPages = yield helpers_1.getIncreamentingAxiosPages(artist.link);
        const artistSongLinks = [];
        artistPages.forEach((page) => {
            const $ = cheerio_1.load(page.data);
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
});
//# sourceMappingURL=scrape.js.map