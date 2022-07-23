import axios from "axios";

interface SearchParams {
  title: string;
  author?: string;
  isbn?: string;
  hits?: number;
  page?: number;
  sort?: "standard" | "sales" | "+releaseDate" | "-releaseDate";
}

export interface BookItem {
  title: string;
  titleKana: string;
  seriesName: string;
  author: string;
  authorKana: string;
  publisherName: string;
  size: number;
  isbn: string;
  salesDate: string;
  itemUrl: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
}

export class RakutenBooksAPI {
  private BASE_URL =
    "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";

  constructor(private APP_ID: string) {}

  async searchBook(params: SearchParams): Promise<BookItem[]> {
    try {
      const { data } = await axios.request({
        baseURL: this.BASE_URL,
        params: {
          applicationId: this.APP_ID,
          size: 9,
          ...params,
        },
      });

      if (typeof data.hits === "number" && data.hits >= 1) {
        const { Items } = data;
        return Items.map((d: any) => d.Item) as BookItem[];
      }

      return [];
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
