                  //Récupération des projets, depuis le fichier JSON

let projectsTab = [];
fetch("http://localhost:5678/api/works/")
.then(function(response) {
  return response.json();
})
.then(function(data) {
  projectsTab = data;
  createGallery(projectsTab);
})
.catch(function(error) {
  console.error(error);
});

                            // Création de la galerie
 
function createGallery(projectsTab){
  for (let i = 0; i < projectsTab.length; i++) {
    const gallery = projectsTab[i];  
    const divGallery = document.querySelector(".gallery");
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = gallery.imageUrl;
    imageElement.alt = gallery.title;  
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = gallery.title;
    divGallery.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(nomElement);    
    figureElement.setAttribute("data-id", gallery.id);
  }
};
createGallery(projectsTab);

                              // Filtres

const buttonFilter = document.querySelectorAll(".btn-filter");
for (let x = 0; x < buttonFilter.length; x++){
	buttonFilter[x].addEventListener("click", allBtnFilters);
}
function allBtnFilters(clickEvent) {
    const classButtonFilter = clickEvent.target;
    const buttonFilterLink = document.querySelectorAll(".btn-filter");
    for (let i = 0; i < buttonFilterLink.length; i++){
        buttonFilterLink[i].classList.remove("active");
        classButtonFilter.classList.add("active");
    }
    const projectFiltreesHotels = projectsTab.filter(function (projectsTab) {
        if (classButtonFilter.classList.value === "btn-filter btn-tous active" || classButtonFilter.classList.value === "btn-filter btn-tous"){         
            return  projectsTab.categoryId;
        } else if(classButtonFilter.classList.value === "btn-filter btn-objets active" || classButtonFilter.classList.value === "btn-filter btn-objets") {
            return  projectsTab.categoryId ===1;
        } else if(classButtonFilter.classList.value === "btn-filter btn-appartements active" || classButtonFilter.classList.value === "btn-filter btn-appartements"){
            return  projectsTab.categoryId ===2;
        } else if (classButtonFilter.classList.value === "btn-filter btn-hotels active"|| classButtonFilter.classList.value === "btn-filter btn-hotels"){
            return  projectsTab.categoryId ===3;
        }
    });
    document.querySelector(".gallery").innerHTML = "";
    createGallery(projectFiltreesHotels);
}

                                // Mode édition

const jsLogin = document.querySelector(".js-login");

function editorMode(){  
  const editorMode = document.querySelectorAll(".editor-mode");
  const bntFilters = document.querySelector(".btn-container");
  const token = localStorage.getItem("token");  
  if (token) {    
    for(let i = 0; i < editorMode.length; i++) {
      editorMode[i].style.display = "flex";
    }
    bntFilters.style.display = "none";
    jsLogin.textContent = "logout";
    jsLogin.classList.add("color-black")   
    jsLogin.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.reload();
    });
  } else {    
    for(let i = 0; i < editorMode.length; i++) {
      editorMode[i].style.display = "none";
    }
  }
};
editorMode();

                                    // Modale

let modal = null;
const openModal = function (event) {
  event.preventDefault();
  modal = document.querySelector(event.target.getAttribute('href'));  
  modal.style.display = null;
  modal.removeAttribute('aria-hidden');  
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
  modal.querySelector('.js-close-modal-gallery').addEventListener('click', closeModal);
  modal.querySelector('.js-stop-modal').addEventListener('click', stopPropagation);
  modal.querySelector('.js-stop-modal-gallery').addEventListener('click', stopPropagation);  
}
const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  window.setTimeout(function() { 
    modal.style.display = "none";
    modal.style.display = null;  
  }, 500)  
  modal.setAttribute('aria-hidden', 'true');  
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
  modal.querySelector('.js-close-modal-gallery').removeEventListener('click', closeModal);
  modal.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation);
  modal.querySelector('.js-stop-modal-gallery').removeEventListener('click', stopPropagation) ; 
  window.setTimeout(function(){
  const homePageModal = document.querySelector('.modal-wrapper');
  const secondPageModal = document.querySelector('.modal-add-gallery');
  if (secondPageModal.style.display !== "none") {
    secondPageModal.style.display = "none";
    homePageModal.style.display = "flex";
  }
  },500)
}
const stopPropagation = function (event){
  event.stopPropagation();
}
document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);
})

                            // Passage entre les pages de la modale

const addPhotoBtn = document.querySelector(".modal-button");
const backArrow  = document.querySelector(".arrow-left");
const modalWrapper = document.querySelector(".modal-wrapper");
const modalAddGallery = document.querySelector(".modal-add-gallery");
addPhotoBtn.addEventListener("click", function() {
  modalWrapper.style.display = "none";
  modalAddGallery.style.display = "block";
});
backArrow.addEventListener("click", function() {
  modalWrapper.style.display = "flex";
  modalAddGallery.style.display = "none";
});

                            // Affichage Galerie Modale

