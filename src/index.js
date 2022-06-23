import refs from "./js/refs";
import PixabayApiService from "./js/fetch-url";
import renderGalleryItems from "./js/render-gallery-items";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const newsApiService = new PixabayApiService();

refs.form.addEventListener("submit", onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);
refs.btnLoadMore.disabled = true;

async function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!newsApiService.query) {
      Report.failure(
        'Oops! You didn`t enter anything.',
        'Write down your query please.',
        'Okay',
      );
      clearMarkup();
      return;
  }
  clearMarkup();

  const page = await newsApiService.resetPage();
  const promiseRes = await newsApiService.fetchImages();

 if (newsApiService.page === 1 && promiseRes.totalHits > 0) {
   refs.btnLoadMore.disabled = false;
   Notify.success(`Hooray! We found ${promiseRes.totalHits} images.`);
  }
  receivedData(promiseRes, page);
}

async function onLoadMore() {
  const page = await newsApiService.nextPage();
  const promiseRes = await newsApiService.fetchImages();

  receivedData(promiseRes,page)
}

async function receivedData(data) {
  refs.btnLoadMore.disabled = true;
  const { hits} = await newsApiService.fetchImages();

  if (hits.length === 0) {
        Report.failure(
        'Found nothing for you.',
        'Please keep the correct request.',
        'Okay',
      );
    return;
  }
  if (hits.length < 40) {
    refs.btnLoadMore.disabled = true;
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  renderGalleryItems(data);
  refs.btnLoadMore.disabled = false;
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

// Scroll-Handler

let scroll= 0;

window.addEventListener('scroll', scrollHandler);

function scrollHandler() {
  const yOffset = window.pageYOffset;

  if (yOffset > 80 && yOffset > scroll) {
    refs.header.classList.add('out');
    
  } else {
    refs.header.classList.remove('out');
    style.innerHTML = 'header {transform: translateY(0%); position: fixed}'
  }

  scroll = yOffset;
}

let style = document.createElement('STYLE');
style.type = 'text/css';
style.innerHTML =
    '.sl-overlay {background: linear-gradient(160deg, rgb(252 210 43), rgb(1 170 185))} .sl-caption {background: rgba(0, 72, 78, 0.5)} .sl-caption {font-family: Lobster, cursive}';
document.querySelector('body').append(style);
