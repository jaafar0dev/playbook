import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  Upload, 
  Link as LinkIcon,
  FileText,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TasksPage() {
  const { 
    programs, 
    submissions, 
    submitTask, 
    currentUser
  } = useApp();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Get all tasks for the current user
  const allTasks = programs.flatMap(p => 
    p.phases.flatMap(ph => 
      ph.weeks.flatMap(w => w.tasks)
    )
  );

  const userTasks = allTasks.filter(t => 
    t.assignedRole === currentUser.role || currentUser.role === 'Founder'
  );

  const getTaskStatus = (taskId: string) => {
    return submissions.find(s => s.taskId === taskId);
  };

  const filteredTasks = userTasks.filter(task => {
    const submission = getTaskStatus(task.id);
    switch (activeTab) {
      case 'pending':
        return submission?.status === 'pending';
      case 'completed':
        return submission?.status === 'approved';
      case 'not-started':
        return !submission;
      default:
        return true;
    }
  });

  const handleSubmit = () => {
    if (!selectedTask) return;
    
    submitTask({
      taskId: selectedTask.id,
      userId: currentUser.id,
      userName: currentUser.name,
      teamId: currentUser.teamId,
      linkUrl: submissionLink || undefined,
      notes: submissionNotes,
    });
    
    setIsSubmitModalOpen(false);
    setSelectedTask(null);
    setSubmissionNotes('');
    setSubmissionLink('');
    setUploadedFile(null);
  };

  const getStatusBadge = (taskId: string) => {
    const submission = getTaskStatus(taskId);
    if (!submission) return <Badge variant="secondary">Not Started</Badge>;
    
    switch (submission.status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Needs Revision</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getStatusIcon = (taskId: string) => {
    const submission = getTaskStatus(taskId);
    if (!submission) return <Circle className="h-5 w-5 text-gray-300" />;
    
    switch (submission.status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500">Manage and complete your assigned tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {userTasks.filter(t => !getTaskStatus(t.id)).length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            {userTasks.filter(t => getTaskStatus(t.id)?.status === 'approved').length} Completed
          </Badge>
        </div>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="not-started">Not Started</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="text-gray-500">Switch tabs to see other tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const submission = getTaskStatus(task.id);
                
                return (
                  <div 
                    key={task.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:border-blue-300 transition-colors bg-white"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(task.id)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {getStatusBadge(task.id)}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{task.phase}</span>
                        <span>•</span>
                        <span>Week {task.week}</span>
                        <span>•</span>
                        <span>{task.estimatedTime} hours</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!submission && (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsSubmitModalOpen(true);
                          }}
                        >
                          Submit Work
                        </Button>
                      )}
                      {submission?.status === 'rejected' && (
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsSubmitModalOpen(true);
                          }}
                        >
                          Resubmit
                        </Button>
                      )}
                      {submission && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedTask(task)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Task: {selectedTask?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Upload File (PDF, Images, Documents)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="link">Add Link</Label>
              <div className="relative mt-2">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="link"
                  placeholder="https://..."
                  className="pl-10"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional context about your submission..."
                className="mt-2"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmit}
                disabled={!uploadedFile && !submissionLink}
              >
                Submit for Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Submission Modal */}
      {selectedTask && !isSubmitModalOpen && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
            </DialogHeader>
            
            {(() => {
              const submission = getTaskStatus(selectedTask.id);
              if (!submission) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    {getStatusBadge(selectedTask.id)}
                  </div>
                  
                  {submission.adminFeedback && (
                    <Alert variant={submission.status === 'rejected' ? 'destructive' : 'default'}>
                      <AlertDescription>
                        <strong>Admin Feedback:</strong> {submission.adminFeedback}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {submission.fileUrl && (
                    <div>
                      <Label>Submitted File</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">submission.pdf</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {submission.linkUrl && (
                    <div>
                      <Label>Submitted Link</Label>
                      <a 
                        href={submission.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-blue-600 hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span className="text-sm truncate">{submission.linkUrl}</span>
                      </a>
                    </div>
                  )}
                  
                  {submission.notes && (
                    <div>
                      <Label>Your Notes</Label>
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {submission.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
