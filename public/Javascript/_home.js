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
            <div class="w-full ${(LS_video != null)? (JSON.parse(LS_video).videoID == video._id)? "hidden" : "" : ""} ">
                            <div class=" relative mb-2 w-full pt-[56%]">
                                <div class="video absolute inset-0" data-videoid=${video._id}><img
                                        src=${video.thumbnail}
                                        alt="JavaScript Fundamentals: Variables and Data Types" class="h-full w-full object-cover object-center" />
                                </div>
                                <span
                                    class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                            </div>
                            <div class="flex gap-x-2">
                                <div data-channelid=${video.owner._id} class="channels h-10 w-10 shrink-0"><img
                                        src=${video.owner.avatar}
                                        alt="codemaster" class="h-full w-full rounded-full object-cover object-center" /></div>
                                <div class="w-full">
                                    <h6 class="mb-1 font-semibold">${video.title}</h6>
                                    <p class="flex text-sm text-gray-200">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                                    <p class="text-sm text-gray-200">${video.owner.fullName}</p>
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
            <div class="w-full">
                            <div class=" relative mb-2 w-full pt-[56%]">
                                <div class="video absolute inset-0" data-videoid=${video._id}><img
                                        src=${video.thumbnail}
                                        alt="JavaScript Fundamentals: Variables and Data Types" class="h-full w-full object-cover object-center" />
                                </div>
                                <span
                                    class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                            </div>
                            <div class="flex gap-x-2">
                                <div data-channelid=${video.owner._id} class="channels h-10 w-10 shrink-0"><img
                                        src=${video.owner.avatar}
                                        alt="codemaster" class="object-cover object-center h-full w-full rounded-full" /></div>
                                <div class="w-full">
                                    <h6 class="mb-1 font-semibold">${video.title}</h6>
                                    <p class="flex text-sm text-gray-200">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                                    <p class="text-sm text-gray-200">${video.owner.fullName}</p>
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
