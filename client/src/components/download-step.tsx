import { Button } from "./ui/button";

const DownloadStep = () => {
  return (
    <div className="w-full space-y-6">
      {/* Success here  */}

      <div className="flex sm:flex-row flex-col justify-center gap-2">
        <Button variant="outline">Télécharger les fichiers originaux</Button>
        <Button>Télécharger le fichier converti (csv)</Button>
      </div>
    </div>
  );
};

export default DownloadStep;
