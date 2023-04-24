                  //Récupération des projets, depuis le fichier JSON

const response = await fetch("http://localhost:5678/api/works/");
const projectsTab = await response.json();
const buttonFilter = document.querySelectorAll(".btn-filter");

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

                              // Ajout De projets

const modalGalleryBtn = document.querySelector(".modal-gallery-button");
const uploadPhoto = document.querySelector("#upload-photo");
const newInputImage = document.createElement("input");

newInputImage.type = "file";
newInputImage.name = "image";
newInputImage.accept = ".png, .jpg, .jpeg";
newInputImage.style.display = "none";
uploadPhoto.appendChild(newInputImage);

modalGalleryBtn.addEventListener("click", function() {
  newInputImage.click();
});

newInputImage.addEventListener("change", function() {
  const file = newInputImage.fieldEntrance[0];
  addImageToForm(file);
  const modal = document.querySelector(".modal-add-gallery");
  const title = modal.querySelector("#title");
  const category = modal.querySelector("#category");
  const validate = modal.querySelector(".modal-gallery-button-validate");
  [title, category].forEach(function(fieldEntrance) {
    fieldEntrance.addEventListener("input", function() {      
      var fieldsCompleted = false;
      if (title.value.trim() !== "" && category.value !== "null") {
        fieldsCompleted = true;
      }      
      if (fieldsCompleted) {
        validate.style.backgroundColor = "#1D6154";
      } else {
        validate.style.backgroundColor = "";
      }
    });
  });
  validate.addEventListener("click", function(event) {
    event.preventDefault();
    const newForm = new FormData();
    newForm.append("image", file);
    newForm.append("title", title.value);
    newForm.append("category", category.value);
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: newForm,
    })    
      .then(function(response) {
        uploadPhoto.reset();
        return response.json();
      })  
      .then(function(data) {
        const divGallery = document.querySelector(".gallery");
        createGallery([data], divGallery);
      })      
      .catch(function(error) {
        console.error(error);
      });
      resetModal();      
  });  
});

            // Fonction pour ajouter l'image au formulaire

function addImageToForm(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  const addGallery = modal.querySelector(".add-gallery");
  addGallery.appendChild(img);
  const resetForm = document.createElement("i");
  resetForm.classList.add("fa-solid");
  resetForm.classList.add("fa-trash-can");
  resetForm.classList.add("trash-icon-del-photo");
  addGallery.appendChild(resetForm);

  addGallery.querySelector("p").style.display = "none";
  addGallery.querySelector("button").style.display = "block";

  resetForm.addEventListener("click", function() {
    img.remove();
    resetForm.remove();
    addGallery.querySelector("p").style.display = "block";
    addGallery.querySelector("button").style.display = "block";
    resetFormAndImage();
  });
}

function resetFormAndImage() {
  const uploadPhoto = document.querySelector("#upload-photo");
  const title = document.querySelector("#title");
  const category = document.querySelector("#category");
  const addGallery = document.querySelector(".add-gallery");
  uploadPhoto.reset();
  title.value = "";
  category.value = "null";
  addGallery.querySelector("p").style.display = "block";
  addGallery.querySelector("button").style.display = "block";  
}

                 //Réinitialise l'image de la modale

function resetModal() {
  const addGallery = document.querySelector(".add-gallery");
  const img = addGallery.querySelector("img");  
  if (img) {
    img.remove();
  }
  addGallery.querySelector("p").style.display = "block";
  addGallery.querySelector("button").style.display = "block";  
}

                  // Supprime toute la galerie
const deleteGallery = document.querySelector(".del-gallery")
deleteGallery.addEventListener('click', function() {
  const allImageId = projectsTab;
  deleteImage(allImageId);
});

function deleteImage(allImageId) {
  fetch(`http://localhost:5678/api/works/${allImageId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    }
  })
  .then(function(response) {
    if (response.ok) {
      const allGallery = document.querySelector(`[data-id="${allImageId}"]`);
      allGallery.remove();
    } else {
      console.error(`Impossible de supprimer l'image ${allImageId} de l'API.`);
    }
  })
  .catch(function(error) {
    console.error(`Erreur lors de la suppression de l'image ${allImageId} de l'API :`, error);
  });
}