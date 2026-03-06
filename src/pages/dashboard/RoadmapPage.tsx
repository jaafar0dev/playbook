import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Play,
  Lock,
  BookOpen,
  Target
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Task } from '@/types';

export default function RoadmapPage() {
  const { programs, submissions, currentUser } = useApp();
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['phase1']);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const getTaskStatus = (taskId: string) => {
    const submission = submissions.find(s => s.taskId === taskId);
    if (!submission) return 'not-started';
    return submission.status;
  };

  const canAccessTask = (task: Task) => {
    return task.assignedRole === currentUser.role || currentUser.role === 'Founder';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending Review</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Roadmap</h1>
        <p className="text-gray-500">Follow the structured path to build and scale your business</p>
      </div>

      {/* Program Overview */}
      {programs.map((program) => (
        <Card key={program.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{program.title}</h2>
                  <p className="text-gray-500 mt-1 max-w-xl">{program.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary">{program.phases.length} Phases</Badge>
                    <Badge variant="secondary">
                      {program.phases.reduce((acc, p) => acc + p.weeks.length, 0)} Weeks
                    </Badge>
                    <Badge variant="secondary">
                      {program.phases.reduce((acc, p) => acc + p.weeks.reduce((wacc, w) => wacc + w.tasks.length, 0), 0)} Tasks
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">35%</div>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
            <Progress value={35} className="h-2 mt-6" />
          </CardContent>
        </Card>
      ))}

      {/* Phases */}
      <div className="space-y-4">
        {programs[0]?.phases.map((phase) => (
          <Card key={phase.id} className="overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => togglePhase(phase.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                    <p className="text-sm text-gray-500">{phase.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">Weeks {phase.weekStart}-{phase.weekEnd}</Badge>
                  {expandedPhases.includes(phase.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 rotate-180" />
                  )}
                </div>
              </div>
            </div>

            {expandedPhases.includes(phase.id) && (
              <div className="border-t">
                <Tabs defaultValue={phase.weeks[0]?.id} className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-gray-50 px-6 py-2">
                    {phase.weeks.map((week) => (
                      <TabsTrigger 
                        key={week.id} 
                        value={week.id}
                        className="data-[state=active]:bg-white"
                      >
                        Week {week.number}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {phase.weeks.map((week) => (
                    <TabsContent key={week.id} value={week.id} className="p-6">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900">{week.title}</h4>
                        <p className="text-sm text-gray-500">{week.tasks.length} tasks</p>
                      </div>
                      
                      <div className="space-y-3">
                        {week.tasks.map((task) => {
                          const status = getTaskStatus(task.id);
                          const canAccess = canAccessTask(task);
                          
                          return (
                            <div 
                              key={task.id}
                              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                                canAccess 
                                  ? 'hover:border-blue-300 cursor-pointer bg-white' 
                                  : 'bg-gray-50 opacity-70'
                              }`}
                              onClick={() => canAccess && setSelectedTask(task)}
                            >
                              <div className="flex-shrink-0">
                                {getStatusIcon(status)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-gray-900 truncate">{task.title}</h5>
                                  {!canAccess && <Lock className="h-4 w-4 text-gray-400" />}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{task.description}</p>
                              </div>
                              
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <Badge variant="outline">{task.assignedRole}</Badge>
                                <Badge variant="secondary">{task.estimatedTime}h</Badge>
                                {getStatusBadge(status)}
                                {canAccess && status === 'not-started' && (
                                  <Button size="sm">
                                    <Play className="h-4 w-4 mr-1" />
                                    Start
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2">{selectedTask.phase}</Badge>
                  <CardTitle>{selectedTask.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Why This Matters</h4>
                <p className="text-gray-600">{selectedTask.whyItMatters}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  {selectedTask.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
                <div className="space-y-2">
                  {selectedTask.resources.map((resource, i) => (
                    <a 
                      key={i} 
                      href={resource.url}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 hover:underline">{resource.title}</span>
                      <Badge variant="outline" className="ml-auto">{resource.type}</Badge>
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Estimated: {selectedTask.estimatedTime} hours</span>
                  <span>Assigned to: {selectedTask.assignedRole}</span>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedTask(null);
                  }}
                >
                  Start Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
