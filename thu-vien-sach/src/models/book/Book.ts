export default interface Book {
  BookID: number;
  Title: string;
  Price: string;
  file_url: string;
  cover_url: string;
  PageCount: number;
  status: {
    type: string;
    data: number[];
  };
  Description: string;
  PublisherName: string;
  PublishDate: string;
  AuthorName: string;
  isRecommend: number;
  LikesCount: number;
  Categories: string;
}
