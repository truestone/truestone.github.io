import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  ServerCog, 
  Brain, 
  Users, 
  HandHelping, 
  MessageCircle, 
  Wand2, 
  Search, 
  RotateCcw, 
  Shield, 
  Flag,
  Book,
  Bot,
  BookOpen
} from "lucide-react";
import { ProgressTracker } from "./progress-tracker";
import { courseModules } from "@/lib/course-data";

const iconMap = {
  "play-circle": PlayCircle,
  "cogs": ServerCog,
  "brain": Brain,
  "users": Users,
  "hands-helping": HandHelping,
  "comments": MessageCircle,
  "magic": Wand2,
  "search": Search,
  "sync-alt": RotateCcw,
  "shield-alt": Shield,
  "flag-checkered": Flag,
};

interface SidebarProps {
  currentModule: string;
  completedModules: string[];
  onModuleSelect: (moduleId: string) => void;
  onOpenModal: (modalId: string) => void;
  className?: string;
}

export function Sidebar({ 
  currentModule, 
  completedModules, 
  onModuleSelect, 
  onOpenModal,
  className 
}: SidebarProps) {
  return (
    <aside className={`w-64 bg-background border-r min-h-screen ${className}`}>
      <div className="p-6 space-y-6">
        <ProgressTracker 
          completedModules={completedModules}
          totalModules={courseModules.length}
        />

        <nav className="space-y-2">
          {courseModules.map((module, index) => {
            const IconComponent = iconMap[module.icon as keyof typeof iconMap] || PlayCircle;
            const isCompleted = completedModules.includes(module.id);
            const isCurrent = currentModule === module.id;
            
            return (
              <Button
                key={module.id}
                variant={isCurrent ? "default" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  isCurrent ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => onModuleSelect(module.id)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate">
                        {index + 1}. {module.title}
                      </span>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">완료</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-sm">빠른 도구</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => onOpenModal('promptLibrary')}
              >
                <Book className="h-3 w-3 mr-2" />
                명령어 모음집
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => onOpenModal('aiServices')}
              >
                <Bot className="h-3 w-3 mr-2" />
                AI 서비스 가이드
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => onOpenModal('glossary')}
              >
                <BookOpen className="h-3 w-3 mr-2" />
                용어 사전
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
