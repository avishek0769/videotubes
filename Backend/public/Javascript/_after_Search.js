import { DOMAIN } from "./constant.js";
import { navigation, getWhenVideoUploaded, formatViews, formatDuration, getCurrentUser, showVideo, searchFunctionality, hamburgerMenu } from "./utils.js";


let urlParams = new URLSearchParams(window.location.search)
let searchInput = urlParams.get("search")

// ************************************************************ POPULATING SEARCHED VIDEOS ************************************************************
fetch(`${DOMAIN}/api/v1/videos/search`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({searchInput})
})
.then((response)=>{
    return response.json()
})
.then(async (data)=>{
    if(data.data.length == 0){
        let html = `
        <div class="flex h-full items-center justify-center">
                    <div class="w-full max-w-sm text-center">
                        <p class="mb-3 w-full"><span
                                class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]"><svg
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z">
                                    </path>
                                </svg></span></p>
                        <h5 class="mb-2 font-semibold">No videos available</h5>
                        <p>There are no videos here available. Please try to search some thing else.</p>
                    </div>
                </div>
        `
        searchResult.insertAdjacentHTML("beforeend", html)
        return undefined;
    }
    let promises = data.data.map(async video => {
        let html = `
    <div class="w-full max-w-3xl gap-x-4 md:flex">
                            <div class="relative mb-2 w-full md:mb-0 md:w-5/12">
                                <div class="w-full pt-[56%]">
                                    <div data-videoid=${video._id} class="video absolute inset-0"><img
                                            src=${video.thumbnail}
                                            class="h-full w-full object-cover object-center" />
                                    </div><span
                                        class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                                </div>
                            </div>
                            <div class="flex gap-x-2 md:w-7/12">
                                <div class="h-10 w-10 shrink-0 md:hidden"><img
                                        src=${video.owner.avatar}
                                        alt="codemaster" class="h-full w-full rounded-full object-cover object-center" /></div>
                                <div class="w-full">
                                    <h6 class="mb-1 font-semibold md:max-w-[75%]">${video.title}</h6>
                                    <p class="flex text-sm text-gray-200 sm:mt-3">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                                    <div class="flex items-center gap-x-4">
                                        <div class="mt-2 hidden h-10 w-10 shrink-0 md:block"><img
                                                src=${video.owner.avatar}
                                                alt="codemaster" class="h-full w-full rounded-full object-cover object-center" /></div>
                                        <p class="text-sm text-gray-200">${video.owner.fullName}</p>
                                    </div>
                                    <p class="mt-2 hidden text-sm md:block">${video.description}</p>
                                </div>
                            </div>
                        </div>
    `
    searchResult.insertAdjacentHTML("beforeend", html)
    });
    await Promise.all(promises)
})
.then(showVideo)

// ************************************************************ SEARCH FUNCTIONALITY ************************************************************
searchFunctionality()

//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()


//************************************************************ NAVIGATION TO PAGES *******************************************************  
getCurrentUser().then((user)=>{
    navigation(user)
})