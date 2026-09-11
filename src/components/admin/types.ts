export interface AdminThread {
  id: string;
  title: string;
  anonName: string;
  isLocked: boolean;
  isDeleted: boolean;
  board: {
    slug: string;
  };
  _count: {
    posts: number;
  };
}

export interface AdminPost {
  id: string;
  body: string;
  anonName: string;
  isDeleted: boolean;
  thread: {
    id: string;
    title: string;
  };
}
