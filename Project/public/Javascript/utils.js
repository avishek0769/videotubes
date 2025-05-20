import { DOMAIN } from "./constant.js";

const handleError = async (response)=>{
    if(response.status == 452){
        alertDiv.classList.remove("hidden");
        setTimeout(() => {
            alertDiv.classList.add("hidden");
        }, 3000)
        return undefined;
    }
    return response.json()
}

const getWhenVideoUploaded = (date)=>{
    let now = new Date();
    let videoUploaded = new Date(date)
    let diffInSec = Math.floor(now - videoUploaded)/1000;
    if(diffInSec < 60) return `${Math.floor(diffInSec)} seconds ago`;
    else if(diffInSec < 3600) return `${(Math.floor(diffInSec / 60))} minutes ago`;
    else if(diffInSec < (3600*24)) return `${(Math.floor(diffInSec / 3600))} hours ago`;
    else if(diffInSec < (3600*24*365)) return `${(Math.floor(diffInSec / (3600*24)))} days ago`;
}

const formatDuration = (seconds) => {
    seconds = Math.round(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

const formatViews = async (videoID) => {
    const response = await fetch(`${DOMAIN}/api/v1/views/${videoID}`);
    const data = await response.json();
    const views = data.data.views
    if(views < 1000) return `${views}`;
    if(views < 1000000) return `${views}K`;
    if(views < 10000000) return `${views}M`;
}

const formatSubs = (subscribers)=>{
    if(subscribers < 1000) return `${subscribers}`;
    if(subscribers < 1000000) return `${Math.floor(subscribers/1000)}K`;
    if(subscribers < 10000000) return `${Math.floor(subscribers/1000000)}M`;
} 

const getCurrentUser = async ()=>{
    const response = await fetch(`${DOMAIN}/api/v1/users/get-user`)
    
    if(response.status > 399){
        const res = await fetch(`${DOMAIN}/api/v1/users/refresh-accessToken`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        if(res.status > 399) return undefined;
        const tokenData = await res.json()
        console.log(tokenData);
        window.location.reload()
        return tokenData.data.user;
    }

    const data = await response.json()
    return data.data;
}

const navigation = (currentUser)=>{
    homeBtn.addEventListener("click", ()=>{
        window.location.href = "/Home"; 
    })
    likedVidBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = "/Liked_Videos?liked=true";
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    historyBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = "/Liked_Videos?liked=false";
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    myContentBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = "/My_Channel_Video";
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    collectionBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = "";
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    subsBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = `/Subscribers?channelid=${currentUser._id}`;
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    sm_likedVidBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = "/Liked_Videos?liked=true";
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    sm_myContentBtn.addEventListener("click", ()=>{
        if(currentUser){
            window.location.href = "/My_Channel_Video";
        }
        else{
            alertDiv.classList.remove("hidden");
            setTimeout(() => {
                alertDiv.classList.add("hidden");
            }, 3000)   
        }
    })
    signUp.addEventListener("click", ()=>{
        window.location.href = `/Verify_Email`;
    })
    logIn.addEventListener("click", ()=>{
        window.location.href = `/Log_in`;
    })
}

const showVideo = async ()=>{
    const data = await getCurrentUser()
    let videoDivs = document.querySelectorAll(".video")
    videoDivs.forEach((elem)=>{
        elem.addEventListener('click', ()=>{
            window.location.href = `/Video_Details?videoID=${elem.dataset.videoid}`
            if(data){
                fetch(`${DOMAIN}/api/v1/views/${elem.dataset.videoid}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }
        })
    })
}

const searchFunctionality = ()=>{
    searchBox.addEventListener("keydown", (e)=>{
        if(e.key == "Enter"){
            if(searchBox.value){
                riju.classList.remove("bg-[#000000af]", "h-full");
                searchBoxDiv.classList.add("hidden")
                window.location.href = `/After_Search?search=${searchBox.value}`;
            }
        }
    })
    search.addEventListener("click", ()=>{
        riju.classList.add("bg-[#000000af]", "h-screen");
        searchBoxDiv.classList.remove("hidden")
    })
    riju.addEventListener("click", ()=>{
        riju.classList.remove("bg-[#000000af]", "h-screen");
        searchBoxDiv.classList.add("hidden");
    })
}

const toggleSubscribe = async (channelID, element) => {
    element.addEventListener("click", async () => {
        element.disabled = true;
        try {
            const response = await fetch(`${DOMAIN}/api/v1/subscription/toggle/${channelID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await handleError(response);
            if (data) {
                console.log(data);
                if (element.dataset.subscribed == "true") {
                    element.innerHTML = `
                        <span class="inline-block w-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z">
                                                </path>
                                            </svg></span><span class="">Subscribe</span>
                        `
                    element.dataset.subscribed = "false";
                } else {
                    element.innerText = "Subscribed";
                    element.dataset.subscribed = "true";
                }
            }
        } catch (err) {
            console.log(err.message);
        } finally {
            element.disabled = false;
        }
    });
}

const hamburgerMenu = ()=>{
    hamBurger.addEventListener("click", ()=>{
        menuDiv.classList.remove("translate-x-full");
        menuDiv.classList.add("translate-x-0");
    })
    cross.addEventListener("click", ()=>{
        menuDiv.classList.remove("translate-x-0");
        menuDiv.classList.add("translate-x-full");
    })
}

const toogleVideoInPlaylist = async (playlistID, videoID)=>{
    let response = await fetch(`${DOMAIN}/api/v1/playlist/${playlistID}/${videoID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    let data = await response.json()
    return data;
}

const getPlaylistPoster = async (videoID)=>{
    const resposne = await fetch(`${DOMAIN}/api/v1/videos/g-p-d/${videoID}`)
    const data = await resposne.json()
    return data.data.thumbnail;
}

const toggleLike = async (somethingID, content) => {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/likes/toggle-like/${somethingID}?content=${content}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await handleError(response)
        return data;
    }
    catch (error) {
        console.error('Error in fetch operation:', error);
        throw error;
    }
};

const likedOrNot = async (somethingID, content)=>{
    let response = await fetch(`${DOMAIN}/api/v1/likes/liked-or-not/${somethingID}?content=${content}`)
    if(response.status > 399) return undefined;
    return await response.json();
}

const addComments = async (somethingID, content, comment)=>{
    if(!comment) return undefined;
    const response = await fetch(`${DOMAIN}/api/v1/comments/add-get/${somethingID}?content_type=${content}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({content: comment})
    })
    const data = await handleError(response);
    return data;
}

const deleteComment = async (element) =>{
    const divToBeRemoved = element.parentElement;
    document.getElementById("yesDeleteComm").addEventListener("click", async ()=>{
        deleteCommentDiv.classList.replace("flex", "hidden")
        element.parentElement.classList.add("justify-center", "items-center")
        element.parentElement.innerHTML = `<dotlottie-player class="" src="https://lottie.host/27feff6c-53ae-48c7-9539-9a37724286be/8okSjWIQl7.json" background="transparent" speed="1" style="width: 50px; height: 50px;" loop autoplay></dotlottie-player>`
        const response = await fetch(`${DOMAIN}/api/v1/comments/update-delete/${element.dataset.commentid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await handleError(response);
        divToBeRemoved.remove()
    })
    document.getElementById("noDeleteComm").addEventListener("click", ()=>{
        deleteCommentDiv.classList.replace("flex", "hidden")
    })
}

const waveEffect = (element)=>{
    element.addEventListener('click', function(e) {
        const wave = document.createElement('span');
        wave.className = 'wave';
        wave.style.left = `${e.clientX - element.getBoundingClientRect().left - 10}px`;
        wave.style.top = `${e.clientY - element.getBoundingClientRect().top - 10}px`;
        element.appendChild(wave);

        // Force reflow to restart the animation
        wave.offsetHeight;

        wave.style.animation = 'wave 0.6s ease-out';
        setTimeout(() => {
          wave.remove();
        }, 600)
    });
}

const countDownFunc = ()=>{
    let a = setInterval(() => {
        document.getElementById("countDown").innerHTML = Number(document.getElementById("countDown").innerHTML) - 1;
        if (document.getElementById("countDown").innerHTML == 0) {
            clearInterval(a);
            document.getElementById("message").innerHTML = `OTP expired`
        }
    }, 1000);
}

export { 
    formatDuration,
    formatViews,
    formatSubs,
    getWhenVideoUploaded,
    getCurrentUser,
    handleError,
    navigation,
    showVideo,
    searchFunctionality,
    toggleSubscribe,
    hamburgerMenu,
    toogleVideoInPlaylist,
    getPlaylistPoster,
    toggleLike,
    likedOrNot,
    addComments,
    waveEffect,
    deleteComment,
    countDownFunc
}