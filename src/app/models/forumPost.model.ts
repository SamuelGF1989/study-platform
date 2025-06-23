export interface ForumPost {
  id?: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  likes: number;
}
