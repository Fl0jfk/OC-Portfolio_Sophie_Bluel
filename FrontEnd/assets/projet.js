// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works/');
const projet = await reponse.json();
const buttonFilter = document.querySelectorAll(".btn-filter");

function genererProjet(projet){
    for (let i = 0; i < projet.length; i++) {
        const figure = projet[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionProjet = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = figure.title;   
        // On rattache la balise article a la section Projet
        sectionProjet.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(figcaptionElement);
     }
}

genererProjet(projet);

for (let x = 0; x < buttonFilter.length; x++){
	buttonFilter[x].addEventListener("click", boutonFiltrerTous);
}

function boutonFiltrerTous(clickEvent) {
    const classButtonFilter = clickEvent.target;
    const buttonFilterLink = document.querySelectorAll(".btn-filter");
    for (let i = 0; i < buttonFilterLink.length; i++){
        buttonFilterLink[i].classList.remove("active");
        classButtonFilter.classList.add("active");
    }
    const projetFiltreesHotels = projet.filter(function (projet) {
        if (classButtonFilter.classList.value === "btn-filter btn-tous active" || classButtonFilter.classList.value === "btn-filter btn-tous"){         
            return  projet.categoryId;
        } else if(classButtonFilter.classList.value === "btn-filter btn-objets active" || classButtonFilter.classList.value === "btn-filter btn-objets") {
            return  projet.categoryId ===1;
        } else if(classButtonFilter.classList.value === "btn-filter btn-appartements active" || classButtonFilter.classList.value === "btn-filter btn-appartements"){
            return  projet.categoryId ===2;
        } else if (classButtonFilter.classList.value === "btn-filter btn-hotels active"|| classButtonFilter.classList.value === "btn-filter btn-hotels"){
            return  projet.categoryId ===3;
        }
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjet(projetFiltreesHotels);
}