import { Author } from './Author';
import { Subject } from './Subject';

export interface Book {
  id: string;
  title: string;
  publisher: string;
  edition: number;
  publicationYear: number;
  price: number;
  authors: Author[];
  subjects: Subject[];
}
