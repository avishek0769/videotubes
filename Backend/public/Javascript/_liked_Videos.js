import { DOMAIN } from "./constant.js";
import { formatDuration, formatViews, getCurrentUser, getWhenVideoUploaded, hamburgerMenu, navigation, showVideo, waveEffect } from "./utils.js"

//************************************************************ FETCH LIKED VIDEOS *******************************************************  
let URLparams = new URLSearchParams(window.location.search)
let liked = URLparams.get("liked")
console.log(liked);
if (liked == "true") {
    fetch(`${DOMAIN}/api/v1/likes/get-liked-videos`).then((response) => response.json())
        .then(async (data) => {
            what.innerHTML = `Liked Videos :&nbsp;&nbsp;`
            noOfVideos.innerHTML = data.data.length;
            let promises = data.data.map(async (Video) => {
                let html = `
                <div class="w-full max-w-3xl gap-x-4 md:flex">
                            <div class="relative mb-2 w-full md:mb-0 md:w-5/12">
                                <div data-videoid=${Video.video._id} class="video w-full pt-[56%]">
                                    <div class="absolute inset-0">
                                        <img src=${Video.video.thumbnail}
                                            alt="Advanced React Patterns" class="h-full w-full" /></div><span
                                        class="object-cover object-center absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(Video.video.duration)}</span>
                                </div>
                            </div>
                            <div class="flex gap-x-2 md:w-7/12">
                                <div data-userid=${Video.video.owner._id} class="owner h-10 w-10 shrink-0 md:hidden"><img
                                        src=${Video.video.owner.avatar}
                                        alt="reactpatterns" class="h-full w-full rounded-full object-cover object-center" /></div>
                                <div class="w-full">
                                    <h6 class="mb-1 font-semibold md:max-w-[75%]">${Video.video.title}</h6>
                                    <p class="flex text-sm text-gray-200 sm:mt-3">${await formatViews(Video.video._id)} Views · ${getWhenVideoUploaded(Video.video.createdAt)}</p>
                                    <div class="flex items-center gap-x-4">
                                        <div data-userid=${Video.video.owner._id} class="owner mt-2 hidden h-10 w-10 shrink-0 md:block"><img
                                                src=${Video.video.owner.avatar}
                                                alt="reactpatterns" class="h-full w-full rounded-full" /></div>
                                        <p class="text-sm text-gray-200">${Video.video.owner.fullName} </p>
                                    </div>
                                    <p class="mt-2 hidden text-sm md:block">${Video.video.description} </p>
                                </div>
                            </div>
                        </div>
            `
                likedVideosSection.insertAdjacentHTML("beforeend", html)
            })
            await Promise.all(promises)
                .then(() => {
                    showVideo()
                    document.querySelectorAll(".owner").forEach((elem) => {
                        elem.addEventListener("click", () => {
                            window.location.href = `/My_Channel_Video?channelID=${elem.dataset.userid}`
                        })
                    })
                })
        })
}
else {
    fetch(`${DOMAIN}/api/v1/users/v/get-watch-history`).then((response) => response.json())
    .then(async (data) => {
        console.log(data);
        what.innerHTML = `Videos watched :&nbsp;&nbsp;`
        noOfVideos.innerHTML = data.data.length;
        let promises = data.data.map(async (video) => {
            let html = `
                <div class="main relative w-full max-w-3xl gap-x-4 md:flex">
                        <div class="relative mb-2 w-full md:mb-0 md:w-5/12">
                            <div data-videoid=${video._id} class="video w-full pt-[56%]">
                                <div class="absolute inset-0">
                                    <img src=${video.thumbnail}
                                        alt="Advanced React Patterns" class="h-full w-full" /></div><span
                                    class="absolute bottom-1 right-1 object-cover object-center inline-block rounded bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                            </div>
                        </div>
                        <div class="flex relative gap-x-2 md:w-7/12">
                            <div data-userid=${video.owner._id} class="owner h-10 w-10 shrink-0 md:hidden"><img
                                    src=${video.owner.avatar}
                                    alt="reactpatterns" class="object-cover object-center h-full w-full rounded-full" /></div>
                            <div class="w-full pr-5">
                                <h6 class="mb-1 font-semibold md:max-w-[75%]">${video.title}</h6>
                                <p class="flex text-sm text-gray-200 sm:mt-3">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                                <div class="flex items-center gap-x-4">
                                    <div data-userid=${video.owner._id} class="owner mt-2 hidden h-10 w-10 shrink-0 md:block"><img
                                            src=${video.owner.avatar}
                                            alt="reactpatterns" class="h-full w-full rounded-full object-cover object-center" /></div>
                                    <p class="text-sm text-gray-200">${video.owner.fullName} </p>
                                </div>
                            </div>
                            <div class="absolute right-1 bottom-5 sm:top-3">
                                <span class="threeDotsHistory w-5 sm:w-auto transition-transform transform duration-150 material-symbols-outlined cursor-pointer ">more_vert</span>
                            </div>
                        </div>
                        <div class="dotDivHistory hidden bg-black z-50 border border-[#ae7aff] absolute right-8 bottom-3 sm:bottom-24 rounded-md ">
                            <div class=" flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Report</div>
                            <div data-videoid=${video._id} class="removeVideo flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Remove</div>
                        </div>
                    </div>
                `
            likedVideosSection.insertAdjacentHTML("beforeend", html)
        })
        await Promise.all(promises)
        .then(() => {
            showVideo()
            document.querySelectorAll(".owner").forEach((elem) => {
                elem.addEventListener("click", () => {
                    window.location.href = `/My_Channel_Video?channelID=${elem.dataset.userid}`
                })
            })
            // WAVE EFFECT AND CLICK EVENTS
            document.addEventListener("click", (event) => {
                document.querySelectorAll(".dotDivHistory").forEach((dotDiv) => {
                    if (!dotDiv.classList.contains("hidden")) {
                        dotDiv.classList.add("hidden");
                    }
                });
            });
            document.querySelectorAll(".threeDotsHistory").forEach((dot) => {
                waveEffect(dot)
                dot.addEventListener("click", (e) => {
                    e.stopPropagation();
                    document.querySelectorAll(".dotDivHistory").forEach((dotDiv) => {
                        if (!dotDiv.classList.contains("hidden")) {
                            dotDiv.classList.add("hidden");
                        }
                    })
                    dot.closest(".main").querySelector(".dotDivHistory").classList.toggle("hidden")
                })
            })
        })
        .then(()=>{
            document.querySelectorAll(".removeVideo").forEach((elem)=>{
                elem.addEventListener("click", ()=>{
                    let div = elem.parentElement.parentElement;
                    elem.parentElement.parentElement.innerHTML = `
                    <div id="bufferingDiv1" class="flex w-full gap-3 items-center py-6 mb-3 justify-center ">
                        <dotlottie-player class="" src="https://lottie.host/27feff6c-53ae-48c7-9539-9a37724286be/8okSjWIQl7.json" background="transparent" speed="1" style="width: 50px; height: 50px;" loop autoplay></dotlottie-player>
                    </div>
                    `
                    fetch(`${DOMAIN}/api/v1/users/watch-history/remove/${elem.dataset.videoid}`).then((response)=> response.json())
                    .then((data)=>{
                        console.log(data);
                        div.remove()
                    })
                })
            })
        })
    })
}


//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()

// ************************************************************ NAVIGATE TO OTHER PAGES ************************************************************
getCurrentUser().then((user) => {
    navigation(user)
})