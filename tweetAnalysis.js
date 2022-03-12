const tf = require('@tensorflow/tfjs-node')

const SentimentThreshold = {
    Positive: 0.66,
    Neutral: 0.33,
    Negative: 0
}

function processTwitterData(tweets, model, metadata){
    tweets = tweets.data;
    let data = work();
    function work()  {
            const twitterData = [];
            tweets.map( ( tweet ) => {
                const tweet_text = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
                const sentiment_score = getSentimentScore(tweet_text, model, metadata);
                let tweet_sentiment = '';
                if(sentiment_score > SentimentThreshold.Positive){
                    tweet_sentiment = 'positive'
                }else if(sentiment_score > SentimentThreshold.Neutral){
                    tweet_sentiment = 'neutral'
                }else if(sentiment_score >= SentimentThreshold.Negative){
                    tweet_sentiment = 'negative'
                }
                twitterData.push({
                    sentiment: tweet_sentiment,
                    score: sentiment_score.toFixed(4),
                    tweet: tweet_text
                });
            });
            
            return twitterData
        };
    return data;  
}
 
function getSentimentScore(text, model, metadata) {
    const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
    const OOV_INDEX = 2;
    // Convert the words to a sequence of word indices.
    
    const sequence = inputText.map(word => {
    
        let wordIndex = metadata.word_index[word] + metadata.index_from;
        
        if (metadata.word_index[word] === undefined || wordIndex > metadata.vocabulary_size){
            wordIndex = OOV_INDEX
        }
        return wordIndex;
    });

    // Perform truncation and padding.
    const PAD_INDEX = 0;
    const padSequences = (sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) => {
    return sequences.map(seq => {
    if (seq.length > maxLen) {
    if (truncating === 'pre') {
    seq.splice(0, seq.length - maxLen);
    } else {
    seq.splice(maxLen, seq.length - maxLen);
    }
    }
    if (seq.length < maxLen) {
    const pad = [];
    for (let i = 0; i < maxLen - seq.length; ++i) {
    pad.push(value);
    }
    if (padding === 'pre') {
    seq = pad.concat(seq);
    } else {
    seq = seq.concat(pad);
    }
    }
    return seq;});
    }
    const paddedSequence = padSequences([sequence], metadata.max_len);

    const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    // const score =0;
    return score;
}

module.exports = processTwitterData;