const modalGallery = document.querySelector('#modal-gallery');
const modalElements = document.querySelectorAll('.js-modal');
modalElements.forEach(function(a) {
  a.addEventListener('click', function(event) {
    event.preventDefault();
    modalGallery.innerHTML = "";
    fetch("http://localhost:5678/api/works/")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.forEach(function(image) {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");
        imgContainer.setAttribute("data-id", image.id);
        imgContainer.innerHTML = `
          <img src="${image.imageUrl}" alt="${image.title}">
          <div class="trash-icon-container">
            <i class="fa-solid fa-trash-can trash-icon"></i>
          </div>
          <p>éditer</p>`;
        modalGallery.appendChild(imgContainer);

                  // Suppression d'un projet

        const trashIcon = imgContainer.querySelector('.trash-icon');
        trashIcon.addEventListener('click', function() {
          const imageId = imgContainer.getAttribute('data-id');
          deleteImage(imageId);
          imgContainer.remove();
        });
      });
    });
  });
});

                  // Suppression de toute la galerie

const deleteGalleryBtn = document.querySelector(".del-gallery");
deleteGalleryBtn.addEventListener("click", function() {
  const confirmDeleting = confirm("Êtes-vous sûr de vouloir supprimer la galerie ?");
  if (confirmDeleting) {
    deleteGallery(projectsTab);    
  }
});
async function deleteGallery() {  
  for (const project of projectsTab) {
    const url = `http://localhost:5678/api/works/${project.id}`;
    await fetch(url, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    } 
    });
  }  
  createGallery(projectsTab);
}
                  
              // Mise à jour de la galerie lors de la suppression

function deleteImage(imageId) {
  fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    }
  })
  .then(function(response) {
    if (response.ok) {
      const galleryItem = document.querySelector(`[data-id="${imageId}"]`);
      galleryItem.remove();
    } else {
      console.error(`Impossible de supprimer l'image ${imageId} de l'API.`);
    }
  })
  .catch(function(error) {
    console.error(`Erreur lors de la suppression de l'image ${imageId} de l'API :`, error);
  });
}

                              // Ajout De projets

const modalGalleryButton = document.querySelector(".modal-gallery-button");
const uploadPhotoButton = document.querySelector("#upload-photo");
const addGallery = document.querySelector(".add-gallery");
const titleForm = document.querySelector("#title");
const categoryForm = document.querySelector("#category");
const validateButton = document.querySelector(".modal-gallery-button-validate");
const trashIconResetForm = document.querySelector(".trash-icon-del-photo");
const errorMessage = document.querySelector("#modal-gallery-error-message");
let newInputImage;

function resetFormAndImage() {   
  uploadPhotoButton.reset();  
  titleForm.value = "";
  categoryForm.value = "null";
  var images = addGallery.querySelectorAll("img");
  for (var i = 0; i < images.length; i++) {
    images[i].remove();
  }
  addGallery.querySelector("p").style.display = "block";
  addGallery.querySelector("button").style.display = "block";
  trashIconResetForm.style.display = "none";
  errorMessage.style.display = "none";
  newInputImage = createNewInputImage();  
  validateButton.style.backgroundColor = "";
}

function createNewInputImage() {
  const inputImage = document.createElement("input");
  inputImage.type = "file";
  inputImage.name = "image";
  inputImage.accept = ".png, .jpg, .jpeg";
  inputImage.style.display = "none";
  uploadPhotoButton.appendChild(inputImage);
  inputImage.addEventListener("change", function() {
    const file = inputImage.files[0];
    addImageToForm(file);
  });
  return inputImage;
}

function addImageToForm(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  addGallery.appendChild(img);
  addGallery.querySelector("p").style.display = "none";
  addGallery.querySelector("button").style.display = "none";  
  trashIconResetForm.style.display = "block";
  trashIconResetForm.addEventListener("click", function() {
    img.remove();
    resetFormAndImage();
  });
}

modalGalleryButton.addEventListener("click", function() {
  if (!newInputImage) {
    newInputImage = createNewInputImage();
  }
  newInputImage.click();
});

[titleForm, categoryForm].forEach(function(field) {
  field.addEventListener("input", function() {      
    var fieldsCompleted = false;
    if (titleForm.value.trim() !== "" && categoryForm.value !== "null") {
      fieldsCompleted = true;
    }      
    validateButton.style.backgroundColor = fieldsCompleted ? "#1D6154" : "";
  });
});

validateButton.addEventListener("click", function(event) {
  event.preventDefault();
  const file = newInputImage.files[0];
  if (!file || titleForm.value.trim() === "" || categoryForm.value === "null") {
    errorMessage.style.display = "block";
    return;
  }  
  const newForm = new FormData();
  newForm.append("image", file);
  newForm.append("title", titleForm.value);
  newForm.append("category", categoryForm.value); 

                      // Mise à jour de la galerie lors de l'ajout

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: newForm,
  })
  .then(function(response) {        
    resetFormAndImage();
    return response.json();
  })  
  .then(function(data) {
    projectsTab.push(data);
    createGallery(projectsTab);
  })      
  .catch(function(error) {
  });
});