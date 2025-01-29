import { DOMAIN } from "./constant.js";
import { countDownFunc } from "./utils.js";
import { formatDuration, formatViews, formatSubs, getWhenVideoUploaded, navigation, getCurrentUser, hamburgerMenu,
    searchFunctionality, showVideo, toggleSubscribe, getPlaylistPoster,
    waveEffect,
    toggleLike,
    likedOrNot,
    addComments,
    handleError,
    toogleVideoInPlaylist,
    deleteComment
} from "./utils.js"
let currentUsername;
let currentFullname;
let currentAvatar;
let currentUserID;
let currentUserEmail;
let videoDiv;
let prevCoverImage;
let prevAvatar;
let prevDescription;
let postID;
let URLparams = new URLSearchParams(window.location.search)
let pageNo = 1;

const threeDotsFunc = (Div, threeDot)=>{
    document.addEventListener("click", (event) => {
        document.querySelectorAll(`.${Div}`).forEach((dotDiv) => {
            if (!dotDiv.classList.contains("hidden")) {
                dotDiv.classList.add("hidden");
            }
        });
    });
    document.querySelectorAll(`.${threeDot}`).forEach((dot) => {
        waveEffect(dot)
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(`.${Div}`).forEach((dotDiv) => {
                if (!dotDiv.classList.contains("hidden")) {
                    dotDiv.classList.add("hidden");
                }
            })
            if(threeDot == "editCommunityPost") dot.parentElement.parentElement.querySelector(`.${Div}`).classList.toggle("hidden");
            else dot.closest(".relative").querySelector(`.${Div}`).classList.toggle("hidden");
        })
    })
}

