import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";
import ArticlesClient from "./ArticlesClient";

async function getArticles() {
  try {
    await connectDB();
    const data = await ArticleModel.find().sort({ publishedAt: -1 }).lean();
    return data.map((a: any) => ({ ...a, id: a._id.toString(), _id: undefined }));
  } catch { return []; }
}

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesClient articles={articles} />;
}
