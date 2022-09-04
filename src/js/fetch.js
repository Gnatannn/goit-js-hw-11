import axios from 'axios';

const URL_KEY = '29689520-f0c7787e64df676ce27bf4c34';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PixabayImages {
  constructor() {
    this.inputValue = '';
    this.page = 1;
    this.per_page = 40;
    this.summaryHits = 0;
    this.loadMore = document.querySelector('.load-more__btn');
  }

  async fetchImg() {
    try {
      this.loadMore.classList.add('is-hidden');
      const response = await axios.get('', {
        params: {
          key: URL_KEY,
          q: this.inputValue,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: this.per_page,
          page: this.page,
        },
      });
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  smoothScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    return;
  }

  incrementPage() {
    this.summaryHits = this.page * this.per_page;
    this.page += 1;
  }

  resetPage() {
    this.summaryHits = 0;
    this.page = 1;
  }

  get value() {
    return this.inputValue;
  }
  set value(newValue) {
    this.inputValue = newValue;
  }
}