const editOptions = ()=>{
    document.querySelectorAll(".editComm").forEach((elem) => {
        elem.addEventListener("click", () => {
            const content_P = elem.parentElement.parentElement.querySelector(".content");
            const oldComment = content_P.innerText;
            content_P.contentEditable = true;
            content_P.focus();
            content_P.parentElement.classList.add("border", "border-[#ae7aff]");
            const sendBtn = content_P.parentElement.querySelector(".sendBtn");
            sendBtn.classList.remove("hidden");
    
            // Remove existing event listener to avoid duplication
            sendBtn.removeEventListener("click", handleSendClick);
            sendBtn.addEventListener("click", handleSendClick);
    
            function handleSendClick(e) {
                e.stopPropagation();
                if (content_P.innerText !== oldComment) {
                    content_P.contentEditable = false;
                    content_P.parentElement.classList.remove("border", "border-[#ae7aff]");
                    sendBtn.classList.add("hidden");
    
                    fetch(`${DOMAIN}/api/v1/comments/update-delete/${elem.parentElement.dataset.commentid}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ content: content_P.innerText })
                    })
                }
            }
    
            // Click outside to cancel editing
            function handleOutsideClick(e) {
                if (!content_P.parentElement.contains(e.target)) {
                    content_P.contentEditable = false;
                    content_P.parentElement.classList.remove("border", "border-[#ae7aff]");
                    sendBtn.classList.add("hidden");
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

const populatePostComment = (data)=>{
    if(data.data.length < 2){
        document.getElementById("loadMore").classList.replace("flex", "hidden")
    }
    if(data.data.length > 0){
        data.data.forEach((comment)=>{
            let html = `
                <div class="flex border-b pb-2 pt-1 gap-x-4 relative">
                    <div data-userid=${comment.commenter._id} class="commenter mt-2 h-11 w-11 shrink-0">
                        <img src=${comment.commenter.avatar} alt="sarahjv" class="h-full w-full rounded-full object-cover object-center" />
                    </div>
                    <div class="block w-full">
                        <p class="flex items-center text-gray-200">${comment.commenter.fullName} · <span
                                class="text-sm">${getWhenVideoUploaded(comment.createdAt)} </span></p>
                        <p class="text-sm text-gray-200">@${comment.commenter.username}</p>
                        <div class="flex items-center gap-1 mt-1 p-1 pl-0 rounded-md justify-between">
                            <p class="content outline-none text-sm text-white">${comment.content}</p>
                            <span class="hidden sendBtn text-[#ae7aff] mr-2  cursor-pointer material-symbols-outlined">send</span>
                        </div>
                    </div>
                    <div class="absolute right-0"><span class="CP_threeDots text-white text-[1.4rem] material-symbols-outlined mt-4 cursor-pointer transition-transform transform duration-150">more_vert</span></div>
        
                    <div data-commentid=${comment._id} class="CP_dotDiv bg-black hidden border border-[#ae7aff] absolute z-50 right-6 bottom-[-1.5rem] rounded-md ">
                        <div class="flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">report</span>Report</div>
                        <div class="editComm ${comment.commenter._id != currentUserID? "hidden" : "flex"} items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">edit</span>Edit</div>
                        <div class="pinComm flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">keep</span>Pin</div>
                        <div class="deleteComm ${comment.commenter._id != currentUserID? "hidden" : "flex"} items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">delete</span>Delete</div>
                    </div>
                </div>
            `
            commentSection.insertAdjacentHTML("beforeend", html)
        })
    }
    else{
        if(pageNo == 1){
            commentSection.innerHTML = `<h1 class="text-white">No comments yet</h1>`
            postCommentNum.innerHTML = "0" + "  Comments"
        }
    }
}

const pollForStatus = ()=>{
    const LS_video = localStorage.getItem("video")
    if(LS_video != null){
        let LS_parsedVideo = JSON.parse(LS_video);
        fetch(`${DOMAIN}/api/v1/videos/poll_status/${LS_parsedVideo.videoID}`).then((res)=> res.json())
        .then((data)=> {
            if(data.data.isPublished){
                uploadVideo.removeEventListener("click", showUploadingDiv)
                uploadVideo.addEventListener("click", showUploadDiv)
                uploadVideo.innerHTML = `<span class="material-symbols-outlined mr-1">add</span> Upload`
                uploadingVideoDiv.classList.replace("flex", "hidden")
                uploadedVideoDiv.classList.replace("hidden", "flex")
                videoTitle2.innerHTML = LS_parsedVideo.title;
                size2.innerHTML = LS_parsedVideo.size + " mb"
                localStorage.removeItem("video");
            }
            else{
                noteToRefresh.innerHTML = "NOTE: You can refresh the page"
                noteToRefresh.classList.replace("text-red-400", "text-green-400")
                uploadVideo.removeEventListener("click", showUploadDiv)
                uploadVideo.addEventListener("click", showUploadingDiv)
                uploadVideo.innerHTML = "Uploading..."
                videoTitle.innerHTML = LS_parsedVideo.title;
                size.innerHTML = LS_parsedVideo.size + " mb"
            }
        })
    }
}
pollForStatus()
setInterval(pollForStatus, 5000);

//************************************************************ CHANNEL DETAILS *******************************************************  
const channelDetails = (channelID)=>{
    fetch(`${DOMAIN}/api/v1/users/${channelID}`).then((response)=>{
        return response.json();
    })
    .then((data)=>{
        const owner = data.data;
        console.log(owner);
        noOfSubs.innerHTML = `${owner.subscriberCount} Subscribers  ·  ${owner.channelSubscribedToCount} Channels Subscribed`;
        username.innerHTML = "@" + owner.username;
        usernameInput.value = owner.username;
        channelName.innerHTML = owner.fullName;
        coverImage.src = owner.coverImage? owner.coverImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVpu5LXes7c_BQvwCrH8Prr9d0AKdaug-YtQ&s";
        avatarIMG.src = owner.avatar;
        avatarLogo.src = owner.avatar
        firstname.value = owner.fullName.split(" ")[0];
        lastname.value = owner.fullName.split(" ").slice(1).join(" ");
        email.value = owner.email;
        prevCoverImage = coverImage.src;
        prevAvatar = avatarIMG.src;
        desc.innerHTML = owner.description
        prevDescription = owner.description
    
        if(owner.isSubscribed){
            subscribeBtn.dataset.subscribed = "true"
            subscribeBtn.innerHTML = "Subscribed"
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
}

// ************************************* EVENT LISTENERS FOR SHOWING THE CORRECT SEGMENT *********************************************
let contentSections = document.querySelectorAll(".contentSections")
let sections = document.querySelectorAll(".sections")
let contentSections1 = document.querySelectorAll(".contentSections1")
let sections1 = document.querySelectorAll(".section1")

contentSections.forEach((elem)=>{
    elem.addEventListener("click", ()=>{
        sections.forEach((section)=>{
            if(!section.classList.contains("hidden")){
                section.classList.add("hidden")
            }
            if(section.id == "videos_Section") section.classList.remove("grid");
            else if(section.id == "playlists_Section") section.classList.remove("grid");
            else if(section.id == "channels_Section") section.classList.remove("flex");
        })
        
        if(elem.id == "videos"){
            videos_Section.classList.add("grid");
            videos_Section.classList.remove("hidden");
        }
        else if(elem.id == "playlists"){
            playlists_Section.classList.add("grid");
            playlists_Section.classList.remove("hidden");
        }
        else if(elem.id == "c_posts") c_posts_Section.classList.remove("hidden");
        else if(elem.id == "channels"){
            channels_Section.classList.remove("hidden");
            channels_Section.classList.add("flex");
        }

        contentSections.forEach((section)=>{
            section.classList.add("border-transparent", "text-gray-400")
            section.classList.remove("border-[#ae7aff]", "bg-white", "text-[#ae7aff]")
        })
        elem.classList.remove("border-transparent", "text-gray-400");
        elem.classList.add("border-[#ae7aff]", "bg-white", "text-[#ae7aff]");
    })
})

contentSections1.forEach((elem)=>{
    elem.addEventListener("click", ()=>{
        sections1.forEach((section)=>{
            if(!section.classList.contains("hidden")){
                section.classList.add("hidden")
            }
            if(section.id == "personalInfo_Section") section.classList.remove("flex");
            else if(section.id == "channelInfo_Section") section.classList.remove("flex");
            else if(section.id == "changePassword_Section") section.classList.remove("flex");
        })
        
        if(elem.id == "personalInfo"){
            personalInfo_Section.classList.replace("hidden", "flex");
            changeCoverImage.classList.remove("hidden")
            changeAvatar.classList.remove("hidden")
        }
        else if(elem.id == "channelInfo"){
            channelInfo_Section.classList.replace("hidden", "flex");
            changeCoverImage.classList.add("hidden")
            changeAvatar.classList.add("hidden")
        }
        else if(elem.id == "changePassword"){
            changePassword_Section.classList.replace("hidden", "flex");
            changeCoverImage.classList.add("hidden")
            changeAvatar.classList.add("hidden")
        }

        contentSections1.forEach((section)=>{
            section.classList.add("border-transparent", "text-gray-400")
            section.classList.remove("border-[#ae7aff]", "bg-white", "text-[#ae7aff]")
        })
        elem.classList.remove("border-transparent", "text-gray-400");
        elem.classList.add("border-[#ae7aff]", "bg-white", "text-[#ae7aff]");
    })
})

// ************************************************************ VIDEOS ********************************************************
const getVideos = (channelID)=>{
    notAvailable.innerHTML = "";
    fetch(`${DOMAIN}/api/v1/videos/c/${channelID}`).then((response)=>{
        return response.json();
    })
    .then(async (videos)=>{
        if(videos.data.length > 0){
            document.getElementById("videos").addEventListener("click", ()=>{
                notAvailable.innerHTML = ""
            })
            const LS_video = localStorage.getItem("video");
            let promises = videos.data.map(async video => {
                    let html = `
                        <div class=" w-full relative ${(LS_video != null)? (JSON.parse(LS_video).videoID == video._id)? "hidden" : "" : ""}">
                            <div class="relative mb-2 w-full pt-[56%]">
                                <div data-videoid=${video._id} class="video absolute inset-0">
                                    <img src=${video.thumbnail} alt="JavaScript Fundamentals: Variables and Data Types" class="thumbnailChange h-full w-full object-cover object-center" />
                                </div>
                                <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                            </div>
                            <h6 class="titleChange mb-1 font-semibold">${video.title.length > 54? video.title + "..." : video.title}</h6>
                            <p class="flex justify-between text-sm text-gray-200">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)} <span class="editVideoBtn transition-transform transform duration-150 material-symbols-outlined cursor-pointer ">more_vert</span></p>
    
                            <div class="dotDivVideo hidden bg-black border border-[#ae7aff] absolute right-8 bottom-1 rounded-md ">
                                <div class="deleteVideo ${URLchannelID != currentUserID? "hidden" : "flex"} items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Delete Video</div>
                                <div class="editVideo ${URLchannelID != currentUserID? "hidden" : "flex"} items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Edit Video</div>
                                <div class="addVideo flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">add_box</span>Add to playlist</div>
                            </div>
    
                            <div class="playlistDropDown absolute right-8 top-3 z-10 w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hidden">
                                <h3 class="flex justify-between items-center mb-3 text-center text-lg font-semibold">Save to playlist <span class="crossSaveToPlay cursor-pointer h-5 text-[#ae7aff] material-symbols-outlined">cancel</span> </h3>
                                <div  class="mb-4">
                                    <ul class="playlistNameSection max-h-[8rem] overflow-auto custom-scrollbar">  </ul>
                                </div>
                                <div class="flex flex-col">
                                    <label for="playlist-name"
                                        class="mb-1 inline-block cursor-pointer">Name</label>
                                    <input
                                        class="playlist_name w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
                                            placeholder="Enter playlist name" />
                                    <div class="flex mt-2">
                                        <label for="isPrivate">Private</label>
                                        <input type="checkbox" name="isPrivate" class="isPrivate w-[1.4rem] h-[1.4rem] ml-5" >
                                    </div>
                                    <button class="savePlaylist mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black">Create new playlist</button>
                                </div>
                            </div>
    
                        </div>
                    `
                    videos_Section.insertAdjacentHTML("beforeend", html);
                
            });
            await Promise.all(promises);
        }
        else{
            let html = `
                <div class="w-full max-w-sm text-center">
                    <p class="mb-3 w-full"><span
                            class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]"><svg
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z">
                                </path>
                            </svg></span></p>
                    <h5 class="mb-2 font-semibold">No videos uploaded</h5>
                    <p>This page has yet to upload a video. Search another page in order to find more videos.
                    </p>
                </div>
            `
            notAvailable.innerHTML = html
            document.getElementById("videos").addEventListener("click", ()=>{
                notAvailable.innerHTML = html
            })
        }
    })
    .then(showVideo)
    .then(()=>{
        // CLICKING IN THE THREE DOTS
        document.addEventListener("click", (event) => {
            document.querySelectorAll(".dotDivVideo").forEach((dotDivVideo) => {
                if (!dotDivVideo.classList.contains("hidden")) {
                    dotDivVideo.classList.add("hidden");
                }
            });
        });
        document.querySelectorAll(".editVideoBtn").forEach((dot) => {
            waveEffect(dot)
            dot.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll(".dotDivVideo").forEach((dotDivVideo) => {
                    if (!dotDivVideo.classList.contains("hidden")) {
                        dotDivVideo.classList.add("hidden");
                    }
                })
                dot.closest(".relative").querySelector(".dotDivVideo").classList.toggle("hidden")
            })
        })
        // EDIT VIDEO
        document.querySelectorAll(".editVideo").forEach((elem)=>{
            elem.addEventListener("click", (e)=>{
                videoDiv = e.target.parentElement.parentElement;
                editVideoDiv.classList.replace("hidden", "flex")
                fetch(`${DOMAIN}/api/v1/videos/g-p-d/${e.target.parentElement.parentElement.querySelector(".video").dataset.videoid}`).then((response)=>{
                    return response.json();
                })
                .then((video)=>{
                    let html = `
                       <div id="videoID_Div" data-videoid="${video.data._id}" class="mb-4 flex items-start justify-between">
                            <h2 class="text-xl font-semibold">Edit Video
                                <span class="block text-sm text-gray-300">Share where you've worked on your profile.</span>
                            </h2>
                            <button id="crossEditVideoDiv" class="h-6 w-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <form id="uploadChangesForm" enctype="multipart/form-data">
                            <label for="thumbnail" class="mb-1 inline-block">Thumbnail<sup>*</sup></label>
                            <label class="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10" for="thumbnailInput">
                                <input type="file" name="thumbnail" class="sr-only" id="thumbnailInput" />
                                <img id="thumbnail" src="${video.data.thumbnail}" alt="State Management with Redux" />
                            </label>
                            <div class="mb-6 flex flex-col gap-y-4">
                                <div class="w-full">
                                    <label for="title" class="mb-1 inline-block">Title<sup>*</sup></label>
                                    <input id="title" name="title" type="text" class="w-full border bg-transparent px-2 py-1 outline-none" value="${video.data.title}" />
                                </div>
                                <div class="w-full">
                                    <label for="desc1" class="mb-1 inline-block">Description<sup>*</sup></label>
                                    <textarea id="desc1" name="description" class="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none">${video.data.description}</textarea>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <button id="cancel" type="button" class="border px-4 py-3">Cancel</button>
                                <button id="update" type="submit" class="bg-[#ae7aff] px-4 py-3 text-black">Update</button>
                            </div>
                        </form>
                    `
                    editVideoDivContent.innerHTML = html
                })
                .then(()=>{
                    let imageFile;
                    thumbnailInput.addEventListener("input", ()=> update.disabled = false)
                    document.getElementById("desc1").addEventListener("input", ()=> update.disabled = false)
                    // CROSS EDIT VIDEO
                    crossEditVideoDiv.addEventListener("click", ()=>{
                        editVideoDiv.classList.replace("flex", "hidden")
                        editVideoDivContent.innerHTML = `
                            <div class="message">
                                <div class="text-center font-bold text-xl">Please Wait a few seconds...</div>
                                <dotlottie-player class="m-auto" src="https://lottie.host/27feff6c-53ae-48c7-9539-9a37724286be/8okSjWIQl7.json" background="transparent" speed="1" style="width: 60px; height: 60px;" loop autoplay></dotlottie-player>
                            </div>
                        `
                    })
                    // REVIEWING IMAGE
                    thumbnailInput.addEventListener("change", (e)=>{
                        imageFile = e.target.files[0]
                        update.disabled = false
                        let reader = new FileReader()
                        reader.onload = (e)=>{
                            thumbnail.src = e.target.result
                        }
                        reader.readAsDataURL(imageFile)
                    })
                    // UPDATE CHANGES
                    document.getElementById('uploadChangesForm').addEventListener('submit', (event)=>{
                        event.preventDefault();
                        let videoID = document.getElementById("videoID_Div").dataset.videoid
                        editVideoDivContent.innerHTML = `
                            <div class="message">
                                <div class="text-center font-bold text-xl">Please Wait a few seconds...</div>
                                <dotlottie-player class="m-auto" src="https://lottie.host/27feff6c-53ae-48c7-9539-9a37724286be/8okSjWIQl7.json" background="transparent" speed="1" style="width: 60px; height: 60px;" loop autoplay></dotlottie-player>
                            </div>
                        `
                        const formData = new FormData(event.target);
                        fetch(`${DOMAIN}/api/v1/videos/g-p-d/${videoID}`, {
                            method: "PATCH",
                            body: formData
                        })
                        .then((response)=> response.json())
                        .then((data)=>{
                            videoDiv.querySelector(".thumbnailChange").src = data.data.thumbnail
                            videoDiv.querySelector(".titleChange").innerHTML = data.data.title.length > 54? data.data.title + "..." : data.data.title
                            editVideoDiv.classList.add("hidden")
                        })
                    })
                })
            })
        })

        // DELETE VIDEO
        document.querySelectorAll(".deleteVideo").forEach((elem)=>{
            elem.addEventListener("click", (e)=>{
                videoDiv = e.currentTarget.parentElement.parentElement
                deleteVideoDiv.classList.replace("hidden", "flex")
            })
        })
        yesDeleteVideo.addEventListener("click", ()=>{
            deleteVideoDiv.classList.replace("flex", "hidden")
            showMessage.innerHTML = "Please wait until the video is deleted..."
            bufferingDiv.classList.replace("hidden", "flex")
            fetch(`${DOMAIN}/api/v1/videos/g-p-d/${videoDiv.querySelector(".video").dataset.videoid}`, {
                method: "DELETE"
            })
            .then((response)=> response.json())
            .then((data)=>{
                bufferingDiv.classList.replace("flex", "hidden")
                videoDiv.remove()
            })
        })
        noDeleteVideo.addEventListener("click", ()=> deleteVideoDiv.classList.replace("flex", "hidden"))

        // ADD VIDEO TO PLAYLIST
        document.addEventListener("click", (e)=>{
            document.querySelectorAll(".playlistDropDown").forEach((elem)=>{
                if(!(e.target.classList.contains("addVideo") || e.target.innerHTML == "add_box")) elem.classList.add("hidden");
            })
        })
        document.querySelectorAll(".addVideo").forEach((elem)=>{
            elem.addEventListener("click", (e)=>{
                videoDiv = e.currentTarget.parentElement.parentElement
                fetch(`${DOMAIN}/api/v1/playlist/${currentUserID}`).then((response) => {
                    return handleError(response);
                })
                .then((data) => {
                    if (data) {
                        if (data.data.length > 0) {
                            videoDiv.querySelector(".playlistNameSection").innerHTML = ""
                            data.data.forEach((elem) => {
                                let html = `
                                <li data-playlistid=${elem._id} class=" flex items-center justify-between  mb-2">
                                    <label class=" inline-flex cursor-pointer items-center gap-x-3 text-[1.1rem] font-medium" for="checkbox">
                                        ${elem.name}
                                    </label>
                                    <input type="checkbox" ${elem.videos.includes(videoDiv.querySelector(".video").dataset.videoid) ? "checked" : ""} name="checkbox" class="playlists w-[1.4rem] h-[1.4rem]" />
                                </li>
                                `
                                videoDiv.querySelector(".playlistNameSection").insertAdjacentHTML("beforeend", html)
                            })
                        }
                    }
                })
                .then(() => {
                    document.querySelectorAll(".playlists").forEach(playlist => {
                        playlist.addEventListener("click", () => {
                            playlist.disabled = true
                            toogleVideoInPlaylist(playlist.parentElement.dataset.playlistid, videoDiv.querySelector(".video").dataset.videoid).then((data) => {
                                playlist.disabled = false
                            })
                            .finally(() => {
                                playlist.disabled = false
                            })
                        })
                    });
                    // CREATE PLAYLIST
                    document.querySelectorAll(".savePlaylist").forEach((elem)=>{
                        elem.addEventListener("click", () => {
                            fetch(`${DOMAIN}/api/v1/playlist/create`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ name: elem.parentElement.querySelector(".playlist_name").value, isPrivate: elem.parentElement.querySelector(".isPrivate").checked })
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
                                                <input type="checkbox" name="checkbox" class="playlists  w-[1.4rem] h-[1.4rem]" />
                                            </li>
                                `
                                videoDiv.querySelector(".playlistNameSection").insertAdjacentHTML("beforeend", html)
                            })
                            .then(()=>{
                                document.querySelectorAll(".playlists").forEach(playlist => {
                                    playlist.addEventListener("click", () => {
                                        playlist.disabled = true
                                        toogleVideoInPlaylist(playlist.parentElement.dataset.playlistid, videoDiv.querySelector(".video").dataset.videoid).then((data) => {
                                            playlist.disabled = false
                                        })
                                        .finally(() => {
                                            playlist.disabled = false
                                        })
                                    })
                                });
                            })
                        })
                    })
                })
                e.currentTarget.parentElement.parentElement.querySelector(".playlistDropDown").classList.remove("hidden")
            })
        })
        document.querySelectorAll(".crossSaveToPlay").forEach((elem)=>{
            elem.addEventListener("click", ()=>{
                elem.parentElement.parentElement.classList.add("hidden")
            })
        })
        document.querySelectorAll(".playlistDropDown").forEach((elem)=>{
            elem.addEventListener("click", (e)=>{
                e.stopPropagation()
            })
        })
    })
}

