import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import { disableButton } from "../scripts/validation.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close");
const editProfileForm = document.forms["edit-profile-form"];
const profileNameInput = editProfileForm.elements["profile-name-input"];
const profileDescriptionInput =
  editProfileForm.elements["profile-description-input"];

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const newPostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close");
const newPostForm = document.forms["new-post-form"];
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-button");

const postCaptionInput = newPostForm.elements["card-caption-input"];
const postImageInput = newPostForm.elements["card-image-input"];

const previewModal = document.querySelector("#preview-modal");
const previewCloseButton = previewModal.querySelector(".modal__close");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardContainer = document.querySelector(".cards");

const closeButtons = document.querySelectorAll(".modal__close");

closeButtons.forEach(function (button) {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

const closeOnEscape = function (event) {
  if (event.key === "Escape") {
    closeModal(document.querySelector(".modal_is-opened"));
  }
};

const closeOnOverlay = function (event) {
  if (event.target === event.currentTarget) {
    closeModal(document.querySelector(".modal_is-opened"));
  }
};

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscape);
  modal.addEventListener("click", closeOnOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
  modal.removeEventListener("click", closeOnOverlay);
}

function handleEditProfileSubmit(event) {
  event.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleNewPostSubmit(event) {
  event.preventDefault();
  const inputValues = {
    name: postCaptionInput.value,
    link: postImageInput.value,
  };
  renderCard(inputValues);

  document.forms["new-post-form"].reset();

  disableButton(newPostSubmitButton, settings);

  closeModal(newPostModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const likeButton = cardElement.querySelector(".card__icon-button");
  likeButton.addEventListener("click", function () {
    likeButton.classList.toggle("card__icon-button_active");
  });

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function () {
    cardElement.remove();
  });

  cardImage.addEventListener("click", function () {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}
function renderCard(item, method = "prepend") {
  const card = getCardElement(item);
  cardContainer[method](card);
}
initialCards.forEach(function (item) {
  renderCard(item);
});

editProfileButton.addEventListener("click", function () {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editProfileForm,
    Array.from(editProfileForm.querySelectorAll(".modal__input")),
    settings
  );
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostForm.addEventListener("submit", handleNewPostSubmit);

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

enableValidation(settings);
