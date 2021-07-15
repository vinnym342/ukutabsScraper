#!/usr/bin/env node
import { Command } from "commander";
import { convertSongs } from "./db/createFromJson";
import { startMongo, closeMongo, runInMongo } from "./db/init";
import { generateArtistsAndSongs } from "./scrape";

const program = new Command();

program
  .command("initDB")
  .alias("idb")
  .description("Start mongodb")
  .action(() => {
    startMongo();
  });

program
  .command("closeDB")
  .alias("cdb")
  .description("Close mongo connection")
  .action(() => {
    closeMongo();
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

program.parse(process.argv);