// ************************************************************ PLAYLISTS ********************************************************
let nameInput = document.getElementById("name")
let descInput = document.getElementById("descriptionPlay")
let isChecked;
let editElement;
let deleteElement;
const getPlaylists = (channelID)=>{
    notAvailable.innerHTML = "";
    fetch(`${DOMAIN}/api/v1/playlist/${channelID}`).then((response)=>{
        return response.json()
    })
    .then(async (playlists)=>{
        if(playlists.data.length > 0){
            document.getElementById("playlists").addEventListener("click", ()=>{
                notAvailable.innerHTML = ""
            })
            
            let promises = playlists.data.map(async (playlist)=>{
                let poster;
                if(playlist.videos.length > 0){
                    poster = await getPlaylistPoster(playlist.videos[0]);
                }else{
                    poster = "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"
                }
                let html1 = `
                    <div class="w-full relative">
                            <div data-playlistid="${playlist._id}" class="allPlaylistCards relative mb-2 w-full pt-[56%]">
                              <div class="absolute inset-0">
                                <img
                                  src=${poster}
                                  alt="React Mastery"
                                  class="h-full w-full object-cover object-center" />
                                <div class="absolute inset-x-0 bottom-0">
                                  <div class="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div class="relative z-[1]">
                                      <p class="flex justify-between">
                                        <span class="playlistIsPrivate inline-block">${playlist.isPrivate ? "Private" : "Public"}</span>
                                        <span class="inline-block">${playlist.videos.length} videos</span>
                                      </p>
                                      <p class="text-sm text-gray-200">100K Views · ${getWhenVideoUploaded(playlist.createdAt)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h6 class=" flex justify-between mb-1"><span class="name font-semibold">${playlist.name}</span> <span class="editPlaylistBtn ${URLchannelID != currentUserID? "hidden" : ""} transition-transform transform duration-150 material-symbols-outlined cursor-pointer ">more_vert</span></h6>
                            <p class="description flex text-sm text-gray-200">${playlist.description}</p>

                            <div class="dotDiv bg-black hidden border border-[#ae7aff] absolute right-6 bottom-1 rounded-md ">
                                <div class="deletePlaylist flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Delete</div>
                                <div class="editPlaylist flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Edit</div>
                            </div>
                        </div>
                `
                playlists_Section.insertAdjacentHTML("beforeend", html1)
            })
            await Promise.all(promises)
        }
        else{
            document.getElementById("playlists").addEventListener("click", ()=>{
                let html = `
                <div class="w-full max-w-sm text-center">
                                    <p class="mb-3 w-full"><span
                                            class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]"><span
                                                class="inline-block w-6"><svg style="width:100%" viewBox="0 0 22 20" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                </svg></span></span></p>
                                    <h5 class="mb-2 font-semibold">No playlist created</h5>
                                    <p>There are no playlist created on this channel.</p>
                        </div>
                `
                notAvailable.innerHTML = html
            })
        }
    })
    .then(()=>{ // NAVIGATE TO PLAYLIST VIDEOS
        document.querySelectorAll(".allPlaylistCards").forEach((card)=>{
            card.addEventListener("click", ()=>{
                window.location.href = `/Channel_Playlist_Video?playlistID=${card.dataset.playlistid}&subscribers=${noOfSubs.innerHTML.split(" ")[0]}`
            })
        })
        // SHOWING THE THREE DOTS DIV WHEN IT'S CLICKED
        document.addEventListener("click", (event) => {
            document.querySelectorAll(".dotDiv").forEach((dotDiv) => {
                if (!dotDiv.classList.contains("hidden")) {
                    dotDiv.classList.add("hidden");
                }
            });
        });
        document.querySelectorAll(".editPlaylistBtn").forEach((dot) => {
            waveEffect(dot)
            dot.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll(".dotDiv").forEach((dotDiv) => {
                    if (!dotDiv.classList.contains("hidden")) {
                        dotDiv.classList.add("hidden");
                    }
                })
                dot.closest(".relative").querySelector(".dotDiv").classList.toggle("hidden")
            })
        })
        // THE EDIT PLAYLIST OPTIONS
        document.querySelectorAll(".editPlaylist").forEach((elem)=>{
            elem.addEventListener("click", (e)=>{
                editElement = e.currentTarget.parentElement.parentElement;
                if(elem.parentElement.parentElement.querySelector(".playlistIsPrivate").innerHTML == "Private"){
                    isPrivate.checked = true;
                }
                else isPrivate.checked = false;
                nameInput.value = elem.parentElement.parentElement.querySelector(".name").innerText
                descInput.value = elem.parentElement.parentElement.querySelector(".description").innerHTML
                editPlayDiv.classList.remove("hidden")
                editPlayDiv.classList.add("flex")
                isChecked = isPrivate.checked

                editPlayDiv.dataset.playlistid = elem.parentElement.parentElement.children[0].dataset.playlistid
            })
        })
        // THE DELETE POP-UP
        document.querySelectorAll(".deletePlaylist").forEach((elem)=>{
            elem.addEventListener("click", (e)=>{
                deleteElement = e.target.parentElement.parentElement
                deletePlayDiv.classList.replace("hidden", "flex")
            })
        })
    })
}

