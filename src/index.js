import refs from "./js/refs";
import LoadMoreBtn from "./js/btn-load-more";
import PixabayApiService from "./js/fetch-url";
import renderGalleryItems from "./js/render-gallery-items";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const newsApiService = new PixabayApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.form.addEventListener("submit", onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchData);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!newsApiService.query) {
    loadMoreBtn.hide();
      Report.failure(
        'Oops! You didn`t enter anything.',
        'Write down your query please.',
        'Okay',
      );
      clearMarkup();
      return;
  }

  loadMoreBtn.show();

  newsApiService.resetPage();

  fetchData();

  clearMarkup();
}

async function fetchData() {
  loadMoreBtn.disable();

  newsApiService.nextPage();

  const { hits, totalHits } = await newsApiService.fetchImages();
  
  if (hits.length === 0) {
    loadMoreBtn.hide();
        Report.failure(
        'Found nothing for you.',
        'Please keep the correct request.',
        'Okay',
      );
    return;
  }
  if (hits.length < 40) {
    loadMoreBtn.hide();
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  if (totalHits > 0) {
   Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  renderGalleryItems({hits});

  loadMoreBtn.enable();
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

// function scrollBy() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
