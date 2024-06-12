import { tweetsData as defaultTweetsData} from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData;

if(localStorage.getItem("tweetsData")){
    tweetsData = JSON.parse(localStorage.getItem("tweetsData"))
    console.log("going local")
} else{
    tweetsData = defaultTweetsData
    console.log("from js file")
}

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }

    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }

    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }

    else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
    }

    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }

})

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweetData) {
        return tweetData.uuid === tweetId
    })[0]
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes -= 1
    } else {
        targetTweetObj.likes += 1
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    updateLocalStorage()
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweetData) {
        return tweetData.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    } else {
        targetTweetObj.retweets++
    }

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    updateLocalStorage()
    render()
}


function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
    const replyInput = document.getElementById(`reply-input-${replyId}`)
    const replyBtn = document.getElementById(`reply-btn-${replyId}`)

    replyBtn.addEventListener("click", function () {
        if (replyInput.value) {
            const targetTweetObj = tweetsData.filter(function (tweetData) {
                return tweetData.uuid === replyId
            })[0]

            targetTweetObj.replies.unshift({
                handle: '@pocketmonsters',
                profilePic: `images/pokemon.png`,
                tweetText: replyInput.value
            })
            replyInput.value = ''
            updateLocalStorage()
            render()
        }
    })
}

function handleDeleteClick(deleteId) {
    console.log(deleteId)
    const targetTweetObj = tweetsData.filter(function (tweetData) {
        return tweetData.uuid === deleteId
    })[0]

    const index = tweetsData.indexOf(targetTweetObj);
    tweetsData.splice(index, 1)
    updateLocalStorage()
    render()
}

function handleTweetBtnClick() {

    const tweetInput = document.getElementById("tweet-input")
    if (tweetInput.value) {
        tweetsData.unshift({
            handle: '@pocketmonsters',
            profilePic: './images/pokemon.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        })
        tweetInput.value = ''
        updateLocalStorage()
        render()
    }

}

function updateLocalStorage(){
    localStorage.clear()
    localStorage.setItem("tweetsData",JSON.stringify(tweetsData))
}

function getFeedHtml() {
    let feedHtml = ''
    tweetsData.forEach(function (tweetData) {

        let likedIconClass = ''
        let retweetedIconClass = ''
        let deletIconTag = ''
        if (tweetData.isLiked) {
            likedIconClass = 'liked'
        }

        if (tweetData.isRetweeted) {
            retweetedIconClass = "retweeted"
        }

        if (tweetData.handle === '@pocketmonsters') {
            deletIconTag = `<span class='tweet-detail'><i class="fa-solid fa-trash delete" data-delete = '${tweetData.uuid}'></i></span>`
        }

        let repliesHtml = `
        <textarea class='reply-input' id='reply-input-${tweetData.uuid}' placeholder='Post your reply'></textarea>
        <button class='reply-btn' id='reply-btn-${tweetData.uuid}'>Reply</button>`
        if (tweetData.replies.length) {
            tweetData.replies.forEach(function (reply) {
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

        feedHtml += `
        <div class='tweet' data-tweet-container='${tweetData.uuid}'>
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

                        ${deletIconTag}

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

function render() {
    document.getElementById("feed").innerHTML = getFeedHtml()
}

updateLocalStorage()
render()
