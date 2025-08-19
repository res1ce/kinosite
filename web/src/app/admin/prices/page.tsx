import { getPriceItems, createPriceItem, updatePriceItem, deletePriceItem } from "@/app/api/prices/actions";
import PricesClient from "./PricesClient";
import BackButton from "@/components/BackButton";

export default async function AdminPricesPage() {
  const priceItems = await getPriceItems();
  
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-8">Управление услугами</h1>
      <PricesClient
        priceItems={priceItems}
        createPriceItem={createPriceItem}
        updatePriceItem={updatePriceItem}
        deletePriceItem={deletePriceItem}
      />
    </div>
  );
}
