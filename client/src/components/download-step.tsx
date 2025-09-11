import DataTable from "./data-table";
import { Button } from "./ui/button";

const DownloadStep = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex sm:flex-row flex-col justify-center gap-2">
        <Button variant="outline">Télécharger les fichiers originaux</Button>
        <Button>Télécharger le fichier converti (csv)</Button>
      </div>

      <div className="border bg-card !rounded-lg px-4 py-2">
        <DataTable />
      </div>

      <Button className="w-full">Télécharger toutes les données</Button>
    </div>
  );
};

export default DownloadStep;
