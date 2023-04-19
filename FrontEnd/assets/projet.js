// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works/');
const projet = await reponse.json();
const buttonFilter = document.querySelectorAll(".btn-filter");
const adminBar = document.querySelector(".adminBar");
const btnModify = document.querySelector(".btnModify");
const btnModify2 = document.querySelector(".btnModify2");
const btnModify3 = document.querySelector(".btnModify3");
const token = localStorage.getItem("token");

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

function adminBarActivate (adminBar, token, btnModify, btnModify2, btnModify3){
  if (token) {
      adminBar.style.display = null;
      btnModify.style.display = null;
      btnModify2.style.display = null;
      btnModify3.style.display = null;
  } else {
    adminBar.style.display = "none";
    btnModify.style.display = "none";
    btnModify2.style.display = "none";
    btnModify3.style.display = "none";
  }
}

adminBarActivate(adminBar, token, btnModify, btnModify2, btnModify3);

let modal = null;

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".btnCloseModal").addEventListener("click", closeModal);
    modal.querySelector(".modalStop").addEventListener("click", stopPropagation);
}

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".btnCloseModal").removeEventListener("click", closeModal);
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation);
    const hideModal = function(){
        modal.style.display = "none";
        modal.removeEventListener("animationend", hideModal)
        modal = null;
    }
    modal.addEventListener("animationend", hideModal)
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll(".btnModifyOpenModal").forEach(a => {
    a.addEventListener("click", openModal);
})

window.addEventListener("keydown", function (e) {
    if(e.key === "Escape" || e.key === "Esc"){
        closeModal(e);
    }
})

function genererProjetModal(projet){
    for (let i = 0; i < projet.length; i++) {
        const figure = projet[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionProjet = document.querySelector(".galleryModal");
        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("figure");
        // Création des balises 
        const deleteElement = document.createElement("i");
        deleteElement.innerText = "";   
        deleteElement.classList.add("fa-solid");
        deleteElement.classList.add("fa-trash-can");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.classList.add("imgModal");
        imageElement.alt = figure.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = "éditer";   
        // On rattache la balise article a la section Projet
        sectionProjet.appendChild(projetElement);
        projetElement.appendChild(deleteElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(figcaptionElement);
     }
}

genererProjetModal(projet);