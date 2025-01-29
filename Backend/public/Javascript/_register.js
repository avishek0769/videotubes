import { DOMAIN } from "./constant.js";
import { countDownFunc } from "./utils.js";

let urlParams = new URLSearchParams(window.location.search);
let email = urlParams.get("email");
emailInput.value = email;


// ************************************************ RESEND OTP *********************************************************
resend_OTP.addEventListener("click", () => {
    fetch(`${DOMAIN}/api/v1/register/send-OTP`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ recipient: email })
    }).then((response) => {
        return response.json();
    }).then((mail) => {
        message.innerHTML = `Your new OTP will be valid for <span id="countDown">100</span> seconds`
        countDownFunc()
    })
})

// ************************************************ VERIFY EMAIL WITH OTP *********************************************************
verifyEmail.addEventListener("click", () => {
    if (otp.value) {
        verifyEmail.disabled = true;
        fetch(`${DOMAIN}/api/v1/verify-OTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ recipient: email, otp: otp.value })
        })
        .then((response) => {
            if (response.status > 399) {
                message.innerHTML = message.innerHTML + " Invalid OTP";
                verifyEmail.disabled = false;
                return undefined;
            }
            return response.json();
        })
        .then((data) => {
            if (data) {
                verifyEmail.classList.add("hidden");
                document.querySelector("form").classList.add("flex")
                document.querySelector("form").classList.remove("hidden")
                message.classList.add("hidden")
            }
        })
    }
    else {
        popUp.classList.add("flex")
        popUp.classList.remove("hidden")
        setTimeout(() => {
            popUp.classList.remove("flex")
            popUp.classList.add("hidden")
        }, 2500);
    }
})

// ************************************************ COUNT DOWN EXPIRATION *********************************************************
countDownFunc()

// ************************************************ CREATING ACCOUNT WITH ALL VALIDATION **********************************************
createAcc.addEventListener("click", async (e) => {
    e.preventDefault();
    document.getElementById("bufferingDiv").classList.replace("hidden", "flex")
    let formData = new FormData(document.getElementById("profileForm"));
    
    if (fullname.value && username.value && password.value && avatar.files.length) {
        fetch(`${DOMAIN}/api/v1/users/register`, {
            method: "POST",
            body: formData
        }).then((res)=> res.json())
        .then((data)=>{
            document.getElementById("bufferingDiv").classList.replace("flex", "hidden")
            window.location.href = "/Log_in";
        })
    }
    else {
        popUp.classList.add("flex")
        popUp.classList.remove("hidden")
        setTimeout(() => {
            popUp.classList.remove("flex")
            popUp.classList.add("hidden")
        }, 2500);
    }
})

// ************************************************ USERNAME CHECK **********************************************
username.addEventListener("input", () => {
    fetch(`${DOMAIN}/api/v1/users/username/${username.value}`).then((response) => {
        if (response.status > 399) {
            if (usernameAlert.classList.contains("text-green-500")) {
                usernameAlert.classList.remove("text-green-500")
                usernameAlert.classList.add("text-red-500")
            }
            else {
                usernameAlert.classList.add("text-red-500")
            }
            usernameAlert.innerHTML = "Username already exists"
            usernameAlert.classList.remove("hidden")
            createAcc.disabled = true
        }
        else {
            if (usernameAlert.classList.contains("text-red-500")) {
                usernameAlert.classList.remove("text-red-500")
                usernameAlert.classList.add("text-green-500")
            }
            else {
                usernameAlert.classList.add("text-green-500")
            }
            usernameAlert.innerHTML = "This username can be used"
            usernameAlert.classList.remove("hidden")
            createAcc.disabled = false
        }
    }).catch((err) => {
        createAcc.disabled = true
    })
})
// ************************************************ LOG IN **********************************************
document.querySelector("a").addEventListener("click", ()=>{
    window.location.href = "/Log_in"
})

export { countDownFunc }