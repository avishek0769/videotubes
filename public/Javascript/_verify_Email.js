import { DOMAIN } from "./constant.js";

let email = document.getElementById("email");

submit.addEventListener("click", ()=>{
    submit.disabled = true;
    if(!message.classList.contains("hidden")) message.classList.add("hidden");
    if(email.value){
        console.log("Noice");
        fetch(`${DOMAIN}/api/v1/register/send-OTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({recipient: email.value})
        })
        .then((response)=>{
            if(response.status > 399){
                return undefined;
            }
            return response.json()
        })
        .then((mail)=>{
            if(mail) window.location.href = `/Register?email=${email.value}`
            else {
                submit.disabled = false;
                message.classList.remove("hidden");
                setTimeout(() => {
                    message.classList.add("hidden");
                }, 3000);
            }
        })
        .catch((err)=>{
            console.log(err.message);
            submit.disabled = false;
        })
    }
})