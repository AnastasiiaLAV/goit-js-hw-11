import refs from "./js/refs";
import PixabayApiService from "./js/fetch-url";
import renderGalleryItems from "./js/render-gallery-items";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const newsApiService = new PixabayApiService();

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

  receivedData(promiseRes,page)
}

async function onLoadMore() {
  const page = await newsApiService.nextPage();
  const promiseRes = await newsApiService.fetchImages();

  receivedData(promiseRes,page)
}

async function receivedData(data) {

  const { hits, totalHits } = await newsApiService.fetchImages();
  
  if (newsApiService.page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (hits.length === 0) {
        Report.failure(
        'Found nothing for you.',
        'Please keep the correct request.',
        'Okay',
      );
    return;
  }
  if (hits.length < 40) {
    refs.btnLoadMore.style.display = 'none';
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  return renderGalleryItems(data);
  
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

let style = document.createElement('STYLE');
style.type = 'text/css';
style.innerHTML =
    '.sl-overlay {background: linear-gradient(160deg, black, transparent)} .sl-caption {font-family: Lobster, cursive}';
document.querySelector('body').append(style);