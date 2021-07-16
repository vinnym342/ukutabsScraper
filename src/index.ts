#!/usr/bin/env node
import { Command } from "commander";
import { convertSongs } from "./db/createFromJson";
import { startMongo, runInMongo } from "./db/init";
import { generateArtistsAndSongs, populateSongsWithTab } from "./scrape";

const program = new Command();

program
  .command("initDB")
  .alias("idb")
  .description("Start mongodb")
  .action(() => {
    startMongo();
  });

program
  .command("getArtists")
  .alias("ga")
  .description("Get all artists and save in artists.json locally")
  .action(async () => {
    console.log("Generating artists.pdf");
    await generateArtistsAndSongs();
    console.log("Generated!");
  });

program
  .command("artist-to-song")
  .alias("ats")
  .description("insert artist song data from json, into mongodb record")
  .action(async () => {
    await runInMongo(convertSongs);
  });

program
  .command("populate-songs")
  .alias("ps")
  .description("Get all songs in record and populate with pre")
  .action(async () => {
    await runInMongo(populateSongsWithTab);
  });

program.parse(process.argv);
