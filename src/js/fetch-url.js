import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28097205-76b692db46bdf0121d0cf888f';
// const SEARH_PARAMS = {
//     key: API_KEY,
//     q: query,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: 40,
//     page,
//     };
export default class PixabayApiService {

  constructor() {
    this.search = '';
    this.page = 1;
  }

  async fetchImages() {
    try {
      const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.query}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`);
      return response.data;
    }
    catch (error) {
      console.error(error);
      }
    }
  
  get query() {
    return this.search;
  }

  set query(newQuery) {
    this.search = newQuery;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}