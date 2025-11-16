import axios from "axios";

export default class PixabayAPI {
  constructor() {
    this.apiKey = "53205336-e55107c6d88ae20d725e8d53c";
    this.page = 1;
    this.per_page = 15;
    this.query = "";
  }

  setQuery(newQuery) {
    this.query = newQuery;
  }

  resetPage() {
    this.page = 1;
  }

  async fetchImages() {
    const params = {
      key: this.apiKey,
      q: this.query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    };

    const response = await axios.get("https://pixabay.com/api/", { params });

    this.page += 1;

    // 🔥 Возвращаем в формате, который ожидает main.js
    return {
      images: response.data.hits,
      totalHits: response.data.totalHits,
    };
  }
}
