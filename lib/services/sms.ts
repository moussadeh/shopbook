import "server-only";

export async function envoyerSMS(telephone: string, message: string): Promise<void> {
  // affichage du code dans la console pour simuler l'envoi d'un SMS
  console.log("\n========== SMS SIMULÉ ==========");
  console.log("À      :", telephone);
  console.log("Message:", message);
  console.log("================================\n");

  // TODO: implémenter l'envoi réel d'un SMS via Twilio ou un autre service
  // await twilioClient.messages.create({ to: telephone, from: "...", body: message });
}