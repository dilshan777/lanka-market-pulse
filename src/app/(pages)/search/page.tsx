// NO "use client" — Server Component that fetches data and passes to client
import { getAllArticles, getCategories } from "@/lib/data";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  const articles = getAllArticles();
  const categories = getCategories();

  return <SearchClient articles={articles} categories={categories} />;
}