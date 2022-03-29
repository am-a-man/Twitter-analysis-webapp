const fetch = require('cross-fetch')
async function getTweets(keyword) {
    var url = `https://api.twitter.com/2/tweets/search/recent?query=${keyword}`;
    return await fetch(url ,{
        method: 'get',
        headers: {
            "Authorization": `Bearer ${process.env.BEARER_TOKEN}`,
        }
    })
    .then(res => res.json())
    .then(data => {
        return data
    })


    
}


module.exports = getTweets;
