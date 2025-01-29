import { DOMAIN } from "./constant.js"
import { getCurrentUser, hamburgerMenu, navigation } from "./utils.js"

let URLparams = new URLSearchParams(window.location.search)
let channelID = URLparams.get("channelid")

bufferingDiv.classList.replace("hidden", "flex")
fetch(`${DOMAIN}/api/v1/subscription/get-subs/${channelID}?pageNo=1&limit=15`).then((response)=> response.json())
.then((data)=>{
    bufferingDiv.classList.replace("flex", "hidden")
    console.log(data);
    data.data.forEach(sub => {       
        let html = `
            <div class="flex main mb-2 p-2 rounded-xl bg-[#ffffff17] w-full justify-between">
                                <div class="flex items-center gap-x-2">
                                    <div class="h-14 w-14 shrink-0">
                                        <img src=${sub.subscriber.avatar }
                                            alt="React Patterns" class="h-full w-full rounded-full object-cover object-center" />
                                        </div>
                                    <div class="block">
                                        <h6 class="name font-semibold">${sub.subscriber.fullName}</h6>
                                        <p class="text-sm text-gray-300"> </p>
                                    </div>
                                </div>
                            </div>
        `
        mainDiv.insertAdjacentHTML("beforeend", html)
    }); 
})
// GETTING NUMBER OF SUBSCRIBERS
fetch(`${DOMAIN}/api/v1/subscription/get-no-of-subs/${channelID}`).then((response)=> response.json())
.then((data)=>{
    noOfSubs.innerHTML = data.data
})

document.getElementById("searchSubs").addEventListener("input", ()=>{
    document.querySelectorAll(".name").forEach((elem)=>{
        if(elem.innerHTML.startsWith(document.getElementById("searchSubs").value)){
            console.log(elem.innerHTML);
            mainDiv.innerHTML = ""
            mainDiv.insertAdjacentHTML("beforeend", elem.closest(".main"))
        }
    })
})
let pageNo = 2;
loadMore.addEventListener("click", ()=>{
    bufferingDiv.classList.replace("hidden", "flex")
    fetch(`${DOMAIN}/api/v1/subscription/get-subs/${channelID}?pageNo=${pageNo++}&limit=15`).then((response)=> response.json())
    .then((data)=>{
        if(data.data.length < 15 || data.data.length == 0){
            loadMore.classList.add("hidden")
        }
        bufferingDiv.classList.replace("flex", "hidden")
        console.log(data);
        data.data.forEach(sub => {       
            let html = `
                <div class="flex main mb-2 p-2 rounded-xl bg-[#ffffff17] w-full justify-between">
                                    <div class="flex items-center gap-x-2">
                                        <div class="h-14 w-14 shrink-0">
                                            <img src=${sub.subscriber.avatar }
                                                alt="React Patterns" class="h-full w-full rounded-full object-cover object-center" />
                                            </div>
                                        <div class="block">
                                            <h6 class="name font-semibold">${sub.subscriber.fullName}</h6>
                                            <p class="text-sm text-gray-300"> </p>
                                        </div>
                                    </div>
                                </div>
            `
            mainDiv.insertAdjacentHTML("beforeend", html)
        });
    }) 
})
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