import { DOMAIN } from "./constant.js";
import { formatDuration, formatViews, getCurrentUser, getWhenVideoUploaded, hamburgerMenu, navigation, searchFunctionality, showVideo, waveEffect } from "./utils.js";

let urlParams = new URLSearchParams(window.location.search)
let playlistID = urlParams.get("playlistID")
let subscribers = urlParams.get("subscribers")
let videoID;
let videoDiv;

fetch(`${DOMAIN}/api/v1/playlist/p/${playlistID}`).then((response) => {
  return response.json()
})
  .then(async (data) => {
    console.log(data);
    let playlist = data.data;
    console.log(playlist, subscribers);

    playlistDesc.innerHTML = playlist.description
    playlistName.innerHTML = playlist.name
    channelName.innerHTML = playlist.owner.fullName
    ownerAvatar.src = playlist.owner.avatar
    playlistCover.src = playlist.videos[0].thumbnail
    noOfSubs.innerHTML = subscribers + "  Subscribers"
    p_CreatedAt.innerHTML = "100K views " + " . " + getWhenVideoUploaded(playlist.createdAt)
    videosLen.innerHTML = playlist.videos.length + " Videos";

    let promises = playlist.videos.map(async video => {
      let html = `
        <div class="border relative">
            <div class="w-full max-w-3xl gap-x-4 sm:flex">
              <div data-videoid=${video._id} class="video relative mb-2 w-full sm:mb-0 sm:w-5/12">
                <div class="w-full pt-[56%]">
                  <div class="absolute inset-0">
                    <img
                      src=${video.thumbnail}
                      alt="JavaScript Fundamentals: Variables and Data Types"
                      class="h-full w-full object-cover object-center"  />
                  </div>
                  <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">${formatDuration(video.duration)}</span>
                </div>
              </div>
              <div class="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                <div class="h-10 w-10 shrink-0 sm:hidden">
                  <img
                    src=${video.owner.avatar}
                    alt="codemaster"
                    class="h-full w-full rounded-full object-cover object-center" />
                </div>
                <div class="w-full">
                  <h6 class="mb-1 font-semibold sm:max-w-[75%]">${video.title}</h6>
                  <p class="flex text-sm text-gray-200 sm:mt-3">${await formatViews(video._id)} Views · ${getWhenVideoUploaded(video.createdAt)}</p>
                  <div class="flex items-center gap-x-4">
                    <div class="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                      <img
                        src=${video.owner.avatar}
                        alt="codemaster"
                        class="h-full w-full rounded-full object-cover object-center" />
                    </div>
                    <p class="text-sm text-gray-200">${video.owner.fullName}</p>
                  </div>
                </div>
                <div class="absolute right-1 bottom-5 sm:top-3">
                  <span class="threeDotsP_Video w-5 sm:w-auto transition-transform transform duration-150 material-symbols-outlined cursor-pointer ">more_vert</span>
                </div>
              </div>
            </div>
            <div class="dotDiv bg-[#000000] hidden border border-[#ae7aff] absolute right-8 bottom-3 sm:bottom-24 rounded-md ">
              <div class=" flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">edit</span>Report</div>
              <div class="removeVideo flex items-center font-medium cursor-pointer hover:bg-[#ffffff3a] p-[0.35rem] px-[0.7rem]"><span class="mr-2 h-5 text-[#ae7aff] material-symbols-outlined">delete</span>Remove</div>
            </div>
          </div>
        `
      document.getElementById("playlist_Videos").insertAdjacentHTML("beforeend", html)
    });
    await Promise.all(promises)
  })
  .then(showVideo)
  .then(() => {
    // WORKING OF THREE DOTS
    document.addEventListener("click", (event) => {
      document.querySelectorAll(".dotDiv").forEach((dotDiv) => {
        if (!dotDiv.classList.contains("hidden")) {
          dotDiv.classList.add("hidden");
        }
      });
    });
    document.querySelectorAll(".threeDotsP_Video").forEach((dot) => {
      waveEffect(dot)
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".dotDiv").forEach((dotDiv) => {
          if (!dotDiv.classList.contains("hidden")) {
            dotDiv.classList.add("hidden");
          }
        })
        dot.closest(".border").querySelector(".dotDiv").classList.toggle("hidden")
      })
    })
  })
  .then(() => {
    // REMOVE VIDEO FROM PLAYLIST
    document.querySelectorAll(".removeVideo").forEach((elem) => {
      elem.addEventListener("click", (e) => {
        videoDiv = e.currentTarget.parentElement.parentElement
        videoID = e.currentTarget.parentElement.parentElement.querySelector(".video").dataset.videoid;
        removeP_Video.classList.replace("hidden", "flex")
      })
    })
  })

noRemove.addEventListener("click", () => removeP_Video.classList.replace("flex", "hidden"))
yesRemove.addEventListener("click", () => {
  removeP_Video.classList.replace("flex", "hidden")
  videoDiv.innerHTML = `<dotlottie-player class="m-auto" src="https://lottie.host/27feff6c-53ae-48c7-9539-9a37724286be/8okSjWIQl7.json" background="transparent" speed="1" style="width: 60px; height: 60px;" loop autoplay></dotlottie-player>`
  fetch(`${DOMAIN}/api/v1/playlist/${playlistID}/${videoID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response) => response.json())
    .then((data) => videoDiv.remove())
})

// ************************************************************ SEARCH FUNCTIONALITY ************************************************************
searchFunctionality()

//************************************************************ HAMBURGER MENU BAR *******************************************************  
hamburgerMenu()

// ************************************************************ NAVIGATE TO OTHER PAGES ************************************************************
getCurrentUser().then((user) => {
  navigation(user)
})