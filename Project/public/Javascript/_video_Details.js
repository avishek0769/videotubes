import { DOMAIN } from "./constant.js";
import { navigation, getWhenVideoUploaded, formatViews, formatDuration, getCurrentUser, handleError, showVideo, searchFunctionality, toggleSubscribe, hamburgerMenu, toogleVideoInPlaylist, toggleLike, likedOrNot, addComments, waveEffect, deleteComment } from "./utils.js";

//****************************************************** POPULATING VIDEOS AND VIDEO's INFROMATION *********************************************************  
let videoFile, a;
const gearBtn = document.getElementById("gearBtn");
const video_showCase = document.getElementById('video_showCase');
const commentSection = document.getElementById('commentSection');
const descriptionSection = document.getElementById('descriptionSection');
const noOfComments = document.getElementById('noOfComments');
const channelName = document.getElementById('channelName');
const noOfSubs = document.getElementById('noOfSubs');
const channelAvatar = document.getElementById('channelAvatar');
const title = document.getElementById('title');
const tagsSection = document.getElementById('tagsSection');
const views_date = document.getElementById('views-date');
const datasetDiv = document.getElementById('datasetDiv');
const channelDiv = document.getElementById('channelDiv');
const sendBtn = document.getElementById('sendButton')
let commenterFullname;
let commenterUsername;
let commenterAvatar;
let commenterID;
let pageNo = 1
let player;
// "plugins": {"videoJsResolutionSwitcher": {"default": "low", "dynamicLabel": true}}
const addCommentsInClient = (e) => {
    addComments(datasetDiv.dataset.videoid, "video", commentInput.value).then((data) => {
        if (data) {
            let html = `
                <div  class="flex gap-x-4 border-b pb-2 pt-1 relative">
                                        <div data-userid=${data.data.commenter} class="mt-2 h-11 w-11 shrink-0"><img
                                                src=${commenterAvatar}
                                                alt="sarahjv" class="h-full w-full rounded-full object-cover object-center" /></div>
                                        <div class="block w-full">
                                            <p class="flex items-center text-gray-200" style="color: #e5e7eb;">${commenterFullname} · <span
                                                    class="text-sm">${getWhenVideoUploaded(data.data.createdAt)}</span></p>
                                            <p class="text-sm text-gray-500">@${commenterUsername}</p>

                                            <div class=" flex justify-between mt-2 p-2 pl-0 rounded-md text-sm">
                                                <p contenteditable="false" class="content outline-none">${data.data.content}</p>
                                                <span class="hidden editCommBtn cursor-pointer mr-2 h-5 material-symbols-outlined transition-transform transform duration-150">send</span>
                                            </div>

                                        </div>
                                        <div class="absolute right-0"><span class="threeDots material-symbols-outlined mt-4 cursor-pointer transition-transform transform duration-150">more_vert</span></div>

                                        <div data-commentid=${data.data._id} class="dotDiv bg-[#000000] hidden border border-[#ae7aff] absolute right-6 bottom-1 rounded-md ">
                                            <div class="flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">report</span>Report</div>
                                            <div class="editBtn flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Edit</div>
                                            <div class="flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">keep</span>Pin</div>
                                            <div class="deleteComm ${commenterID == data.data.commenter? "" : "hidden"} flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Delete</div>
                                        </div>
                                    </div>
            `
            if(commentSection.innerHTML.startsWith("<p")){
                commentSection.innerHTML = html
            }
            else{
                commentSection.insertAdjacentHTML("afterbegin", html)
            }
            noOfComments.innerHTML = Number(noOfComments.innerHTML.split(" ")[0]) + 1 + "  Comments";
            noOfCommentsMob.innerHTML = Number(noOfComments.innerHTML.split(" ")[0]) + 1 + "  Comments";
        }
    })
    .then(threeDotsFunc)
    .then(editComment)
    .then(()=>{
        // DELETE COMMENT 
        document.querySelectorAll(".deleteComm").forEach((btn)=>{
            btn.addEventListener("click", (e)=>{
                deleteCommentDiv.classList.replace("hidden", "flex")
                deleteComment(e.currentTarget.parentElement)
            })
        })
    })
    .catch((err) => {
        console.log(err.message);
    })
    .finally(() => commentInput.value = "")
}

