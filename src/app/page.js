import JsonParser from "../components/JsonParser/JsonParser";
import styles from "./globals.scss";

export default function Home() {
  return (
    <main className="container">
      <h1>"Json Formatter & Viewer"</h1>
      <JsonParser />
    </main>
  );
}
