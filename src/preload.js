const { contextBridge } = require("electron");
const clashApi = require("clash-of-clans-api");
const env = require("./env");

const apiKey = env.COC_API_TOKEN;

console.log("Preload done");

let client = clashApi({
  token: apiKey,
});

contextBridge.exposeInMainWorld("api", {
  fetchClanData: (clanTag) => {
    return new Promise((resolve, reject) => {
      client
        .clanByTag(clanTag)
        .then((response) => resolve(response))
        .catch(() => reject("Error: Clan not found!"));
    });
  },
  fetchMemberData: (memberTag) => {
    return new Promise((resolve, reject) => {
      client
        .playerByTag(memberTag)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
});
