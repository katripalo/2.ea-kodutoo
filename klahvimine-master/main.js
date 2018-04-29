window.onload = function () {

    const nameInput = document.getElementById("name");
    const startButton = document.getElementById("start-button");

    startButton.addEventListener("click", function () {
        const nameInputValue = nameInput.value;

        if (nameInputValue !== '') {
            localStorage.setItem("name", nameInput.value);
            document.location.href = "main.html";
        } else {
            nameInput.focus();
            nameInput.style.background = 'rgba(255, 0, 0, 0.5)';
            setTimeout(function () {
                nameInput.style.background = '';
              }, 1000);
        }
    });

}
