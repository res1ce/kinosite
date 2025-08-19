import { getLocations, createLocation, updateLocation, deleteLocation } from "@/app/api/locations/actions";
import LocationsClient from "./LocationsClient";
import BackButton from "@/components/BackButton";

export default async function AdminLocationsPage() {
  const locations = await getLocations();
  
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-8">Управление локациями</h1>
      <LocationsClient
        locations={locations}
        createLocation={createLocation}
        updateLocation={updateLocation}
        deleteLocation={deleteLocation}
      />
    </div>
  );
}



