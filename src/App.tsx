
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { CharacterType } from "./data/characters";
import Index from "./pages/Index";
import Game from "./pages/Game";
import CharacterSelect from "./pages/CharacterSelect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/character-select" 
              element={<CharacterSelect onSelectCharacter={setSelectedCharacter} />} 
            />
            <Route 
              path="/game" 
              element={<Game selectedCharacter={selectedCharacter} />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
