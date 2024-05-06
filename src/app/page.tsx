import { CreateSafebox } from "./CreateSafebox";
import { OpenSafebox } from "./OpenSafebox";

export default function Home() {
  return (
    <main className="p-8 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl	font-bold">SAFEISH</h1>
        <h2 className="text-2xl">store your secrets on a safebox</h2>
      </div>
      <div className="flex flex-row gap-8 items-start">
        <CreateSafebox />
        <OpenSafebox />
      </div>
    </main>
  );
}
