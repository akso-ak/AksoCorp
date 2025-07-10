async function onLoad() {
    let form = document.getElementById("my-form");
    form.addEventListener("submit", handleSubmit)
}
                                    
async function handleSubmit(event) {
    event.preventDefault();

    let form = document.getElementById("my-form")
    let status = document.getElementById("my-form-status");
    let data = new FormData(event.target);

    if (!data.get('g-recaptcha-response')) {
        status.innerHTML = "Please complete the CAPTCHA before submitting."
        return;
    }

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Thanks for your submission!";
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form"
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
    }).finally(() => {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    });
}

onLoad();