// ************************************************************ EDIT PLAYLISTS ********************************************************
submitEdit.addEventListener("click", (e)=>{
    if(!nameInput.value && !descInput.value && (isChecked == isPrivate.checked)){
        document.getElementById("alertDiv1").classList.remove("hidden");
        setTimeout(() => {
            document.getElementById("alertDiv1").classList.add("hidden");
        }, 2500);
    }
    else{
        fetch(`${DOMAIN}/api/v1/playlist/p/${editPlayDiv.dataset.playlistid}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: nameInput.value, description: descInput.value, isPrivate: isPrivate.checked })
        }).then((response)=> response.json())
        .then((data)=> {
            editPlayDiv.classList.add("hidden")          
            editElement.querySelector(".playlistIsPrivate").innerHTML = data.data.isPrivate? "Private" : "Public"
            editElement.querySelector(".name").innerText = data.data.name
            editElement.querySelector(".description").innerHTML = data.data.description
        })
    }
})

// ************************************************************ DELETE PLAYLISTS ********************************************************
yesDelete.addEventListener("click", (e)=>{
    fetch(`${DOMAIN}/api/v1/playlist/p/${deleteElement.querySelector(".allPlaylistCards").dataset.playlistid}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response)=> response.json())
    .then((data)=> {
        deletePlayDiv.classList.replace("flex", "hidden")
        deleteElement.remove()
    })
})
noDelete.addEventListener("click", ()=> deletePlayDiv.classList.replace("flex", "hidden"))