const threeDotsFunc = ()=>{
    document.addEventListener("click", (event) => {
        document.querySelectorAll(".dotDiv").forEach((dotDiv) => {
            if (!dotDiv.classList.contains("hidden")) {
                dotDiv.classList.add("hidden");
            }
        });
    });
    document.querySelectorAll(".threeDots").forEach((dot) => {
        waveEffect(dot)
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".dotDiv").forEach((dotDiv) => {
                if (!dotDiv.classList.contains("hidden")) {
                    dotDiv.classList.add("hidden");
                }
            })
            dot.closest(".flex").querySelector(".dotDiv").classList.toggle("hidden")
        })
    })
    document.querySelectorAll(".editCommBtn").forEach((elem)=>{
        elem.addEventListener("click", ()=> waveEffect(elem))
    })
}

const editComment = ()=>{
    document.querySelectorAll(".editBtn").forEach((elem) => {
        elem.addEventListener("click", () => {
            const content_P = elem.parentElement.parentElement.querySelector(".content");
            const oldComment = content_P.innerText;
            content_P.contentEditable = true;
            content_P.focus();
            content_P.parentElement.classList.add("border", "border-[#ae7aff]");
            const editCommBtn = content_P.parentElement.querySelector(".editCommBtn");
            editCommBtn.classList.remove("hidden");
    
            // Remove existing event listener to avoid duplication
            editCommBtn.removeEventListener("click", handleEditClick);
            editCommBtn.addEventListener("click", handleEditClick);
    
            function handleEditClick(e) {
                e.stopPropagation();
                if (content_P.innerText !== oldComment) {
                    content_P.contentEditable = false;
                    content_P.parentElement.classList.remove("border", "border-[#ae7aff]");
                    editCommBtn.classList.add("hidden");
    
                    fetch(`${DOMAIN}/api/v1/comments/update-delete/${elem.parentElement.parentElement.dataset.commentid}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ content: content_P.innerText })
                    })
                    .then((response) => response.json())
                }
            }
    
            // Click outside to cancel editing
            function handleOutsideClick(e) {
                if (!content_P.parentElement.contains(e.target)) {
                    content_P.contentEditable = false;
                    content_P.parentElement.classList.remove("border", "border-[#ae7aff]");
                    editCommBtn.classList.add("hidden");
                    document.removeEventListener("click", handleOutsideClick);
                }
            }
    
            // Attach the outside click handler
            setTimeout(() => {
                document.addEventListener("click", handleOutsideClick);
            }, 0);
        });
    });
}

const populateComment = (comments)=>{
    noOfCommentsMob.innerHTML = comments.data.length + "  Comments";
    if(comments.data.length < 10){
        document.getElementById("loadMore").classList.replace("flex", "hidden")
    }
    if (comments.data.length == 0 && pageNo == 1) {
        commentSection.innerHTML = `<p class="text-center text-xl">No comments yet</p>`;
        return;
    }
    comments.data.map((comment) => {
        let html = `
            <div data-commentid=${comment._id} class="flex gap-x-4 border-b pb-2 pt-1 relative ">
                            <div data-userid=${comment.commenter._id} class="commenter mt-2 h-11 w-11 shrink-0"><img
                                    src=${comment.commenter.avatar}
                                    alt="sarahjv" class="h-full w-full rounded-full object-cover object-center" /></div>
                            <div class="block w-full">
                                <p class="flex items-center text-gray-200" style="color: #e5e7eb;">${comment.commenter.fullName} · <span
                                        class="text-sm">${getWhenVideoUploaded(comment.createdAt)}</span></p>
                                <p class="text-sm text-gray-500">@${comment.commenter.username}</p>

                                <div class=" flex justify-between mt-2 p-2 pl-0 rounded-md text-sm">
                                    <p contenteditable="false" class="content outline-none pl-0">${comment.content}</p>
                                    <span class="hidden editCommBtn cursor-pointer mr-2 h-5 material-symbols-outlined transition-transform transform duration-150">send</span>
                                </div>

                            </div>
                            <div class="absolute right-0"><span class="threeDots material-symbols-outlined mt-4 cursor-pointer transition-transform transform duration-150">more_vert</span></div>

                            <div data-commentid=${comment._id} class="dotDiv bg-[#000000] hidden border border-[#ae7aff] absolute right-6 bottom-1 rounded-md ">
                                <div class="flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">report</span>Report</div>
                                <div class="${(commenterUsername == comment.commenter.username)? "" : "hidden"} editBtn flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Edit</div>
                                <div class="flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">keep</span>Pin</div>
                                <div class="deleteComm ${commenterID == comment.commenter._id? "" : "hidden"} flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Delete</div>
                            </div>
                        </div>
        `
        commentSection.insertAdjacentHTML("beforeend", html)
    })
}

const switchResolution = (src)=> {
    const currentTime = player.currentTime();
    const isPaused = player.paused();

    let html = `
    <video-js id="my_video" class="vjs-default-skin h-full w-full" width="640" height="264" preload="auto" data-setup='{}' controls autoplay muted>
        <source id="videoSrc" src=${src} type="application/x-mpegURL" />
    </video-js>
    `
    video_showCase.innerHTML = html
    player = videojs(document.getElementById('my_video'));
    player.currentTime(currentTime)
}

let urlParams = new URLSearchParams(window.location.search)
let videoID = urlParams.get("videoID")

fetch(`${DOMAIN}/api/v1/videos/g-p-d/${videoID}`).then((response) => {
    return response.json()
})
.then(async (data) => {
    let video = data.data;
    videoFile = video.videoFile;
    channelDiv.dataset.channelid = video.owner._id
    datasetDiv.setAttribute("data-videoid", video._id)
    let html = `
    <video-js id="my_video" class="vjs-default-skin h-full w-full" width="640" height="264" preload="auto" data-setup='{}' controls autoplay muted>
        <source id="videoSrc" src=${video.videoFile}/index_480p.m3u8 type="application/x-mpegURL" />
    </video-js>
    `
    video_showCase.innerHTML = html
    player = videojs(document.getElementById('my_video'));
    descriptionSection.innerHTML = video.description;
    channelName.innerHTML = video.owner.fullName;
    channelName.setAttribute("data-channelid", video.owner._id)
    channelAvatar.src = video.owner.avatar;
    title.innerHTML = video.title;
    video.tags.forEach((elem) => {
        tagsSection.innerHTML += elem + " "
    })
    views_date.innerHTML = `${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}`
})
//************************************************************ TOGGLE SUBSCRIBE *******************************************************  
.then(() => {
    let subsBtn = document.getElementById("subscribeBtn")
    toggleSubscribe(channelName.dataset.channelid, subsBtn)
})
.then(() => {
    const jsonData = {
        searchInput: title.innerHTML
    }
    fetch(`${DOMAIN}/api/v1/videos/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
        .then((response) => {
            return response.json()
        })
        .then(async (suggestedVideos) => {
            let promises = suggestedVideos.data.map(async element => {
                const html = `
        <div class="w-full gap-x-2 border pr-2 md:flex">
                        <div class="relative mb-2 w-full md:mb-0 md:w-5/12">
                            <div class="w-full pt-[56%]">
                                <div class="video absolute inset-0" data-videoid=${element._id}><img
                                        src=${element.thumbnail}
                                        alt="JavaScript Fundamentals: Variables and Data Types"
                                        class="h-full w-full object-cover object-center" /></div><span
                                    class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(element.duration)}</span>
                            </div>
                        </div>
                        <div class="flex gap-x-2 px-2 pb-2 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                            <div class="h-12 w-12 shrink-0 md:hidden"><img
                                    src=${element.owner.avatar}
                                    alt="" class="h-full w-full rounded-full object-cover object-center" /></div>
                            <div class="w-full flex flex-col gap-[0.17rem] pt-1 md:pt-0">
                                <h6 class=" text-sm font-semibold"> ${element.title} </h6>
                                <p class="  text-[0.8rem] text-gray-200">${element.owner.fullName}</p>
                                <p class="flex text-[0.8rem] text-gray-200">${await formatViews(element._id)} Views · ${getWhenVideoUploaded(element.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                `
                suggestion.insertAdjacentHTML("beforeend", html)
            });
            await Promise.all(promises);
        })
        .then(showVideo)
})
.then(() => {
    //****************************************************** POPULATING COMMENTS *********************************************************  
    fetch(`${DOMAIN}/api/v1/comments/add-get/${datasetDiv.dataset.videoid}?content=video&pageNo=${pageNo++}&limit=10`).then((response) => {
        return response.json();
    })
    .then((comments) => {
        populateComment(comments)
    })
    //******************************************************* THREE DOT OPTIONS *******************************************************  
    .then(threeDotsFunc)
    //************************************************************ EDIT COMMENTS *************************************************  
    .then(editComment)
    .then(()=>{
        // DELETE COMMENT 
        document.querySelectorAll(".deleteComm").forEach((btn)=>{
            btn.addEventListener("click", (e)=>{
                deleteCommentDiv.classList.replace("hidden", "flex")
                deleteComment(e.currentTarget.parentElement)
            })
        })
    })
    .then(()=>{
        document.querySelectorAll(".commenter").forEach((commenter)=>{
            commenter.addEventListener("click", ()=>{
                window.location.href = `/My_Channel_Video?channelID=${commenter.dataset.userid}`
            })
        })
    })
    // ****************************************************** LAOD MORE COMMENTS *****************************************
    document.getElementById("loadMore").addEventListener("click", ()=>{
        bufferingDiv1.classList.replace("hidden", "flex")
        fetch(`${DOMAIN}/api/v1/comments/add-get/${datasetDiv.dataset.videoid}?content=video&pageNo=${pageNo++}&limit=10`).then((response) => {
            return response.json();
        })
        .then((comments) => {
            bufferingDiv1.classList.replace("flex", "hidden")
            populateComment(comments)
        })
        //******************************************************* THREE DOT OPTIONS *******************************************************  
        .then(threeDotsFunc)
        //************************************************************ EDIT COMMENTS *************************************************  
        .then(editComment)
        .then(()=>{
            // DELETE COMMENT 
            document.querySelectorAll(".deleteComm").forEach((btn)=>{
                btn.addEventListener("click", (e)=>{
                    deleteCommentDiv.classList.replace("hidden", "flex")
                    deleteComment(e.currentTarget.parentElement)
                })
            })
        })
        .then(()=>{
            document.querySelectorAll(".commenter").forEach((commenter)=>{
                commenter.addEventListener("click", ()=>{
                    window.location.href = `/My_Channel_Video?channelID=${commenter.dataset.userid}`
                })
            })
        })
    })
})
//*********************************************************** NO OF SUBSCRIBERS *******************************************************  
.then(() => {
    fetch(`${DOMAIN}/api/v1/users/${channelName.dataset.channelid}`).then((response) => {
        return response.json();
    })
    .then((data) => {
        noOfSubs.innerHTML = data.data.subscriberCount + "  Subscribers";
        if(commenterUsername == data.data.username){
            subscribeBtn.classList.add("hidden")
        }
        else if (data.data.isSubscribed) {
            subscribeBtn.dataset.subscribed = "true"
            subscribeBtn.innerText = "Subscribed"
        }
        else{
            subscribeBtn.innerHTML = `
                <span class="inline-block w-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                        aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z">
                                        </path>
                                    </svg></span><span class="">Subscribe</span>
            `
        }
    })
})
//*********************************************************** NO OF LIKES *******************************************************  
.then(() => {
    fetch(`${DOMAIN}/api/v1/likes/get-likes/${datasetDiv.dataset.videoid}?content=video`).then((response) => {
        return response.json();
    })
        .then((data) => {
            likes.innerHTML = data.data;
        })
})
.then(()=>{
    document.getElementById("video_showCase").getElementsByTagName("video")[0].addEventListener("click", (e)=>{
        resolutionDiv.classList.add("hidden");
        if(gearBtn.classList.contains("-top-10")) {
            gearBtn.classList.replace("-top-10", "top-2");
            a = setTimeout(() => {
                gearBtn.classList.replace("top-2", "-top-10");
            }, 2700);
        }
        else{
            gearBtn.classList.replace("top-2", "-top-10")
        }
    })
    document.getElementById("video_showCase").getElementsByTagName("video")[0].addEventListener("touchend", (e)=>{
        resolutionDiv.classList.add("hidden");
        if(gearBtn.classList.contains("-top-10")) {
            gearBtn.classList.replace("-top-10", "top-2");
            a = setTimeout(() => {
                gearBtn.classList.replace("top-2", "-top-10");
            }, 2700);
        }
        else{
            gearBtn.classList.replace("top-2", "-top-10")
        }
    })
})
.catch((err) => "Error while fetching the video!")

//********************************************************** I AM LIKED OR NOT *****************************************************
likedOrNot(videoID, "video").then((data) => {
    if (data.data.liked) {
        likeBtn.dataset.liked = "true";
        likeBtn.classList.add("text-[#ae7aff]");
    }
})

//************************************************************ ADDING LIKES *******************************************************
likeBtn.addEventListener("click", () => {
    if (likeBtn.dataset.liked == "false") {
        toggleLike(datasetDiv.dataset.videoid, "video")
            .then((data) => {
                if (data) {
                    likeBtn.classList.add("text-[#ae7aff]");
                    likeBtn.dataset.liked = "true";
                    likes.innerHTML = Number(likes.innerHTML) + 1;
                }
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    else {
        toggleLike(datasetDiv.dataset.videoid, "video")
            .then((data) => {
                likeBtn.classList.remove("text-[#ae7aff]");
                likeBtn.dataset.liked = "false";
                likes.innerHTML = Number(likes.innerHTML) - 1;
            })
            .catch((err) => {
                console.log(err.message);
            })
    }
})

//************************************************************ ADDING COMMENTS *******************************************************  
let commentInput = document.getElementById("commentInput");
commentInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") addCommentsInClient();
})
sendBtn.addEventListener("click", addCommentsInClient)


//********************************************** GETTING ALL PLAYLISTS & SAVING VIDEO ***************************************************  
const everyThingRelatedToPlaylist = (userID) => {
    fetch(`${DOMAIN}/api/v1/playlist/${userID}`).then((response) => {
        return handleError(response);
    })
        .then((data) => {
            if (data) {
                if (data.data.length > 0) {
                    playlistNameSection.innerHTML = ""
                    data.data.forEach((elem) => {
                        let html = `
                        <li data-playlistid=${elem._id} class="flex items-center justify-between  mb-2">
                            <label class=" inline-flex cursor-pointer items-center gap-x-3 text-[1.1rem] font-medium" for="checkbox">
                                ${elem.name}
                            </label>
                            <input type="checkbox" ${elem.videos.includes(videoID) ? "checked" : ""} name="checkbox" class="playlists w-[1.4rem] h-[1.4rem]" />
                        </li>
                    `
                        playlistNameSection.insertAdjacentHTML("beforeend", html)
                    })
                }
                else {
                    document.getElementById("plNotAvlabl").innerHTML = "No Playlist yet"
                }
            }
        })
        .then(() => {
            document.querySelectorAll(".playlists").forEach(playlist => {
                playlist.addEventListener("click", () => {
                    playlist.disabled = true
                    toogleVideoInPlaylist(playlist.parentElement.dataset.playlistid, videoID).then((data) => {
                        playlist.disabled = false
                    })
                    .finally(() => {
                        playlist.disabled = false
                    })
                })
            });
        })

    saveBtn.addEventListener("click", () => {
        playlistDropDown.classList.toggle('hidden')
    })

    //************************************************************ CREATING NEW PLAYLIST *******************************************************  
    savePlaylist.addEventListener("click", () => {
        fetch(`${DOMAIN}/api/v1/playlist/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: playlist_name.value, isPrivate: isPrivate.checked })
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                let html = `
                <li data-playlistid=${data.data._id} class="flex items-center justify-between  mb-2 last:mb-0">
                                <label class=" inline-flex cursor-pointer items-center gap-x-3 text-[1.1rem] font-medium" for="checkbox">
                                    ${data.data.name}
                                </label>
                                <input type="checkbox" name="checkbox" class="playlists w-[1.2rem] h-[1.2rem]" />
                            </li>
                `
                document.getElementById("plNotAvlabl").innerHTML = ""
                playlistNameSection.insertAdjacentHTML("beforeend", html)
            })
            .then(()=>{
                document.querySelectorAll(".playlists").forEach(playlist => {
                    playlist.addEventListener("click", () => {
                        playlist.disabled = true
                        toogleVideoInPlaylist(playlist.parentElement.dataset.playlistid, videoID).then((data) => {
                            playlist.disabled = false
                        })
                        .finally(() => {
                            playlist.disabled = false
                        })
                    })
                });
            })
    })
}

//************************************************************ NUMBER OF COMMENTS *******************************************************
fetch(`${DOMAIN}/api/v1/comments/count/${videoID}?content=video`).then((response)=> response.json())
.then((data)=>{
    noOfComments.innerHTML = data.data + "  Comments"
})

//************************************************************ VIEW CHANNEL *******************************************************
channelDiv.addEventListener("click", () => {
    window.location.href = `/My_Channel_Video?channelID=${channelDiv.dataset.channelid}`
})

// ************************************************************ CHANGE RESOLUTION *******************************************************
a = setTimeout(() => {
    gearBtn.classList.replace("top-2", "-top-10");
}, 2700);
gearBtn.addEventListener("click", ()=>{
    clearTimeout(a);
    document.getElementById("resolutionDiv").classList.toggle("hidden")
})
const highlightDot = ()=>{
    document.querySelectorAll(".resolutionDots").forEach((elem)=>{
        elem.classList.add("opacity-0")
    })
}
document.getElementById("480p").addEventListener("click", (e)=>{
    highlightDot()
    switchResolution(`${videoFile}/index_480p.m3u8`)
    e.currentTarget.children[0].classList.remove("opacity-0")
})
document.getElementById("720p").addEventListener("click", (e)=>{
    highlightDot()
    switchResolution(`${videoFile}/index_720p.m3u8`)
    e.currentTarget.children[0].classList.remove("opacity-0")
})
document.getElementById("1080p").addEventListener("click", (e)=>{
    highlightDot()
    switchResolution(`${videoFile}/index_1080p.m3u8`)
    e.currentTarget.children[0].classList.remove("opacity-0")
})
document.querySelector("#resolutionDiv").addEventListener("click", (e)=>{
    const target = e.currentTarget;
    setTimeout(() => {
        target.classList.add("hidden")
    }, 300);
})


// ************************************************************ SEARCH FUNCTIONALITY ************************************************************
searchFunctionality()

//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()

//************************************************************ NAVIGATION TO PAGES *******************************************************  
getCurrentUser().then((user) => {
    navigation(user)
    everyThingRelatedToPlaylist(user._id)
    commenterID = user._id
    commenterFullname = user.fullName
    commenterAvatar = user.avatar
    commenterUsername = user.username
})

//************************************************************ WAVE EFFECT *******************************************************  
waveEffect(sendBtn)