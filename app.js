const loadAllData = require("./loadModel")
const  processTwitterData  = require("./tweetAnalysis");
const getTweets = require("./getTweets");
const cors = require("cors")
// import fetch from "node-fetch";
const fetch = require("cross-fetch")
const dotenv = require("dotenv")

const express = require("express");

dotenv.config()
const app = express();

app.use(cors())
const port = process.env.PORT || 8080;
app.listen(port , () => {
    console.log(`app listening on port ${port}`);
});

url = `https://api.twitter.com/2/tweets/search/recent?query=Ukraine`


var model, metadata;
// 
async function setup() {
    [model, metadata] = await loadAllData();
}

setup()

app.get('/api/twitter/sentiment_analysis/v1/init', (req, res, next) => {
    console.log("[root]: received GET request at /api/twitter/sentiment_analysis/v1/init");
    var keyword = 'Ukraine';
    async function work() {
        var tweets = await getTweets(keyword);
        var sentimentData = processTwitterData(tweets, model, metadata);
        res.send({
            data: sentimentData
        })
    }
    try {
    work()
    }
    catch(err) {
        console.log(err);
    }
})


app.get('/api/twitter/sentiment_analysis/v2/init/:keyword', (req, res, next) => {
    console.log("[root]: received GET request at /api/twitter/sentiment_analysis/v1/init");
    var keyword = req.params.keyword;
    console.log(keyword)
    async function work() {
        var tweets = await getTweets(keyword);
        var sentimentData = processTwitterData(tweets, model, metadata);
        res.send({
            data: sentimentData
        })
    }
    try {
    work()
    }
    catch(err) {
        console.log(err);
    }
})

