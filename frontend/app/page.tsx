import ChatStudio from "@/components/ChatStudio";

/**
 * The studio is one screen: a conversation with the FastAPI coach.
 * Chat state lives in the client so each reply can appear as it returns.
 */
export default function HomePage() {
  return (
    <main className="studio">
      <ChatStudio />
    </main>
  );
}
