export type Theme = 'light' | 'dark';

export interface Subject {
  id: string;
  name: string;
  count: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id:string;
  subjectId: string;
  content: string;
  image?: string | null;
  createdAt: string;
}

export interface CustomWord {
  id: string;
  eng: string;
  kor: string;
}

export interface VocabularyWord {
  eng: string;
  kor: string;
}
