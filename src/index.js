import './sass/main.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayImages from './js/fetch';

const pixabayImages = new PixabayImages();
const lightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionClass: 'caption--bg',
  captionsData: 'alt',
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more__btn'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearchSubmit);
pixabayImages.loadMore.addEventListener('click', onLoadMoreClick);

// console.log(pixabayImages.loadMore);

async function onSearchSubmit(evt) {
  try {
    evt.preventDefault();
    refs.gallery.innerHTML = '';
    console.log(evt.currentTarget.elements.searchQuery.value);
    pixabayImages.value = evt.currentTarget.elements.searchQuery.value;
    pixabayImages.resetPage();
    if (pixabayImages.value === '') {
      pixabayImages.loadMore.classList.add('is-hidden');
      Notify.warning('I can`t find an empty request. Please input something.');
      refs.gallery.innerHTML = '';
      return;
    }

    const fetch = await pixabayImages.fetchImg(pixabayImages.value);
    await renderMarkup(fetch);
    pixabayImages.loadMore.classList.remove('is-hidden');

    const totalHits = fetch.totalHits;
    if (refs.gallery.children.length < 500 && totalHits > 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    if (fetch.hits.length === 0) {
      pixabayImages.loadMore.classList.add('is-hidden');
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const totalPages = Math.ceil(fetch.totalHits / pixabayImages.per_page);
    if (pixabayImages.page > totalPages) {
      pixabayImages.loadMore.classList.add('is-hidden');
      Notify.warning(
        'We are sorry, but you have reached the end of search results.'
      );
    }
    // console.log(totalPages);
    // console.log(fetch.totalHits);
    // console.log(pixabayImages.per_page);
    // console.log(pixabayImages.page);
    evt.target.reset();
  } catch (error) {
    pixabayImages.loadMore.classList.add('is-hidden');
    console.log(error.message);
    Notify.warning("We're sorry, but there is nothing to find.");
  }
}

function onLoadMoreClick() {
  renderGallery();
  pixabayImages.loadMore.classList.remove('is-hidden');
  //   console.log(pixabayImages.summaryHits);
}

async function renderGallery() {
  const fetch = await pixabayImages.fetchImg(pixabayImages.value);
  await renderMarkup(fetch);

  const totalPages = Math.ceil(fetch.totalHits / pixabayImages.per_page);
  if (pixabayImages.page > totalPages) {
    pixabayImages.loadMore.classList.add('is-hidden');
    Notify.warning(
      'We are sorry, but you have reached the end of search results.'
    );
  }
  // console.log(totalPages);
  // console.log(fetch.totalHits);
  // console.log(pixabayImages.per_page);
  // console.log(pixabayImages.page);
}

async function renderMarkup(data) {
  const image = data.hits;
  const markup = image
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
<div class="gallery-item">  
        <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span class="info-item__details">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> <span class="info-item__details">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span class="info-item__details">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span class="info-item__details">${downloads}</span>
    </p>
  </div>
  </div>
  </a>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightBox.refresh();
}
