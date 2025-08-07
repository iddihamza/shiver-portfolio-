import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/security/ErrorBoundary";
import { AutoEditableWrapper } from "@/components/AutoEditableWrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CharacterProfileDynamic from "./pages/CharacterProfileDynamic";
import Characters from "./pages/Characters";
import ChapterPage from "./pages/ChapterPage";
import Chapters from "./pages/Chapters";
import Cases from "./pages/Cases";
import Locations from "./pages/Locations";
import LocationProfile from "./pages/LocationProfile";
import Timeline from "./pages/Timeline";
import Multimedia from "./pages/Multimedia";
import Admin from "./pages/Admin";
import Portfolio from "./pages/Portfolio";
import Auth from "./pages/Auth";
import Dashboard from "./pages/portfolio/Dashboard";
import Stories from "./pages/portfolio/Stories";
import AIAssistant from "./pages/portfolio/AIAssistant";
import BrainstormVault from "./pages/portfolio/BrainstormVault";
import VisualReferences from "./pages/portfolio/VisualReferences";
import NewCharacter from "./pages/portfolio/NewCharacter";
import EditCharacter from "./pages/portfolio/EditCharacter";
import NewChapter from "./pages/portfolio/NewChapter";
import EditChapter from "./pages/portfolio/EditChapter";
import NewLocation from "./pages/portfolio/NewLocation";
import NewStory from "./pages/portfolio/NewStory";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AutoEditableWrapper>
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/characters" element={<Characters />} />
                  <Route path="/chapters" element={<Chapters />} />
                  <Route path="/character/:characterId" element={<CharacterProfileDynamic />} />
                  <Route path="/story/:chapterId" element={<ChapterPage />} />
                  <Route path="/cases" element={<Cases />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/location/:locationId" element={<LocationProfile />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/multimedia" element={<Multimedia />} />
                  <Route path="/auth" element={<Auth />} />

                {/* Portfolio Routes */}
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/dashboard" element={<Dashboard />} />
                <Route path="/portfolio/stories" element={<Stories />} />
                <Route path="/portfolio/ai-assistant" element={<AIAssistant />} />
                <Route path="/portfolio/brainstorm" element={<BrainstormVault />} />
                <Route path="/portfolio/visual-references" element={<VisualReferences />} />
                <Route path="/portfolio/new-story" element={<NewStory />} />
                <Route path="/portfolio/stories/new" element={<NewStory />} />
                <Route path="/portfolio/new-character" element={<NewCharacter />} />
                <Route path="/portfolio/characters/new" element={<NewCharacter />} />
                <Route path="/portfolio/character/:id/edit" element={<EditCharacter />} />
                <Route path="/portfolio/new-chapter" element={<NewChapter />} />
                <Route path="/portfolio/chapters/new" element={<NewChapter />} />
                <Route path="/portfolio/chapter/:id/edit" element={<EditChapter />} />
                <Route path="/portfolio/new-location" element={<NewLocation />} />
                <Route path="/portfolio/locations/new" element={<NewLocation />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AutoEditableWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
