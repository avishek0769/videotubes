import { DOMAIN } from "./constant.js";
import { navigation, getWhenVideoUploaded, getCurrentUser, formatDuration, formatViews, showVideo, hamburgerMenu, searchFunctionality } from "./utils.js";
let pageNo = 1;
fetch(`${DOMAIN}/api/v1/videos?pageNo=${pageNo}&limit=18`).then((res)=> res.json() )
.then(async (data)=>{
    document.getElementById("bufferingDiv1").classList.replace("flex", "hidden")
    let section = document.getElementById("showAllVideo")

    const LS_video = localStorage.getItem("video");
    let promises = data.data.map(async video => {
            let html = `
            <div class="video-card p-2 ${(LS_video != null)? (JSON.parse(LS_video).videoID == video._id)? "hidden" : "" : ""}">
                            <div class="thumbnail-wrap relative mb-3 w-full pt-[56%]">
                                <div class="video absolute inset-0 cursor-pointer" data-videoid=${video._id}><img
                                        src=${video.thumbnail}
                                        alt="${video.title}" class="h-full w-full rounded-xl" />
                                </div>
                                <span class="duration-badge">${formatDuration(video.duration)}</span>
                            </div>
                            <div class="flex gap-x-3 px-1">
                                <div data-channelid=${video.owner._id} class="channels h-9 w-9 shrink-0 cursor-pointer"><img
                                        src=${video.owner.avatar}
                                        alt="${video.owner.fullName}" class="h-full w-full rounded-full ring-2 ring-white/10 transition-all duration-300 hover:ring-[#ae7aff]/50" /></div>
                                <div class="w-full min-w-0">
                                    <h6 class="mb-0.5 font-semibold text-[0.95rem] leading-snug line-clamp-2">${video.title}</h6>
                                    <p class="text-xs text-gray-400 mt-1">${video.owner.fullName}</p>
                                    <p class="text-xs text-gray-500">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                                </div>
                            </div>
                        </div>
            `
            section.insertAdjacentHTML("beforeend", html)
    });
    await Promise.all(promises);
})
.then(showVideo)
.then(()=>{
    document.querySelectorAll(".channels").forEach((channel)=>{
        channel.addEventListener("click", ()=>{
            window.location.href = `/My_Channel_Video?channelID=${channel.dataset.channelid}`
        })
    })
})

document.getElementById("loadMore").addEventListener("click", ()=>{
    document.getElementById("bufferingDiv1").classList.replace("hidden", "flex")
    fetch(`${DOMAIN}/api/v1/videos?pageNo=${++pageNo}&limit=18`).then((res)=>{
        return res.json()
    })
    .then(async (data)=>{
        document.getElementById("bufferingDiv1").classList.replace("flex", "hidden")
        let section = document.getElementById("showAllVideo")
        let promises = data.data.map(async video => {
            let html = `
            <div class="video-card p-2">
                            <div class="thumbnail-wrap relative mb-3 w-full pt-[56%]">
                                <div class="video absolute inset-0 cursor-pointer" data-videoid=${video._id}><img
                                        src=${video.thumbnail}
                                        alt="${video.title}" class="h-full w-full rounded-xl" />
                                </div>
                                <span class="duration-badge">${formatDuration(video.duration)}</span>
                            </div>
                            <div class="flex gap-x-3 px-1">
                                <div data-channelid=${video.owner._id} class="channels h-9 w-9 shrink-0 cursor-pointer"><img
                                        src=${video.owner.avatar}
                                        alt="${video.owner.fullName}" class="h-full w-full rounded-full ring-2 ring-white/10 transition-all duration-300 hover:ring-[#ae7aff]/50" /></div>
                                <div class="w-full min-w-0">
                                    <h6 class="mb-0.5 font-semibold text-[0.95rem] leading-snug line-clamp-2">${video.title}</h6>
                                    <p class="text-xs text-gray-400 mt-1">${video.owner.fullName}</p>
                                    <p class="text-xs text-gray-500">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                                </div>
                            </div>
                        </div>
            `
            section.insertAdjacentHTML("beforeend", html)
        });
        await Promise.all(promises);
        if(data.data.length < 18){
            loadMore.classList.add("hidden")
        }
    })
    .then(showVideo)
    .then(()=>{
        document.querySelectorAll(".channels").forEach((channel)=>{
            channel.addEventListener("click", ()=>{
                window.location.href = `/My_Channel_Video?channelID=${channel.dataset.channelid}`
            })
        })
    })
})
// ************************************************************ SEARCH FUNCTIONALITY ************************************************************
logOut.addEventListener("click", ()=>{
    ConfirmLogOut.classList.replace("hidden", "flex")
})
yesLogOut.addEventListener("click", ()=>{
    ConfirmLogOut.classList.replace("flex", "hidden")
    bufferingDiv.classList.replace("hidden", "flex")
    showMessage.innerHTML = "Logging you out..."
    fetch(`${DOMAIN}/api/v1/users/logout`).then((res)=> res.json())
    .then((data)=> {
        window.location.reload()
    })
})
noLogOut.addEventListener("click", ()=>{
    ConfirmLogOut.classList.replace("flex", "hidden")
})

// ************************************************************ SEARCH FUNCTIONALITY ************************************************************
searchFunctionality()

//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()

// ************************************************************ NAVIGATE TO OTHER PAGES ************************************************************
getCurrentUser().then((user)=>{
    if(user){
        logOut.classList.remove("hidden")
        logIn.classList.add("hidden")
    }
    else{
        logOut.classList.add("hidden")
        logIn.classList.remove("hidden")
    }
    navigation(user)
})
