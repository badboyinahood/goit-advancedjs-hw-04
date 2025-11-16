import PixabayAPI from "./js/pixabay-api.js";
import {
  createGalleryMarkup,
  renderGallery,
  clearGallery,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// -------------------------------------------------------------------

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.getElementById("load-more");
const loader = document.getElementById("loader");

const pixabayAPI = new PixabayAPI();
let lightbox = null;

// event listeners
form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

// -------------------------------------------------------------------
// LOADER
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

// -------------------------------------------------------------------
// SEARCH HANDLER
async function onSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search query!",
      position: "topRight",
    });
    return;
  }

  // установить поисковый запрос
  pixabayAPI.setQuery(query);

  // сбросить страницу
  pixabayAPI.resetPage();

  // очистить галерею
  clearGallery(gallery);

  // скрыть кнопку Load More перед новым поиском
  loadMoreBtn.classList.add("hidden");
  loadMoreBtn.disabled = false;

  showLoader();

  try {
    const { images, totalHits } = await pixabayAPI.fetchImages();

    if (images.length === 0) {
      iziToast.error({
        title: "No results",
        message: "Sorry, there are no images matching your search query.",
        position: "topRight",
      });
      return;
    }

    renderGallery(gallery, createGalleryMarkup(images));

    initLightbox();

    // показать Load More, если есть ещё страницы
    if (totalHits > images.length) {
      loadMoreBtn.classList.remove("hidden");
    }

  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  } finally {
    hideLoader();
    form.reset();
  }
}

// -------------------------------------------------------------------
// LOAD MORE HANDLER
async function onLoadMore() {
  showLoader();
  loadMoreBtn.classList.add("hidden");

  try {
    const { images, totalHits } = await pixabayAPI.fetchImages();

    const markup = createGalleryMarkup(images);
    renderGallery(gallery, markup);

    lightbox.refresh();

    // smooth scroll
    smoothScroll();

    // проверяем конец коллекции
    const totalLoaded = document.querySelectorAll(".gallery-item").length;

    if (totalLoaded >= totalHits) {
      iziToast.info({
        title: "End",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });

      loadMoreBtn.classList.add("hidden");
      return;
    }

    // иначе показываем кнопку
    loadMoreBtn.classList.remove("hidden");

  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong while loading more images.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
}

// -------------------------------------------------------------------
// LIGHTBOX
function initLightbox() {
  if (lightbox) lightbox.destroy();

  lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
  });

  lightbox.refresh();
}

// -------------------------------------------------------------------
// SMOOTH SCROLL
function smoothScroll() {
  const firstCard = document.querySelector(".gallery-item");
  if (!firstCard) return;

  const cardHeight = firstCard.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
