var names = [];
var nameInput = document.getElementById("name");
var messageBox = document.getElementById("display");

function insert() {
    names.push(nameInput.value);
    clearAndShow();
}

function clearAndShow() {
    nameInput.value = "";
    messageBox.innerHTML = "";
    messageBox.innerHTML += "Names: " + names.join(",") + "<br/>";
}
