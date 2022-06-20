import refs from "./js/refs";
import PixabayApiService from "./js/fetch-url";
import renderGalleryItems from "./js/render-gallery-items";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const newsApiService = new PixabayApiService();

let totalPages;
let search;

refs.form.addEventListener("submit", onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

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

  if (promiseRes.length === 0) {
        Report.failure(
        'Found nothing for you.',
        'Please keep the correct request.',
        'Okay',
      );
    return;
  }
  renderGalleryItems(promiseRes, page);
}

async function onLoadMore() {
  const page = await newsApiService.nextPage();
  const promiseRes = await newsApiService.fetchImages();
  renderGalleryItems(promiseRes, page)
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

let style = document.createElement('STYLE');
style.type = 'text/css';
style.innerHTML =
    '.sl-overlay {background: linear-gradient(160deg, black, transparent)} .sl-caption {font-family: Lobster, cursive}';
document.querySelector('body').append(style);