// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works/');
const projet = await reponse.json();

const boutonFiltrerTous = document.querySelector(".btn-tous");
const boutonFiltrerObjets = document.querySelector(".btn-objets");
const boutonFiltrerAppartements = document.querySelector(".btn-appartements");
const boutonFiltrerHotels = document.querySelector(".btn-hotels");

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


// Function Filtre 

boutonFiltrerTous.addEventListener("click", function () {
    const projetFiltreesTous = projet.filter(function (projet) {
        return projet.categoryId;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjet(projetFiltreesTous);
});

boutonFiltrerObjets.addEventListener("click", function () {
    const projetFiltreesObjets = projet.filter(function (projet) {
        return projet.categoryId <= 1 ;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjet(projetFiltreesObjets);
});

boutonFiltrerAppartements.addEventListener("click", function () {
    const projetFiltreesAppartements = projet.filter(function (projet) {
        return projet.categoryId <= 2 ;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjet(projetFiltreesAppartements);
});

boutonFiltrerHotels.addEventListener("click", function () {
    const projetFiltreesHotels = projet.filter(function (projet) {
        return projet.categoryId <= 3 ;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjet(projetFiltreesHotels);
});