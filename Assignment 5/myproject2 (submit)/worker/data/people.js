const redisConnection = require("../../redis-connection");
const axios = require("axios");

const gistUrl = "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";
const getGithubData = axios.get(gistUrl).then(x => x.data);

let exportedMethods = {
    getAllPeople: () => { return Promise.resolve(getGithubData); },
   
    getById: async (id) => {
        if (id === undefined) return Promise.reject("No id provided");

        let userdata = await getGithubData;

        let person = userdata.filter(x => x.id == id).shift();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!person) {
                    reject("No people found")
                } else {
                    resolve(person)
                }
            },5000)
        });
    }
}

module.exports = exportedMethods;