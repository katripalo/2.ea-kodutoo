window.onload = function () {

    let resultsString = localStorage.getItem("results");
    let resultsArray = JSON.parse(resultsString);
    const tableBody = document.getElementsByTagName('tbody')[0];

    resultsArray.forEach(function (p) {
        //console.log(p.name, p.score);
        let tableRow = '<tr><td>' + p.name + '</td><td>' + p.score + '</td></tr>';
        tableBody.innerHTML += tableRow;
    });

}
