#!/usr/bin/env node
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
const commander_1 = require("commander");
const createFromJson_1 = require("./db/createFromJson");
const song_1 = __importDefault(require("./db/models/song"));
const init_1 = require("./db/init");
const scrape_1 = require("./scrape");
const program = new commander_1.Command();
program
    .command("initDB")
    .alias("idb")
    .description("Start mongodb")
    .action(() => {
    init_1.startMongo();
});
program
    .command("closeDB")
    .alias("cdb")
    .description("Close mongo connection")
    .action(() => {
    init_1.closeMongo();
});
program
    .command("getArtists")
    .alias("ga")
    .description("Get all artists and save in artists.json locally")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Generating artists.pdf");
    yield scrape_1.generateArtistsAndSongs();
    console.log("Generated!");
}));
program
    .command("artist-to-song")
    .alias("ats")
    .description("insert artist song data from json, into mongodb record")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    yield init_1.runInMongo(createFromJson_1.convertSongs);
}));
program
    .command("test")
    .alias("t")
    .description("test one")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sjgn");
    yield song_1.default.create({
        link: "asdf.com",
        name: "test"
    });
    console.log("waf");
}));
program.parse(process.argv);
//# sourceMappingURL=index.js.map