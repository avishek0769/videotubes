import { DOMAIN } from "./constant.js";
import { navigation, getWhenVideoUploaded, getCurrentUser, formatDuration, formatViews, handleError, showVideo, toggleSubscribe, searchFunctionality, hamburgerMenu } from "./utils.js";

let urlParams = new URLSearchParams(window.location.search);
let channelID = urlParams.get("channelID")

//************************************************************ CHANNEL DETAILS *******************************************************  
fetch(`${DOMAIN}/api/v1/users/${channelID}`).then((response)=>{
    return response.json();
})
.then((data)=>{
    const owner = data.data;
    noOfSubs.innerHTML = `${owner.subscriberCount} Subscribers  ·  ${owner.channelSubscribedToCount} Channels Subscribed`;
    username.innerHTML = "@" + owner.username;
    channelName.innerHTML = owner.fullName;
    coverImage.src = owner.coverImage;
    avatar.src = owner.avatar;

    if(owner.isSubscribed){
        subscribeBtn.dataset.subscribed = "true"
        subscribeBtn.innerText = "Subscribed"
    }
})
.then(()=>{
    // ************************************************************ FETCHING CHANNEL VIDEOS ************************************************************
    fetch(`${DOMAIN}/api/v1/videos/c/${channelID}`).then((response)=>{
        return response.json();
    })
    .then(async (videos)=>{
        let promises = videos.data.map(async video => {
            let html = `
            <div class="w-full">
                                <div class="relative mb-2 w-full pt-[56%]">
                                    <div data-videoid=${video._id} class="video absolute inset-0"><img
                                            src=${video.thumbnail}
                                            alt="Advanced React Patterns" class="h-full w-full" /></div><span
                                        class="absolute bottom-1 right-1 inline-block rounded object-cover object-center bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                                </div>
                                <h6 class="mb-1 font-semibold">${video.title}</h6>
                                <p class="flex text-sm text-gray-200">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
            </div>
            `
            videoSection.insertAdjacentHTML("beforeend", html);
        });
        await Promise.all(promises);
    })
    .then(showVideo)
})

//************************************************************ TOGGLE SUBSCRIBE *******************************************************  
let subsBtn = document.getElementById("subscribeBtn")
toggleSubscribe(channelID, subsBtn)

// ************************************************************ SEARCH FUNCTIONALITY ************************************************************
searchFunctionality()

//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()

// ************************************************************ NAVIGATE TO OTHER PAGES ************************************************************
getCurrentUser().then((user)=>{
    navigation(user)
})