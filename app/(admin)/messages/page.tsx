import { getMessagesContact } from "@/lib/data/admin";
import MessagesView from "./messages-view";

export default async function MessagesPage() {
  const messages = await getMessagesContact();
  return <MessagesView messages={messages} />;
}