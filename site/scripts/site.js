function handleSubmit(e) {
    e.preventDefault();
    let form = document.getElementById("contact-form");
    let formData = new FormData(form);
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    }).then(
        () => document.getElementById("form-wrapper").innerHTML = "<p>Thank you for your submission!</p<")
        .catch((error) => document.getElementById("form-wrapper").innerHTML = "<p>There was an error submitting your message!</p>");
}

document.getElementById("contact-form").addEventListener("submit", handleSubmit);