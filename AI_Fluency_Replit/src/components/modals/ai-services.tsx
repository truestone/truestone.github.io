import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, MessageCircle, Brain, Search, Lightbulb } from "lucide-react";
import { aiServices } from "@/lib/course-data";

interface AIServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIServicesModal({ open, onOpenChange }: AIServicesModalProps) {
  const iconMap = {
    "comment": MessageCircle,
    "brain": Brain,
    "search": Search,
  };

  const colorMap = {
    "green": "bg-green-100 text-green-800 border-green-200",
    "purple": "bg-purple-100 text-purple-800 border-purple-200",
    "blue": "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI 서비스 가입 및 활용 가이드</DialogTitle>
          <DialogDescription>
            주요 AI 서비스들의 가입 방법과 효과적인 활용 팁을 제공합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {aiServices.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            const colorClass = colorMap[service.color as keyof typeof colorMap];
            
            return (
              <Card key={index} className="border">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <div className="flex items-center text-muted-foreground mt-1">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <span className="text-sm">{service.url}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">장점</h4>
                      <ul className="space-y-2">
                        {service.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start">
                            <span className="mr-2">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">가입 방법</h4>
                      <ol className="space-y-2">
                        {service.steps.map((step, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {idx + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-semibold mb-3">효과적 활용 팁</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">명령어 작성 팁</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 구체적이고 명확한 지시</li>
                    <li>• 원하는 형식 명시</li>
                    <li>• 예시 제공</li>
                    <li>• 단계별 요청</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">주의사항</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 개인정보 입력 금지</li>
                    <li>• 결과물 검증 필수</li>
                    <li>• 저작권 확인</li>
                    <li>• 윤리적 사용</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
