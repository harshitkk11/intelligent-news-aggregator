import { newsItems } from "./_components/data";
import Layout from "./_components/Layout";

export default function Home() {
  const formattedNewsItems = newsItems.map((item) => ({
    ...item,
    publishedDate: new Date(item.published_at),
  }));

  return (
    <main className="w-full border">
      <Layout allNews={formattedNewsItems} />
    </main>
  );
}
