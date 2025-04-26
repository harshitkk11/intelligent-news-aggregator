import { newsItems } from "./_components/data";
import Layout from "./_components/Layout";

export default function Home() {
  return (
    <main className="w-full border">
      <Layout allNews={newsItems} />
    </main>
  );
}
