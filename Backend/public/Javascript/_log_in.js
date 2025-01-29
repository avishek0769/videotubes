import { DOMAIN } from "./constant.js"

// *********************************************************** LOG IN **********************************************************
lgSubmit.addEventListener("click", ()=>{
    if((lgUsername.value || lgEmail.value) && lgPassword.value){
        bufferingDiv.classList.replace("hidden", "flex")
        showMessage.innerHTML = "Logging you in..."
        const json = {
            password: lgPassword.value
        }
        if(lgUsername.value) json.username = lgUsername.value
        if(lgEmail.value) json.email = lgEmail.value
    
        fetch(`${DOMAIN}/api/v1/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        })
        .then((response)=>{
            if(response.status > 399) {
                return undefined;
            }
            return response.json()
        })
        .then((user)=>{
            console.log(user);
            if(user){
                window.location.href = `/Home?userid=${user.data._id}`
            }
            else{
                bufferingDiv.classList.replace("flex", "hidden")
                popUp.innerHTML = "Incorrect user credentials"
                popUp.classList.remove("hidden")
                setTimeout(() => {
                    popUp.classList.add("hidden")
                }, 2500);
            }
        })
        .catch((err)=>{
            console.log(err.message);
        })
    }
    else{
        bufferingDiv.classList.replace("flex", "hidden")
        popUp.innerHTML = "Username or email with password is required"
        popUp.classList.remove("hidden")
        setTimeout(() => {
            popUp.classList.add("hidden")
        }, 2500);
    }
})
