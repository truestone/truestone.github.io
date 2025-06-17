import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface ProgressData {
  moduleId: string;
  completed: boolean;
  timeSpent: number;
  assessmentData?: any;
}

export function useProgress(userId: number | null) {
  const queryClient = useQueryClient();

  const { data: progress = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/progress'],
    enabled: !!userId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { moduleId: string; completed?: boolean; timeSpent?: number; assessmentData?: any }) => {
      return apiRequest('POST', '/api/progress', {
        userId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });

  const markModuleComplete = (moduleId: string, timeSpent: number = 0) => {
    const currentProgress = getModuleProgress(moduleId);
    const newCompletedState = !currentProgress?.completed; // Toggle completion state
    
    updateProgressMutation.mutate({
      moduleId,
      completed: newCompletedState,
      timeSpent: currentProgress?.timeSpent || timeSpent,
    });
  };

  const updateTimeSpent = (moduleId: string, timeSpent: number) => {
    updateProgressMutation.mutate({
      moduleId,
      timeSpent,
    });
  };

  const saveAssessmentData = (moduleId: string, assessmentData: any) => {
    updateProgressMutation.mutate({
      moduleId,
      assessmentData,
    });
  };

  const getModuleProgress = (moduleId: string) => {
    return progress.find((p: any) => p.moduleId === moduleId);
  };

  const getCompletedModules = () => {
    return progress.filter((p: any) => p.completed).map((p: any) => p.moduleId);
  };

  const getTotalProgress = () => {
    const completedCount = progress.filter((p: any) => p.completed).length;
    return Math.round((completedCount / 11) * 100); // 11 total modules
  };

  return {
    progress,
    isLoading,
    markModuleComplete,
    updateTimeSpent,
    saveAssessmentData,
    getModuleProgress,
    getCompletedModules,
    getTotalProgress,
    isUpdating: updateProgressMutation.isPending,
  };
}