// ************************************************************ COMMUNITY POSTS ********************************************************
const getPosts = (channelID)=>{
    notAvailable.innerHTML = "";
    fetch(`${DOMAIN}/api/v1/community-post/get-posts/${channelID}`).then((response)=>{
        return response.json()
    })
    .then((posts)=>{
        if(posts.data.posts.length > 0){
            document.getElementById("c_posts").addEventListener("click", ()=>{
                notAvailable.innerHTML = ""
            })
            let i = 0;
            posts.data.posts.forEach((post) => {
                let photoDivHidden = post.photo ? "" : "hidden";
                let photo = post.photo ? post.photo : "";
            
                let html = `
                    <div class="flex gap-3 pt-4 mb-5 lg:mb-6 ${(i++ != 0) ? "border-t" : ""}">
                        <div class="rounded-full overflow-hidden h-14 w-14 shrink-0">
                            <img src="${posts.data.owner.avatar}" alt="Avatar" class="object-cover w-full h-full object-center">
                        </div>
                        <div data-postid=${post._id} class="relative w-full">
                            <h4 class="relative mb-1 flex items-center gap-x-2">
                                <span class="font-semibold">${posts.data.owner.fullName}</span>
                                <span class="inline-block text-sm text-gray-400">${getWhenVideoUploaded(post.createdAt)}</span>
                                <span class="material-symbols-outlined editCommunityPost absolute right-0 cursor-pointer">more_vert</span>
                            </h4>
                            <p class="captions mb-2">${post.caption}</p>

                            <div class="${photoDivHidden} w-full h-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-lg overflow-hidden">
                                <img src="${photo}" class="w-full h-auto object-cover object-center" alt="Post photo">
                            </div>

                            <div class="flex mt-4 gap-4">
                                <button data-liked="false" class="likes inline-flex items-center gap-x-1 outline-none hover:bg-[#ffffff17] px-2 py-0.5 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 ">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"></path>
                                    </svg>
                                    <span class="likeNum">0</span>
                                </button>
                                <button class="postComment flex items-center gap-1 hover:bg-[#ffffff17] px-2 py-0.5 rounded-full">
                                    <span class="h-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="21" height="21" color="#ffffff" fill="none">
                                            <path d="M22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9545C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9948 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.28357 6.47778 2 12 2C17.5222 2 22 6.28357 22 11.5667Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                            <path d="M11.9955 12H12.0045M15.991 12H16M8 12H8.00897" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <span class="commentNum"></span>
                                </button>
                            </div>
                            <div class="dotDivPost hidden bg-black border border-[#ae7aff] absolute right-8 top-5 rounded-md">
                                <div class="deletePost flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Delete Post</div>
                                <div class="editPost flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Edit Post</div>
                            </div>
                        </div>
                    </div>

                `;
                c_posts_Section.insertAdjacentHTML("beforeend", html);
            });   
        }
        else{
            document.getElementById("c_posts").addEventListener("click", ()=>{
                let html = `
                <div class="w-full max-w-sm text-center">
                            <p class="mb-3 w-full"><span
                                    class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]"><span
                                        class="inline-block w-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                            aria-hidden="true" class="w-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z">
                                            </path>
                                        </svg></span></span></p>
                            <h5 class="mb-2 font-semibold">No Community Posts</h5>
                            <p>This channel has yet to make a <strong>Community Post</strong>.</p>
                        </div>
                `
                notAvailable.innerHTML = html
            })
        }
    })
    .then(()=>{
        // DELETE THE COMMUNITY POST
        let Div;
        threeDotsFunc("dotDivPost", "editCommunityPost");
        document.querySelectorAll(".deletePost").forEach(elem =>{
            elem.addEventListener("click", (e)=>{
                Div = e.currentTarget.parentElement.parentElement.parentElement;
                document.getElementById("deletePostDiv").dataset.postid = elem.parentElement.parentElement.dataset.postid;
                document.getElementById("deletePostDiv").classList.replace("hidden", "flex");
            })
        })
        document.getElementById("noDeletePost").addEventListener("click", ()=>{
            document.getElementById("deletePostDiv").classList.replace("flex", "hidden");
        })
        document.getElementById("yesDeletePost").addEventListener("click", ()=>{
            document.getElementById("deletePostDiv").classList.replace("flex", "hidden");
            showMessage.innerHTML = "Deleting the Community Post..."
            bufferingDiv.classList.replace("hidden", "flex");
            fetch(`${DOMAIN}/api/v1/community-post/update-delete/${document.getElementById("deletePostDiv").dataset.postid}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res)=> res.json())
            .then((data)=> {
                bufferingDiv.classList.replace("flex", "hidden");
                Div.remove()
            })
        })
        let captionDiv;
        // EDIT THE COMMUNITY POST
        document.querySelectorAll(".editPost").forEach(elem =>{
            elem.addEventListener("click", (e)=>{
                captionDiv = e.currentTarget.parentElement.parentElement.querySelector(".captions")
                editCaptionDiv.dataset.postid = e.currentTarget.parentElement.parentElement.dataset.postid;
                document.getElementById("newCaption").value = captionDiv.innerHTML;
                editCaptionDiv.classList.replace("hidden", "flex");
            })
        })
        document.getElementById("crossEditCaption").addEventListener("click", ()=>{
            editCaptionDiv.classList.replace("flex", "hidden");
        })
        document.getElementById("newCaption").addEventListener("input", ()=>{
            if(document.getElementById("newCaption").value != "") document.getElementById("editCaptionBtn").disabled = false;
            else document.getElementById("editCaptionBtn").disabled = true;
        })
        document.getElementById("editCaptionBtn").addEventListener("click", ()=>{
            captionDiv.innerHTML = document.getElementById("newCaption").value
            editCaptionDiv.classList.replace("flex", "hidden");
            fetch(`${DOMAIN}/api/v1/community-post/update-delete/${editCaptionDiv.dataset.postid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ caption: document.getElementById("newCaption").value })
            }).then((res)=> res.json())
            .then((data)=> console.log(data))
        })

        document.querySelectorAll(".likeNum").forEach((elem)=>{
            const postID = elem.parentElement.parentElement.parentElement.dataset.postid;
            // I AM LIKED OR NOT IN C_POST
            likedOrNot(postID, "post").then((data)=>{
                if(data.data.liked){
                    elem.parentElement.dataset.liked = "true"
                    elem.parentElement.classList.add("text-[#ae7aff]")
                }
            })

            // GETTING LIKES COMMUNITY POST
            fetch(`${DOMAIN}/api/v1/likes/get-likes/${postID}?content=post`).then((response)=> response.json())
            .then((data)=>{
                elem.innerHTML = data.data
            })
        })

        // TOGGLING LIKES IN COMMUNITY POST
        document.querySelectorAll(".likes").forEach((likeBtn)=>{
            likeBtn.addEventListener("click", ()=>{
                if(likeBtn.dataset.liked == "true"){
                    likeBtn.dataset.liked = "false"
                    likeBtn.querySelector(".likeNum").innerHTML = Number(likeBtn.querySelector(".likeNum").innerHTML) - 1
                    likeBtn.classList.remove("text-[#ae7aff]")

                    toggleLike(likeBtn.parentElement.parentElement.dataset.postid, "post").then((data)=>{
                        console.log(data);
                    })
                }
                else{
                    likeBtn.dataset.liked = "true"
                    likeBtn.querySelector(".likeNum").innerHTML = Number(likeBtn.querySelector(".likeNum").innerHTML) + 1
                    likeBtn.classList.add("text-[#ae7aff]")
                    
                    toggleLike(likeBtn.parentElement.parentElement.dataset.postid, "post").then((data)=>{
                        console.log(data);
                    })
                }
            })
        })
        crossPostCommentsDiv.addEventListener("click", ()=>{ // CROSSING THE COMMENTS SECTION
            postCommentsDiv.classList.add("hidden")
        })
        // CLICKING IN COMEMNTS
        document.querySelectorAll(".postComment").forEach((btn)=>{
            btn.addEventListener("click", (e)=>{
                pageNo = 1;
                if(document.getElementById("loadMore").classList.contains("hidden")) document.getElementById("loadMore").classList.replace("hidden", "flex");
                bufferingDiv1.classList.replace("hidden", "flex")
                postID = btn.parentElement.parentElement.dataset.postid
                // NUMBER OF COMMENTS
                fetch(`${DOMAIN}/api/v1/comments/count/${postID}?content=post`).then((response)=> response.json())
                .then((data)=>{
                    postCommentNum.innerHTML = data.data + "  Comments"
                })

                commentSection.innerHTML = ""
                document.getElementById("postCommentsDiv").classList.remove("hidden")
                document.getElementById("postCommentsDiv").dataset.postid = e.currentTarget.parentElement.parentElement.dataset.postid
                fetch(`${DOMAIN}/api/v1/comments/add-get/${postID}?content=post&pageNo=${pageNo++}&limit=2`).then((response)=> response.json())
                .then((data)=>{
                    bufferingDiv1.classList.replace("flex", "hidden")
                    populatePostComment(data)
                })
                .then(()=>{
                    threeDotsFunc("CP_dotDiv", "CP_threeDots")
                })
                .then(()=>{
                    //******************************************** DELETE C_POST COMMENTS *************************************  
                    document.querySelectorAll(".deleteComm").forEach((btn)=>{
                        btn.addEventListener("click", (e)=>{
                            deleteCommentDiv.classList.replace("hidden", "flex")
                            deleteComment(e.currentTarget.parentElement)
                        })
                    })
                    //******************************************** EDIT C_POST COMMENTS *************************************  
                    editOptions()
                    //******************************************** ADD C_POST COMMENTS *************************************  
                    document.getElementById("addComment").addEventListener("click", ()=>{
                        console.log(currentFullname)
                        if(currentFullname){
                            if(addCommPost.value.length > 0){
                                addComments(postCommentsDiv.dataset.postid, "post", addCommPost.value)
                                .then((data)=>{
                                    addCommPost.value = ""
                                    let html = `
                                        <div class="flex gap-x-4 border-b pb-2 pt-1 relative">
                                            <div class="commenter mt-2 h-11 w-11 shrink-0">
                                                <img src=${currentAvatar} alt="sarahjv" class="h-full w-full rounded-full object-cover object-center" />
                                            </div>
                                            <div class="block w-full">
                                                <p class="flex items-center text-gray-200">${currentFullname} · <span
                                                        class="text-sm">${getWhenVideoUploaded(data.data.createdAt)} </span></p>
                                                <p class="text-sm text-gray-200">@${currentUsername}</p>
                                                <div class="flex items-center gap-1 mt-1 p-1 pl-0 rounded-md justify-between">
                                                    <p class="content outline-none text-sm text-white">${data.data.content}</p>
                                                    <span class="hidden sendBtn text-[#ae7aff] mr-2  cursor-pointer material-symbols-outlined">send</span>
                                                </div>
                                            </div>
                                            <div class="absolute right-0"><span class="CP_threeDots text-white text-[1.4rem] material-symbols-outlined mt-4 cursor-pointer transition-transform transform duration-150">more_vert</span></div>
                                
                                            <div data-commentid=${data.data._id} class="CP_dotDiv bg-black hidden border border-[#ae7aff] absolute z-50 right-6 bottom-[-1.5rem] rounded-md ">
                                                <div class="flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">report</span>Report</div>
                                                <div class="editComm flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">edit</span>Edit</div>
                                                <div class="pinComm flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">keep</span>Pin</div>
                                                <div class="deleteComm flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem] text-white"><span class="text-[#ae7aff] mr-2 h-5 material-symbols-outlined">delete</span>Delete</div>
                                            </div>
                                        </div>
                                    `
                                    commentSection.insertAdjacentHTML("afterbegin", html)
                                })
                                .then(()=>{
                                    threeDotsFunc("CP_dotDiv", "CP_threeDots")
                                })
                                .then(editOptions)
                                .then(()=>{
                                    document.querySelectorAll(".deleteComm").forEach((btn)=>{
                                        btn.addEventListener("click", (e)=>{
                                            deleteCommentDiv.classList.replace("hidden", "flex")
                                            deleteComment(e.currentTarget.parentElement)
                                        })
                                    })
                                })
                            }   
                        }
                        else{
                            alertDiv.classList.remove("hidden");
                            setTimeout(() => {
                                alertDiv.classList.add("hidden");
                            }, 3000)
                        }
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
    })
}

// ************************************************************ LOAD MORE C_POST COMMENTS **********************************************
document.getElementById("loadMore").addEventListener("click", ()=>{
    bufferingDiv1.classList.replace("hidden", "flex")
    fetch(`${DOMAIN}/api/v1/comments/add-get/${postID}?content=post&pageNo=${pageNo++}&limit=2`).then((response)=> response.json())
    .then((data)=>{
        bufferingDiv1.classList.replace("flex", "hidden")
        populatePostComment(data)
    })
    .then(()=>{
        threeDotsFunc("CP_dotDiv", "CP_threeDots")
    })
    .then(()=>{
        //******************************************** DELETE C_POST COMMENTS *************************************  
        document.querySelectorAll(".deleteComm").forEach((btn)=>{
            btn.addEventListener("click", (e)=>{
                deleteCommentDiv.classList.replace("hidden", "flex")
                deleteComment(e.currentTarget.parentElement)
            })
        })
        //******************************************** EDIT C_POST COMMENTS *************************************  
        editOptions()                    
    })
    .then(()=>{
        document.querySelectorAll(".commenter").forEach((commenter)=>{
            commenter.addEventListener("click", ()=>{
                window.location.href = `/My_Channel_Video?channelID=${commenter.dataset.userid}`
            })
        })
    })
})

// ************************************************************ CHANNELS SUBSCRIBED *****************************************************
const getChannels = (channelID)=>{
    notAvailable.innerHTML = "";
    fetch(`${DOMAIN}/api/v1/subscription/get-channels/${channelID}`).then((response)=>{
        return response.json()
    })
    .then((channels)=>{
        if(channels.data.length > 0){
            channels.data.forEach((channel)=>{
                let html = `
                    <div data-channelid=${channel.channel._id} class=" flex w-full justify-between ">
                            <div  class="channelIdDiv flex items-center gap-x-2 cursor-pointer">
                                <div class="h-14 w-14 shrink-0"><img
                                        src=${channel.channel.avatar}
                                        alt="Code Master" class="h-full w-full rounded-full object-cover object-center" /></div>
                                <div class="block">
                                    <h6 class="font-semibold">${channel.channel.fullName}</h6>
                                    <p class="channelDiv text-sm text-gray-300"></p>
                                </div>
                            </div>
                            <div class="${currentUserID != URLchannelID? "hidden" : ""} block">
                                <button data-subscribed="true" class="subscribeBtns px-3 py-2 bg-white text-[#ae7aff] flex items-center justify-between">Subscribed</button>
                            </div>
                        </div>
                `
                channels_Section.insertAdjacentHTML("beforeend", html)
            })
            
            document.getElementById("channels").addEventListener("click", ()=>{
                notAvailable.innerHTML = ""
            })
        }
        else{
            document.getElementById("channels").addEventListener("click", ()=>{
                let html = `
                <div class="w-full max-w-sm text-center">
                            <p class="mb-3 w-full"><span
                                    class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]"><span
                                        class="inline-block w-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                            aria-hidden="true" class="w-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z">
                                            </path>
                                        </svg></span></span></p>
                            <h5 class="mb-2 font-semibold">No channels subscribed</h5>
                            <p>This channel has yet to <strong>subscribe</strong> a new channel.</p>
                        </div>
                `
                notAvailable.innerHTML = html
            })
        }
        return channels.data;
    })
    .then((channels)=>{
        document.querySelectorAll(".channelDiv").forEach((user)=>{
            fetch(`${DOMAIN}/api/v1/subscription/get-no-of-subs/${user.parentElement.parentElement.parentElement.dataset.channelid}`).then((response)=>{
                return response.json()
            }).then((data)=>{
                user.innerHTML = formatSubs(data.data) + "  Subscribers"
            })
        })

        document.querySelectorAll(".channelIdDiv").forEach((div)=>{
            div.addEventListener("click", ()=>{
                window.location.href = `/My_Channel_Video?channelID=${div.parentElement.dataset.channelid}`
            })
        })
    })
    .then(async ()=>{
        const subscribeBtns = Array.from(document.querySelectorAll(".subscribeBtns"));
        const promises = subscribeBtns.map(subscribeBtn => {
            // Adding visual feedback on button click
            subscribeBtn.addEventListener("click", () => {
                if(subscribeBtn.innerText == "Subscribe"){
                    subscribeBtn.classList.remove("text-black", "bg-[#ae7aff]");
                    subscribeBtn.classList.add("bg-white", "text-[#ae7aff]");
                }
                else{
                    subscribeBtn.classList.remove("bg-white", "text-[#ae7aff]");
                    subscribeBtn.classList.add("text-black", "bg-[#ae7aff]");
                }
            });
            // Attaching the toggleSubscribe function
            const channelID = subscribeBtn.parentElement.parentElement.dataset.channelid;
            return toggleSubscribe(channelID, subscribeBtn);
        });

        await Promise.all(promises);
    })
}

// ************************************************************ UPLOAD VIDEO *****************************************************
const getDurationFromMetaData = (file)=>{
    return new Promise((resolve, reject)=>{
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = url;
        let duration;
        video.addEventListener('loadedmetadata', function() {
            duration = video.duration; // Duration in seconds
            URL.revokeObjectURL(url); // Clean up the object URL
            console.log(duration);
            resolve(duration)
        });
        video.addEventListener('error', function() {
            URL.revokeObjectURL(url); // Clean up the object URL
            reject(new Error("Failed to load metadata"))
        });
    })
}

const showUploadDiv = ()=>{
    uploadDiv.classList.remove("hidden")
}
const showUploadingDiv = ()=>{
    uploadingVideoDiv.classList.replace("hidden", "flex")
}
uploadVideo.addEventListener("click", showUploadDiv)
crossUpload.addEventListener("click", ()=>{
    uploadDiv.classList.add("hidden")
})
crossUploading.addEventListener("click", ()=>{
    uploadingVideoDiv.classList.add("flex", "hidden")
})
finishUploaded.addEventListener("click", ()=>{
    uploadedVideoDiv.classList.replace("flex", "hidden")
})
crossUploadFailed.addEventListener("click", ()=>{
    failedUpload.classList.replace("flex", "hidden");
})

saveUpload.addEventListener("click", async ()=>{
    if(thumbnail.files.length > 0 && video.files.length > 0 && title.value && tags.value.split(" ").length > 2){
        let fileVideo = document.getElementById("video").files[0]
        let fileThumbnail = document.getElementById("thumbnail").files[0]
        const duration = await getDurationFromMetaData(fileVideo);
        uploadDiv.classList.add("hidden")
        uploadingVideoDiv.classList.replace("hidden", "flex")
        videoTitle.innerHTML = title.value;
        size.innerHTML = (video.files[0].size/1048576).toFixed(1) + " mb"
        uploadVideo.innerHTML = "Uploading..."
        uploadVideo.removeEventListener("click", showUploadDiv)
        uploadVideo.addEventListener("click", showUploadingDiv)
        
        let fileName = Date.now();
        fetch(`${DOMAIN}/api/v1/videos/getThumbnailSignedURL?filename=${fileName}&contentType=${fileThumbnail.type.split("/")[1]}`).then((res)=> res.json())
        .then((data)=>{
            console.log("Thumbnail-->", data.data.url);
            fetch(data.data.url, {
                method: "PUT",
                body: fileThumbnail,
                headers: {
                    "Content-Type": fileThumbnail.type
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to upload THUMBNAIL.");
                }
                console.log("THUMBNAIL uploaded successfully.");
            })
        })
        
        fetch(`${DOMAIN}/api/v1/videos/getSignedURL?filename=${fileName}`).then((res)=> res.json())
        .then((data)=>{
            console.log("Video-->", data.data.url);
            fetch(data.data.url, {
                method: "PUT",
                body: fileVideo,
                headers: {
                    "Content-Type": fileVideo.type
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to upload VIDEO.");
                }
                console.log("VIDEO uploaded successfully.");
            })
            .then(()=>{
                fetch(`${DOMAIN}/api/v1/videos/publish?objectKey=${fileName}&duration=${duration}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: document.getElementById("title").value,
                        tags: document.getElementById("tags").value,
                        description: document.getElementById("description").value,
                        thumbnailURL: `https://s3.amazonaws.com/thumbnail.bucket/${fileName}`
                    })
                })
                .then((response)=> {
                    if(response.status > 399) return undefined;
                    return response.json()
                })
                .then((data)=>{
                    console.log(data);
                    if(data){
                        localStorage.setItem("video", JSON.stringify({
                            videoID: data.data._id,
                            title: document.getElementById("title").value,
                            size: (fileVideo.size/1048576).toFixed(1)
                        }));
                    }
                    else{
                        uploadVideo.removeEventListener("click", showUploadingDiv)
                        uploadVideo.addEventListener("click", showUploadDiv)
                        uploadVideo.innerHTML = `<span class="material-symbols-outlined mr-1">add</span> Upload`
                        uploadingVideoDiv.classList.replace("flex", "hidden")
                        failedUpload.classList.replace("hidden", "flex")
                        videoTitleF.innerHTML = title.value;
                        sizeF.innerHTML = (video.files[0].size / 1048576).toFixed(1) + " mb";
                    }
                    noteToRefresh.innerHTML = "NOTE: Now you can refresh the page";
                    noteToRefresh.classList.replace("text-red-400", "text-green-400");
                })
                .catch((err)=>{
                    console.log(err.message);
                })
            })
            .catch((err)=>{
                console.error(err)
            })
        })
    }
    else{
        // COMPLETE THIS
    }
})

// ******************************************************** UPLOAD COMMUNITY POST ***************************************************
const showUploadPost = ()=>{
    uploadC_Post.classList.replace("hidden", "flex")
}
uploadPost.addEventListener("click", showUploadPost)
crossUploadPostDiv.addEventListener("click", ()=>{
    uploadC_Post.classList.replace("flex", "hidden")
})
cancelPost.addEventListener("click", ()=>{
    photo.src = "";
    caption.value = ""
    uploadC_Post.classList.replace("flex", "hidden")
})
caption.addEventListener("input", ()=>{
    if(caption.value != "") uploadPostFetch.disabled = false;
    else uploadPostFetch.disabled = true;
})
uploadPostFetch.addEventListener("click", (e)=>{
    e.preventDefault()
    uploadC_Post.classList.replace("flex", "hidden")
    uploadingVideoDiv.classList.replace("hidden", "flex")
    videoTitle.innerHTML = caption.value
    document.getElementById("size").innerHTML = (document.getElementById("photoInput")?.files?.[0]?.size/1048576).toFixed(1) + " mb" || "No size"
    uploadPost.innerHTML = "Uploading..."
    uploadPost.removeEventListener("click", showUploadPost)
    uploadPost.addEventListener("click", showUploadingDiv)

    let formData = new FormData(document.getElementById("uploadPostForm"))
    fetch(`${DOMAIN}/api/v1/community-post/add`, {
        method: "POST",
        body: formData
    })
    .then((response)=> response.json())
    .then((data)=>{
        uploadPost.removeEventListener("click", showUploadingDiv)
        uploadPost.addEventListener("click", showUploadPost)
        uploadPost.innerHTML = `<span class="material-symbols-outlined mr-1">add</span> Upload`
        uploadingVideoDiv.classList.replace("flex", "hidden")
        uploadedVideoDiv.classList.replace("hidden", "flex")
        videoTitle2.innerHTML = caption.value;
        size2.innerHTML = (document.getElementById("photoInput")?.files?.[0]?.size / 1048576).toFixed(1) + " mb" || "No size"
    })
})

// ********************************************************* VIEW CHANNEL TO/FROM EDIT **************************************************
document.getElementById("editP_Info").addEventListener("click", ()=>{
    document.getElementById("EditSection").classList.remove("hidden")
    document.getElementById("ChannelSection").classList.add("hidden")
    document.getElementById("viewChannel").classList.remove("hidden")
    document.getElementById("editP_Info").classList.add("hidden")
    changeCoverImage.classList.remove("hidden")
    changeAvatar.classList.remove("hidden")
})
document.getElementById("viewChannel").addEventListener("click", ()=>{
    document.getElementById("ChannelSection").classList.remove("hidden")
    document.getElementById("EditSection").classList.add("hidden")
    document.getElementById("viewChannel").classList.add("hidden")
    document.getElementById("editP_Info").classList.remove("hidden")
    changeCoverImage.classList.add("hidden")
    changeAvatar.classList.add("hidden")
})

// ************************************************************ EDIT PERSONAL INFO *****************************************************
let inputChanged = false
let saveEditP_Info = document.getElementById("saveEditP_Info")
let personalObj = {}
firstname.addEventListener("input", ()=> { 
    personalObj.fullName = `${firstname.value.trim()} ${lastname.value.trim()}`
    saveEditP_Info.disabled = false
    inputChanged = true
})
lastname.addEventListener("input", ()=> { 
    personalObj.fullName = `${firstname.value.trim()} ${lastname.value.trim()}`
    saveEditP_Info.disabled = false
    inputChanged = true
})
email.addEventListener("input", ()=> {
    personalObj.email = email.value
    saveEditP_Info.disabled = false
    inputChanged = true
})

document.getElementById("cancelEditP_Info").addEventListener("click", ()=>{
    coverImage.src = prevCoverImage;
    avatarIMG.src = prevAvatar;
    firstname.value = currentFullname.split(" ")[0];
    lastname.value = currentFullname.split(" ").slice(1).join(" ")
    email.value = currentUserEmail;
})
saveEditP_Info.addEventListener("click", ()=>{
    saveEditP_Info.disabled = true
    bufferingDiv.classList.replace("hidden", "flex")
    showMessage.innerHTML = "Updating your personal information..."

    let promises = [];
    if(inputChanged){
        let fullName = `${firstname.value.trim()} ${lastname.value.trim()}`

        const updateUserDetailsPromise = fetch(`${DOMAIN}/api/v1/users/update-user-detailes`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personalObj)
        })
        .then((response) =>{
            if(response.status == 500){
                bufferingDiv.classList.replace("flex", "hidden")
                userAlert.innerHTML = "Email already exits"
                userAlert.classList.remove("hidden")
                setTimeout(() => {
                    userAlert.classList.add("hidden")
                }, 2500);
            }
            return response.json()
        })
        .then((data) => {
            console.log(data);
            firstname.value = data.data.fullName.split(" ")[0];
            lastname.value = data.data.fullName.split(" ").slice(1).join(" ");
            email.value = data.data.email;
            channelName.innerHTML = fullName;
            currentUserEmail = data.data.email
        });
        promises.push(updateUserDetailsPromise);
    }

    if (coverImageIsChanged) {
        let formData = new FormData(document.getElementById("coverImageForm"));
        const changeCoverImagePromise = fetch(`${DOMAIN}/api/v1/users/change-coverImage`, {
            method: "PATCH",
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("coverImage").src = data.data.coverImage;
        });
        promises.push(changeCoverImagePromise);
    }

    if (avatarIsChanged) {
        let formData = new FormData(document.getElementById("avatarForm"));
        const changeAvatarPromise = fetch(`${DOMAIN}/api/v1/users/change-avatar`, {
            method: "PATCH",
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            avatarIMG.src = data.data.avatar;
        });
        promises.push(changeAvatarPromise);
    }

    Promise.all(promises).then((results) => {
        bufferingDiv.classList.replace("flex", "hidden");
        currentFullname = channelName.innerHTML
        prevAvatar = avatarIMG.src
        prevCoverImage = coverImage.src
    })
    .catch((error) => {
        console.error('One or more operations failed:', error);
    });
})

// ************************************************************ EDIT CHANNEL INFO *****************************************************
let channelObj = {};
document.getElementById("desc").addEventListener("input", ()=>{
    saveChannelInfo.disabled = false
    channelObj.description = desc.value
    let num = 250 - document.getElementById("desc").value.length
    document.getElementById("charsLeft").innerHTML = `${num} Characters left`
    if(num == 0) document.getElementById("charsLeft").classList.replace("text-gray-300", "text-red-400");
    else document.getElementById("charsLeft").classList.replace("text-red-400", "text-gray-300");
})
document.getElementById("usernameInput").addEventListener("input", ()=>{
    saveChannelInfo.disabled = false
    channelObj.username = usernameInput.value
})
cancelChannelInfo.addEventListener("click", ()=>{
    usernameInput.value = currentUsername;
    desc.value = prevDescription
    indianTime.selected = true
})

saveChannelInfo.addEventListener("click", ()=>{
    console.log(channelObj);
    bufferingDiv.classList.replace("hidden", "flex");
    showMessage.innerHTML = "Updating your channel information..."
    fetch(`${DOMAIN}/api/v1/users/update-user-detailes`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( channelObj )
    })
    .then((response)=> response.json())
    .then((data)=>{
        console.log(data);
        bufferingDiv.classList.replace("flex", "hidden");
        usernameInput.value = data.data.username;
        desc.value = data.data.description

        currentUsername = data.data.username;
        prevDescription = data.data.description;
    })
})

