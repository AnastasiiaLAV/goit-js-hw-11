import refs from "./js/refs";
import PixabayApiService from "./js/fetch-url";
import renderGalleryItems from "./js/render-gallery-items";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';


const newsApiService = new PixabayApiService();

let page;
let totalPages;
let search;

refs.form.addEventListener("submit", onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  console.log(newsApiService.query);
    if (!newsApiService.query) {
      Report.failure(
        'Oops! You didn`t enter anything.',
        'Write down your query please.',
        'Okay',
      );
      clearMarkup()
      return;
    }
  const promiseRes = await newsApiService.fetchImages();
  const page = await newsApiService.resetPage();
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
// const lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
//   overlayOpacity: 0.8,
// });