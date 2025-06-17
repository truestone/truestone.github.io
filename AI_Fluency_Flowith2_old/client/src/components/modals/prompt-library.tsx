import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, FileText, GraduationCap, Users, Heart, Globe } from "lucide-react";
import { promptLibrary } from "@/lib/course-data";
import { useToast } from "@/hooks/use-toast";

interface PromptLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromptLibraryModal({ open, onOpenChange }: PromptLibraryModalProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "명령어가 클립보드에 복사되었습니다.",
    });
  };

  const categoryIcons = {
    "행정": Users,
    "연구": FileText,
    "교육": GraduationCap,
    "학생지원": Heart,
    "국제화": Globe,
  };

  const categoryColors = {
    "행정": "bg-blue-50 text-blue-700 border-blue-200",
    "연구": "bg-green-50 text-green-700 border-green-200",
    "교육": "bg-purple-50 text-purple-700 border-purple-200",
    "학생지원": "bg-pink-50 text-pink-700 border-pink-200",
    "국제화": "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  const renderPromptCard = (prompt: any, index: number) => (
    <Card key={index} className="border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{prompt.title}</CardTitle>
          <Badge className={categoryColors[prompt.category as keyof typeof categoryColors]}>
            {prompt.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted p-3 rounded text-sm">
          <p className="font-medium mb-1">명령어 예시:</p>
          <p className="text-muted-foreground">{prompt.prompt}</p>
        </div>
        {prompt.example && (
          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-medium mb-1 text-blue-700">활용 예시:</p>
            <p className="text-blue-600 text-xs">{prompt.example}</p>
          </div>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyToClipboard(prompt.prompt)}
          className="w-full"
        >
          <Copy className="h-3 w-3 mr-2" />
          복사하기
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI 명령어 모음집</DialogTitle>
          <DialogDescription>
            한국 대학 환경에 특화된 실용적인 AI 명령어들을 카테고리별로 제공합니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="administration" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="administration" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">행정</span>
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">연구</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">교육</span>
            </TabsTrigger>
            <TabsTrigger value="student_support" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">학생지원</span>
            </TabsTrigger>
            <TabsTrigger value="international" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">국제화</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="administration" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center">
                <Users className="h-5 w-5 mr-2" />
                대학 행정 업무
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {promptLibrary.administration.map(renderPromptCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                연구 활동
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {promptLibrary.research.map(renderPromptCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                교육 업무
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {promptLibrary.education.map(renderPromptCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="student_support" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                학생 지원
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {promptLibrary.student_support.map(renderPromptCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="international" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                국제화 업무
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {promptLibrary.international.map(renderPromptCard)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