// ************************************************************ CHANGE PASSWORD *****************************************************
let forget = false
document.getElementById("forgetBtn").addEventListener("click", ()=>{
    forget = true;
    bufferingDiv.classList.replace("hidden", "flex")
    showMessage.innerHTML = "Sending OTP..."

    fetch(`${DOMAIN}/api/v1/register/send-OTP`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ recipient: currentUserEmail })
    })
    .then((response) => response.json())
    .then((mail) => {
        bufferingDiv.classList.replace("flex", "hidden")
        otpDiv.classList.remove("hidden")
        userAlert.innerHTML = "OTP sent !"
        userAlert.classList.remove("hidden")
        setTimeout(() => {
            userAlert.classList.add("hidden")
        }, 2500);
        currentPassDiv.classList.add("hidden")
        message.innerHTML = `Your new OTP will be valid for <span id="countDown">100</span> seconds`
        countDownFunc()
    })
})

document.getElementById("saveUpdatePass").addEventListener("click", ()=>{
    if(forget){
        if(otp.value == ""){
            userAlert.innerHTML = "OTP is required"
            userAlert.classList.remove("hidden")
            setTimeout(() => {
                userAlert.classList.add("hidden")
            }, 2500);
        }
    }
    else{
        if(document.getElementById("old-pwd").value == ""){
            userAlert.innerHTML = "Current Password is required"
            userAlert.classList.remove("hidden")
            setTimeout(() => {
                userAlert.classList.add("hidden")
            }, 2500);
        }
    }
    // Main Logic
    if(document.getElementById("cnfrm-pwd").value != "" && document.getElementById("new-pwd").value != ""){
        if(document.getElementById("cnfrm-pwd").value == document.getElementById("new-pwd").value){
            bufferingDiv.classList.replace("hidden", "flex")
            showMessage.innerHTML = "Changing Password..."
            let obj = { 
                newPassword: document.getElementById("new-pwd").value
            }
            if(forget){
                obj.email = currentUserEmail,
                obj.otp = otp.value
            }
            else{
                obj.oldPassword = document.getElementById("old-pwd").value
            }
            fetch(`${DOMAIN}/api/v1/users/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((response)=> {
                bufferingDiv.classList.replace("flex", "hidden")
                if(response.status == 406){
                    userAlert.innerHTML = "Old password is wrong"
                    userAlert.classList.remove("hidden")
                    setTimeout(() => {
                        userAlert.classList.add("hidden")
                    }, 2500);
                    return undefined
                }
                else if(response.status == 411){
                    userAlert.innerHTML = "OTP is Invalid or wrong"
                    userAlert.classList.remove("hidden")
                    setTimeout(() => {
                        userAlert.classList.add("hidden")
                    }, 2500);
                    return undefined
                }
                return response.json()
            })
            .then((data)=>{
                if(data){
                    userAlert.innerHTML = "Password changed successfully"
                    userAlert.classList.remove("hidden")
                    setTimeout(() => {
                        userAlert.classList.add("hidden")
                    }, 1500);
                }
            })
        }
        else{
            userAlert.innerHTML = "Confirm password is wrong"
            userAlert.classList.remove("hidden")
            setTimeout(() => {
                userAlert.classList.add("hidden")
            }, 2500);
        }
    }
    else{
        userAlert.innerHTML = "Password Fields are empty"
        userAlert.classList.remove("hidden")
        setTimeout(() => {
            userAlert.classList.add("hidden")
        }, 2500);
    }
})


// ************************************************************ WAVE EFFECT OF CROSS *****************************************************
const crossEditPlay = document.getElementById("crossEditPlay")
waveEffect(crossEditPlay)

// **************************************************** CROSS FUNCTIONALITY OF EDIT PLAYLIST ******************************************
crossEditPlay.addEventListener("click", ()=>{
    editPlayDiv.classList.add("hidden")
    editPlayDiv.classList.remove("flex")
})

// ************************************************************ SEARCH FUNCTIONALITY *****************************************************
searchFunctionality()

//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()

// ************************************************************ NAVIGATE TO OTHER PAGES ******************************************************
let URLchannelID;
getCurrentUser().then((user)=>{
    if(user){
        navigation(user)
        URLchannelID = user._id
        currentUserID = user._id
        currentAvatar = user.avatar
        currentFullname = user.fullName
        currentUsername = user.username
        currentUserEmail = user.email
    }

    if(URLparams.size != 0){
        URLchannelID = URLparams.get("channelID")
        subscribeBtn.classList.replace("hidden", "flex")
        toggleSubscribe(URLchannelID, document.getElementById("subscribeBtn"))
        uploadVideoDiv.classList.replace("flex", "hidden")
        uploadPostDiv.classList.replace("flex", "hidden")
        return URLchannelID;
    }


    editP_Info.classList.replace("hidden", "flex")
    uploadVideoDiv.classList.replace("hidden", "flex")
    uploadPostDiv.classList.replace("hidden", "flex")
    
    return user._id
})
.then((channelID)=>{
    channelDetails(channelID)
    getPlaylists(channelID)
    getVideos(channelID)
    getPosts(channelID)
    getChannels(channelID)
})