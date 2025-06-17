import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ModuleContent } from "@/components/module-content";
import { PromptLibraryModal } from "@/components/modals/prompt-library";
import { AIServicesModal } from "@/components/modals/ai-services";
import { GlossaryModal } from "@/components/modals/glossary";
import { courseModules } from "@/lib/course-data";
import { useProgress } from "@/hooks/use-progress";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

// For demo purposes, we'll use a mock user ID
const DEMO_USER_ID = 1;

export default function Home() {
  const [currentModule, setCurrentModule] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [aiServicesOpen, setAIServicesOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const { 
    getTotalProgress, 
    getCompletedModules, 
    markModuleComplete, 
    getModuleProgress 
  } = useProgress(DEMO_USER_ID);

  const completedModules = getCompletedModules();
  const totalProgress = getTotalProgress();

  const currentModuleData = courseModules.find(m => m.id === currentModule);
  const currentModuleIndex = courseModules.findIndex(m => m.id === currentModule);
  
  const canGoNext = currentModuleIndex < courseModules.length - 1;
  const canGoPrevious = currentModuleIndex > 0;

  const handleModuleSelect = (moduleId: string) => {
    setCurrentModule(moduleId);
    setSidebarOpen(false);
  };

  const handleComplete = () => {
    markModuleComplete(currentModule);
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentModule(courseModules[currentModuleIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentModule(courseModules[currentModuleIndex - 1].id);
    }
  };

  const handleOpenModal = (modalId: string) => {
    switch (modalId) {
      case 'promptLibrary':
        setPromptLibraryOpen(true);
        break;
      case 'aiServices':
        setAIServicesOpen(true);
        break;
      case 'glossary':
        setGlossaryOpen(true);
        break;
    }
  };

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('ai-course-progress', JSON.stringify({
      currentModule,
      completedModules
    }));
  }, [currentModule, completedModules]);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('ai-course-progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        if (progress.currentModule) {
          setCurrentModule(progress.currentModule);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  if (!currentModuleData) {
    return <div>모듈을 찾을 수 없습니다.</div>;
  }

  const isCompleted = getModuleProgress(currentModule)?.completed || false;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-card shadow-lg sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-bold text-foreground">AI 활용 능력 향상 과정</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                진도율: {totalProgress}%
              </Badge>
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>학습 메뉴</SheetTitle>
                    <SheetDescription>모듈 선택 및 추가 기능 메뉴</SheetDescription>
                  </SheetHeader>
                  <Sidebar
                    currentModule={currentModule}
                    completedModules={completedModules}
                    onModuleSelect={handleModuleSelect}
                    onOpenModal={handleOpenModal}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          currentModule={currentModule}
          completedModules={completedModules}
          onModuleSelect={handleModuleSelect}
          onOpenModal={handleOpenModal}
          className="hidden md:block"
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <ModuleContent
            module={currentModuleData}
            isCompleted={isCompleted}
            onComplete={handleComplete}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        </main>
      </div>

      {/* Modals */}
      <PromptLibraryModal
        open={promptLibraryOpen}
        onOpenChange={setPromptLibraryOpen}
      />
      <AIServicesModal
        open={aiServicesOpen}
        onOpenChange={setAIServicesOpen}
      />
      <GlossaryModal
        open={glossaryOpen}
        onOpenChange={setGlossaryOpen}
      />
    </div>
  );
}
