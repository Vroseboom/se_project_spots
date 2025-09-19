import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import { disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";

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

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "db88840d-3b55-40a5-8428-ed105e2b4610",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    console.log(userData);
    document.querySelector(".profile__name").textContent = userData.name;
    document.querySelector(".profile__description").textContent =
      userData.about;
    document.querySelector(".profile__image").src = userData.avatar;
    console.log(cards);
    cards.forEach(function (item) {
      renderCard(item);
    });
  })
  .catch((err) => {
    console.error(err);
  });

const avatarButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseButton = avatarModal.querySelector(".modal__close");
const avatarForm = document.forms["edit-avatar-form"];
const avatarInput = avatarForm.elements["profile-avatar-input"];
const avatarSubmitButton = avatarForm.querySelector(".modal__submit-button");
const profileAvatar = document.querySelector(".profile__image");

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

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__delete-form");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardContainer = document.querySelector(".cards");
let selectedCard, selectedCardId;

const closeButtons = document.querySelectorAll(".modal__close");
const deleteImageButton = document.querySelector(".card__submit-button");
const cancelButton = deleteForm.querySelector(".modal__cancel-button");

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

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileDescriptionInput.value,
    })
    .then((data) => {
      console.log(data);
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addNewCard({
      name: postCaptionInput.value,
      link: postImageInput.value,
    })
    .then((data) => {
      console.log(data);
      renderCard(data);
      document.forms["new-post-form"].reset();
      disableButton(newPostSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      console.log(data);
      profileAvatar.src = data.avatar;
      document.forms["edit-avatar-form"].reset();
      disableButton(avatarSubmitButton, settings);
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const likeButton = cardElement.querySelector(".card__icon-button");
  if (data.isLiked) {
    likeButton.classList.add("card__icon-button_active");
  } else {
    likeButton.classList.remove("card__icon-button_active");
  }
  likeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );

  cardImage.addEventListener("click", function () {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteBtn = evt.submitter;
  setButtonText(deleteBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(deleteBtn, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
  console.log(selectedCardId);
  const deleteCloseButton = deleteModal.querySelector(".modal__delete-close");
  deleteCloseButton.addEventListener("click", () => closeModal(deleteModal));
  cancelButton.addEventListener("click", () => closeModal(deleteModal));
}

function handleLike(evt, cardId) {
  evt.preventDefault();
  const isLiked = evt.target.classList.contains("card__icon-button_active");
  api
    .handleLike(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__icon-button_active");
    })
    .catch((err) => {
      console.error(err);
    });
}

function renderCard(item, method = "prepend") {
  const card = getCardElement(item);
  cardContainer[method](card);
}

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

avatarButton.addEventListener("click", function () {
  openModal(avatarModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostForm.addEventListener("submit", handleNewPostSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

enableValidation(settings);
