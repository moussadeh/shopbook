import "server-only";

export async function uploadCapture(file: File, commercantId: number): Promise<string> {
  console.log("[uploadCapture] capture reçue :", {
    commercantId,
    nom: file.name,
    taille: `${(file.size / 1024).toFixed(1)} Ko`,
    type: file.type,
  });

  const fakeUrl = `placeholder://captures/${commercantId}-${Date.now()}-${file.name}`;
  console.log("[uploadCapture] URL factice enregistrée :", fakeUrl);
  return fakeUrl;
}