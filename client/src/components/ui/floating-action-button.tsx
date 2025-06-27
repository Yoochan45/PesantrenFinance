import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddTransactionModal from "@/components/transactions/add-transaction-modal";

export default function FloatingActionButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-20 lg:bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-purple-500 hover:to-cyan-400 rounded-full shadow-2xl neon-glow animate-pulse-glow z-40 flex items-center justify-center group transition-all duration-300 hover:scale-110"
        onClick={() => setShowModal(true)}
      >
        <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </Button>

      <AddTransactionModal 
        open={showModal} 
        onOpenChange={setShowModal} 
      />
    </>
  );
}
