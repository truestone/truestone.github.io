import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Target, 
  Lightbulb, 
  Star, 
  University, 
  PlayCircle, 
  ServerCog, 
  Brain, 
  Users,
  ArrowRight,
  ArrowLeft,
  Clock
} from "lucide-react";
import { Module } from "@/lib/course-data";

const iconMap = {
  "play-circle": PlayCircle,
  "cogs": ServerCog,
  "brain": Brain,
  "users": Users,
};

interface ModuleContentProps {
  module: Module;
  isCompleted: boolean;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function ModuleContent({ 
  module, 
  isCompleted, 
  onComplete, 
  onNext, 
  onPrevious,
  canGoNext,
  canGoPrevious
}: ModuleContentProps) {
  const IconComponent = iconMap[module.icon as keyof typeof iconMap] || PlayCircle;

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{module.subtitle}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">학습 시간: {module.duration}</span>
              </div>
              {isCompleted && (
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  완료
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Target className="h-5 w-5 mr-2" />
                학습 목표
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {module.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Main Content Sections */}
          {module.content.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{section.content}</p>
                
                {section.highlights && (
                  <Alert>
                    <University className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">한국 대학에서 AI 활용의 중요성</div>
                      <ul className="text-sm space-y-1">
                        {section.highlights.map((highlight, idx) => (
                          <li key={idx}>• {highlight}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {section.subsections && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {section.subsections.map((subsection, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="bg-secondary/10 p-2 rounded-lg flex-shrink-0">
                          <Star className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{subsection.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{subsection.content}</p>
                          {subsection.examples && (
                            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                              {subsection.examples.map((example, exIdx) => (
                                <li key={exIdx}>• {example}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Examples */}
          {module.content.examples && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <University className="h-5 w-5 mr-2" />
                  대학에서의 실제 활용 예시
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {module.content.examples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-accent mb-2">{example.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                      <div className="space-y-2">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm"><span className="font-medium">상황:</span> {example.scenario}</p>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <p className="text-sm"><span className="font-medium">해결:</span> {example.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activities */}
          {module.content.activities && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Target className="h-5 w-5 mr-2" />
                  실습 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                {module.content.activities.map((activity, index) => (
                  <div key={index} className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
                      
                      {activity.content.scenarios && (
                        <div className="space-y-4">
                          {activity.content.scenarios.map((scenario: any, idx: number) => (
                            <div key={idx} className="bg-muted p-4 rounded-lg">
                              <h5 className="font-medium text-sm mb-3">{scenario.title}</h5>
                              <ul className="space-y-2">
                                {scenario.tasks.map((task: string, taskIdx: number) => (
                                  <li key={taskIdx} className="text-sm flex items-start">
                                    <span className="font-medium mr-2">•</span>
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Progress Actions */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-4">학습 진행</h3>
              {!isCompleted ? (
                <Button onClick={onComplete} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  이 모듈 완료하기
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center text-secondary">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">완료되었습니다!</p>
                  </div>
                  <Button 
                    onClick={onComplete} 
                    variant="outline" 
                    className="w-full"
                  >
                    다시 학습하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reflection Questions */}
          {module.content.reflection && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">생각해보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.content.reflection.map((question, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          이전
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canGoNext}
        >
          다음
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
