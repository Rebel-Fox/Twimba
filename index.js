import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click',function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }

    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }

    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }

    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweetData){
        return tweetData.uuid === tweetId
    })[0]
    if(targetTweetObj.isLiked){
        targetTweetObj.likes -= 1
    } else{
        targetTweetObj.likes += 1
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweetData){
        return tweetData.uuid === tweetId
    })[0]

    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    } else{
        targetTweetObj.retweets++
    }

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}


function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
}

function handleTweetBtnClick(){

    const tweetInput = document.getElementById("tweet-input")
    if(tweetInput.value){
    tweetsData.unshift({
        handle:'@pocketmonsters',
        profilePic:'./images/pokemon.png',
        likes:0,
        retweets:0,
        tweetText:tweetInput.value,
        replies:[],
        isLiked:false,
        isRetweeted:false,
        uuid:uuidv4(),
    })
    tweetInput.value=''
    render()
   }

}

function getFeedHtml(){
    let feedHtml = ''
    tweetsData.forEach(function(tweetData){

        let likedIconClass = ''
        let retweetedIconClass = ''

        if(tweetData.isLiked){
            likedIconClass = 'liked'
        }

        if(tweetData.isRetweeted){
            retweetedIconClass = "retweeted"
        }

        let repliesHtml = ''
        if(tweetData.replies.length){
            tweetData.replies.forEach(function(reply){
                repliesHtml += `
                <div class='tweet-reply'>
                    <div class='tweet-inner'>
                        <img src=${reply.profilePic} class='profile-pic' alt='profile pic'>
                        <div>
                            <p class='handle'>${reply.handle}</p>
                            <p class='tweet-text'>${reply.tweetText}</p>
                        </div>
                    </div>
                </div>`
            })
        }

        feedHtml +=`
        <div class='tweet'>
            <div class='tweet-inner'>
                <img src='${tweetData.profilePic}' class='profile-pic' alt='profile pic'>
                <div>
                    <p class='handle'>${tweetData.handle}</p>
                    <p class='tweet-text'>${tweetData.tweetText}</p>
                    <div class='tweet-details'>
                        <span class='tweet-detail'>
                        <i class="fa-regular fa-comment-dots" data-reply='${tweetData.uuid}'></i>
                        ${tweetData.replies.length}</span>

                        <span class='tweet-detail'>
                        <i class="fa-solid fa-heart ${likedIconClass}" data-like='${tweetData.uuid}'></i></i>${tweetData.likes}</span>

                        <span class='tweet-detail'><i class="fa-solid fa-retweet ${retweetedIconClass}" data-retweet='${tweetData.uuid}'></i>
                        ${tweetData.retweets}</span>
                    </div>
                </div>
            </div>
            <div class='hidden' id='replies-${tweetData.uuid}'>
                ${repliesHtml}
            </div>
        </div>`
    })
    return feedHtml
}

function render(){
    document.getElementById("feed").innerHTML = getFeedHtml()
}

render()
