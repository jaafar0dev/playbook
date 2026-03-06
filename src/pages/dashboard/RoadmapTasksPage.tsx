import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApp } from "@/contexts/AppContext";
import {
  CheckCircle2,
  Circle,
  Lock,
  Upload,
  Link as LinkIcon,
  ArrowRight,
  Target,
  Clock,
  AlertCircle,
  ChevronLeft,
  BookOpen,
  FileText,
  PlaySquare,
  ExternalLink,
  Info,
  X,
  Home,
} from "lucide-react";
import type { Task } from "@/types";

type EnrichedTask = Task & {
  phaseId: string;
  phaseTitle: string;
  weekId: string;
  weekTitle: string;
};

export default function RoadmapTasksPage() {
  const { programs, submissions, submitTask, currentUser } = useApp();

  // Navigation and form states
  const [selectedTask, setSelectedTask] = useState<EnrichedTask | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Form inputs
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Helper: Can user access this task?
  const canAccessTask = (task: Task) => {
    return (
      task.assignedRole === currentUser?.role || currentUser?.role === "Founder"
    );
  };

  // Helper: Get submission status
  const getSubmission = (taskId: string) => {
    return submissions?.find((s) => s.taskId === taskId);
  };

  const getResourceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <PlaySquare className="h-5 w-5 text-indigo-500" />;
      case "template":
        return <FileText className="h-5 w-5 text-emerald-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-500" />;
    }
  };

  // Process data to find progress and organize tasks logically
  const {
    progressPercentage,
    currentPhase,
    currentTasks,
    upcomingTasks,
    completedCurrentPhaseTasks,
  } = useMemo(() => {
    if (!programs || programs.length === 0) {
      return {
        progressPercentage: 0,
        currentPhase: null,
        currentTasks: [],
        upcomingTasks: [],
        completedCurrentPhaseTasks: [],
      };
    }

    // 1. Flatten all tasks the user has access to, preserving their hierarchy
    const allUserTasks: EnrichedTask[] = [];
    programs[0].phases?.forEach((phase) => {
      phase.weeks?.forEach((week) => {
        week.tasks?.forEach((task) => {
          if (canAccessTask(task)) {
            allUserTasks.push({
              ...task,
              phaseId: phase.id,
              phaseTitle: phase.title,
              weekId: week.id,
              weekTitle: week.title,
            });
          }
        });
      });
    });

    // 2. Calculate global progress
    const completedCount = allUserTasks.filter(
      (t) => getSubmission(t.id)?.status === "approved",
    ).length;
    const progressPercentage =
      allUserTasks.length === 0
        ? 0
        : Math.round((completedCount / allUserTasks.length) * 100);

    // 3. Find the "Current" point in the roadmap
    const firstIncompleteTask = allUserTasks.find((t) => {
      const sub = getSubmission(t.id);
      return !sub || sub.status === "rejected";
    });

    const activePhaseId = firstIncompleteTask
      ? firstIncompleteTask.phaseId
      : allUserTasks[allUserTasks.length - 1]?.phaseId;
    const activePhase = programs[0].phases?.find((p) => p.id === activePhaseId);

    // 4. Split tasks in the active phase
    const activePhaseTasks = allUserTasks.filter(
      (t) => t.phaseId === activePhaseId,
    );
    const activeWeekId = firstIncompleteTask
      ? firstIncompleteTask.weekId
      : null;

    const completedCurrentPhaseTasks: EnrichedTask[] = [];
    const currentTasks: EnrichedTask[] = [];
    const upcomingTasks: EnrichedTask[] = [];

    activePhaseTasks.forEach((task) => {
      const sub = getSubmission(task.id);
      if (sub?.status === "approved" || sub?.status === "pending") {
        completedCurrentPhaseTasks.push(task);
      } else if (task.weekId === activeWeekId) {
        currentTasks.push(task); // Actionable "Today" tasks
      } else {
        upcomingTasks.push(task); // Locked upcoming tasks
      }
    });

    return {
      progressPercentage,
      currentPhase: activePhase,
      currentTasks,
      upcomingTasks,
      completedCurrentPhaseTasks,
    };
  }, [programs, submissions, currentUser]);

  const handleOpenTask = (
    task: Task & {
      phaseId: string;
      phaseTitle: string;
      weekId: string;
      weekTitle: string;
    },
  ) => {
    setSelectedTask(task);
    setIsSubmittingForm(false);
    setSubmissionNotes("");
    setSubmissionLink("");
    setUploadedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToRoadmap = () => {
    setSelectedTask(null);
    setIsSubmittingForm(false);
  };

  const handleSubmit = () => {
    if (!selectedTask) return;

    submitTask({
      taskId: selectedTask.id,
      userId: currentUser.id,
      userName: currentUser.name,
      teamId: currentUser.teamId,
      linkUrl: submissionLink || undefined,
      notes: submissionNotes,
      // file: uploadedFile -> Add your file upload logic here before/during submitTask
    });

    handleBackToRoadmap();
  };

  const isFormValid = submissionLink.trim().length > 0 || uploadedFile !== null;
  const sessionTotalHours = currentTasks.reduce(
    (acc, t) => acc + (t.estimatedTime || 0),
    0,
  );

  if (!programs || programs.length === 0) return null;

  // ==========================================
  // VIEW: FULL PAGE TASK DETAILS
  // ==========================================
  if (selectedTask) {
    const submission = getSubmission(selectedTask.id);
    const needsRevision = submission?.status === "rejected";
    const isApproved = submission?.status === "approved";
    const isPending = submission?.status === "pending";

    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <button
            onClick={handleBackToRoadmap}
            className="hover:text-blue-600 flex items-center transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Roadmap
          </button>
          <ChevronLeft className="w-4 h-4 mx-1 rotate-180 text-gray-400" />
          <span className="text-gray-400 truncate max-w-[150px]">
            {selectedTask.phaseTitle}
          </span>
          <ChevronLeft className="w-4 h-4 mx-1 rotate-180 text-gray-400" />
          <span className="text-gray-900 truncate max-w-[200px]">
            {selectedTask.title}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="text-blue-600 bg-blue-50 border-blue-100"
              >
                {selectedTask.phaseTitle}
              </Badge>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium text-gray-500">
                {selectedTask.weekTitle}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {selectedTask.title}
            </h1>
          </div>

          <div className="flex-shrink-0">
            {isApproved && (
              <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm border-transparent">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Completed
              </Badge>
            )}
            {isPending && (
              <Badge className="bg-amber-100 text-amber-700 px-4 py-2 text-sm border-transparent">
                <Clock className="w-4 h-4 mr-2" /> Pending Review
              </Badge>
            )}
            {needsRevision && (
              <Badge className="bg-red-100 text-red-700 px-4 py-2 text-sm border-transparent">
                <AlertCircle className="w-4 h-4 mr-2" /> Needs Revision
              </Badge>
            )}
            {!submission && (
              <Badge className="bg-gray-100 text-gray-700 px-4 py-2 text-sm border-transparent">
                <Circle className="w-4 h-4 mr-2" /> Not Started
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Task Brief
              </h2>
              <div className="prose text-gray-600 max-w-none leading-relaxed">
                <p>{selectedTask.description}</p>
              </div>
            </section>

            {/* Admin Feedback (If Rejected) */}
            {needsRevision && (
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 shadow-sm"
              >
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-900 ml-2">
                  <strong className="block mb-1 text-red-800">
                    Feedback from Reviewer:
                  </strong>
                  {submission.adminFeedback}
                </AlertDescription>
              </Alert>
            )}

            {/* Learning Resources */}
            {selectedTask.resources && selectedTask.resources.length > 0 && (
              <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-400" /> Learning
                  Resources & Tools
                </h2>
                <div className="grid gap-3">
                  {selectedTask.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {resource.type}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Submission Form / Action Area */}
            {!isApproved && !isPending && (
              <section
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm"
                id="submission-area"
              >
                {!isSubmittingForm ? (
                  <div className="text-center py-6">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ready to submit?
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Make sure you've reviewed all resources and completed the
                      requirements.
                    </p>
                    <Button
                      className="w-full md:w-auto px-8 h-12 text-base"
                      onClick={() => setIsSubmittingForm(true)}
                    >
                      Submit Task Work
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="border-b pb-4 mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Submit Your Work
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Provide proof of your work. Include a link or upload a
                        file.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-base">File Upload</Label>
                        {!uploadedFile ? (
                          <div className="mt-3 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer relative group">
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) =>
                                setUploadedFile(e.target.files?.[0] || null)
                              }
                            />
                            <Upload className="h-8 w-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-700">
                              Click or drag a file here
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF, DOCX, PNG, JPG (Max 10MB)
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                              <span className="font-medium text-blue-900 truncate">
                                {uploadedFile.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100 flex-shrink-0"
                              onClick={() => setUploadedFile(null)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-gray-400 font-medium">
                            And / Or
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="link" className="text-base">
                          Project or Document Link
                        </Label>
                        <div className="relative mt-3">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="link"
                            placeholder="https://docs.google.com/..."
                            className="pl-12 h-12 text-base"
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes" className="text-base">
                          Notes for Reviewer (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional context you'd like to share?"
                          className="mt-3 resize-none text-base p-4"
                          rows={4}
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                      <Button
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={() => setIsSubmittingForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 h-12 text-base"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                      >
                        Submit for Review
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column: Meta Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-50 border-gray-200 shadow-none">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Time Estimate
                  </p>
                  <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />{" "}
                    {selectedTask.estimatedTime || 0} hours
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Assigned Role
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedTask.assignedRole}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm text-gray-500">
                    <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p>
                      Completing tasks unlocks the next phase of your roadmap.
                      Ensure your submissions are comprehensive.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ROADMAP & TASKS (DEFAULT)
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
      {/* 1. Header & Dynamic Progress */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Roadmap & Tasks
          </h1>
          <p className="text-gray-500 mt-1">
            Focus on what's next. We've mapped out the journey for you.
          </p>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Overall Progress
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {programs[0].title}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-blue-600">
                  {progressPercentage}%
                </span>
              </div>
            </div>
            <Progress
              value={progressPercentage}
              className="h-3 bg-blue-100 [&>div]:bg-blue-600"
            />
          </CardContent>
        </Card>
      </div>

      {/* 2. Current Phase Heading */}
      {currentPhase && (
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
            <Target className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Current Phase: {currentPhase.title}
            </h2>
            <p className="text-gray-500">{currentPhase.description}</p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* 3. Actionable Tasks (Today) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Tasks for This Session
              <Badge className="bg-blue-100 text-blue-700">
                {currentTasks.length} left
              </Badge>
            </h3>
            {sessionTotalHours > 0 && (
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" /> ~{sessionTotalHours}h total
              </span>
            )}
          </div>

          <div className="space-y-3">
            {currentTasks.map((task) => {
              const submission = getSubmission(task.id);
              const needsRevision = submission?.status === "rejected";

              return (
                <Card
                  key={task.id}
                  className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${needsRevision ? "border-red-200 bg-red-50" : "bg-white hover:border-blue-300"}`}
                  onClick={() => handleOpenTask(task)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {needsRevision ? (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-blue-400 hover:text-blue-600 transition-colors" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      {needsRevision && (
                        <Badge variant="destructive">Needs Revision</Badge>
                      )}
                      <Badge variant="secondary">
                        {task.estimatedTime || 0}h
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {currentTasks.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  You're all caught up!
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Wait for your submissions to be reviewed or check upcoming
                  tasks.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Upcoming Tasks (Locked) */}
        {upcomingTasks.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-400 mb-4">
              Upcoming (Locked)
            </h3>
            <div className="space-y-3 opacity-60">
              {upcomingTasks.map((task) => (
                <Card
                  key={task.id}
                  className="bg-gray-50 border-gray-100 shadow-none"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-600">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Complete current tasks to unlock
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 5. Recently Completed (Just for context) */}
        {completedCurrentPhaseTasks.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-500 mb-4">
              Completed & Pending Review
            </h3>
            <div className="space-y-3">
              {completedCurrentPhaseTasks.map((task) => {
                const sub = getSubmission(task.id);
                const isApproved = sub?.status === "approved";

                return (
                  <Card
                    key={task.id}
                    className="bg-white border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => handleOpenTask(task)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {isApproved ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${isApproved ? "text-gray-400 line-through" : "text-gray-700"}`}
                        >
                          {task.title}
                        </h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          isApproved
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }
                      >
                        {isApproved ? "Done" : "Reviewing"}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
