import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  completedModules: string[];
  totalModules: number;
  className?: string;
}

export function ProgressTracker({ completedModules, totalModules, className }: ProgressTrackerProps) {
  const progressPercentage = Math.round((completedModules.length / totalModules) * 100);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">학습 진행 상황</h3>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>진도율: {progressPercentage}%</span>
            <span>{completedModules.length}/{totalModules} 모듈 완료</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
