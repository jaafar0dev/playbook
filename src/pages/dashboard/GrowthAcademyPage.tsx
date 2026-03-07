import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Award,
  Briefcase,
  CheckCircle2,
  Lock,
  Star,
  BookOpen,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function GrowthAcademyPage() {
  const { submissions } = useApp();

  // Simple mock calculation for demonstration (assuming 10 core tasks for certification)
  const totalRequiredTasks = 10;
  const completedTasks =
    submissions?.filter((s) => s.status === "approved").length || 0;
  const progressPercentage = Math.min(
    Math.round((completedTasks / totalRequiredTasks) * 100),
    100,
  );

  // They need 80% to qualify for the certificate
  const isEligibleForCert = progressPercentage >= 80;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Growth Academy
            </h1>
          </div>
          <p className="text-gray-500 max-w-2xl text-lg">
            Master the growth process, get certified, and connect with top
            brands looking to hire growth experts.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Track 1: Fast-Track Certification (For active users) */}
        <Card className="border-2 border-blue-100 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Award className="w-32 h-32 text-blue-900" />
          </div>
          <CardHeader>
            <Badge className="w-fit bg-blue-100 text-blue-700 mb-2 border-transparent">
              For Active Users
            </Badge>
            <CardTitle className="text-2xl">Claim Your Certificate</CardTitle>
            <CardDescription className="text-base">
              You are already doing the work! Execute the roadmap tasks for your
              business, hit the required score, and pay to get officially
              certified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Task Completion Score
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {progressPercentage}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-3 mb-2 bg-gray-200 [&>div]:bg-blue-600"
              />
              <p className="text-xs text-gray-500 text-center">
                80% required to unlock certification
              </p>
            </div>

            <div className="space-y-3 mt-auto">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  No extra courses needed—your real-world execution is your
                  exam.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Get a verifiable Growth Expert certificate to boost your
                  career.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Certification Fee</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₦50,000
                </span>
              </div>
              <Button
                className="w-full h-12 text-base"
                disabled={!isEligibleForCert}
                variant={isEligibleForCert ? "default" : "secondary"}
              >
                {isEligibleForCert ? (
                  "Pay & Claim Certificate"
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" /> Complete more tasks to
                    unlock
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Track 2: The Academy Program (For new learners) */}
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm flex flex-col">
          <CardHeader>
            <Badge className="w-fit bg-amber-200 text-amber-800 mb-2 border-transparent hover:bg-amber-200">
              <Star className="w-3 h-3 mr-1 fill-amber-800" /> Premium
              Enrollment
            </Badge>
            <CardTitle className="text-2xl text-amber-900">
              Become a Growth Expert
            </CardTitle>
            <CardDescription className="text-base text-amber-800/80">
              Don't have a business yet? Learn the exact frameworks to scale
              startups, get matched with a brand, and secure a job.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">
                    Full Playbook Access
                  </h4>
                  <p className="text-sm text-amber-700/80">
                    Get unrestricted access to the complete Growth Playbook
                    software and all execution templates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">
                    Guaranteed Brand Matching
                  </h4>
                  <p className="text-sm text-amber-700/80">
                    We match you with a fast-growing brand to intern with,
                    giving you a real sandbox to practice in.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">
                    Included Certification
                  </h4>
                  <p className="text-sm text-amber-700/80">
                    Your enrollment fee covers the cost of your final Growth
                    Expert certification.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-amber-200/50 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-800 font-medium">
                  Full Program + Cert
                </span>
                <span className="text-2xl font-bold text-amber-900">
                  ₦250,000
                </span>
              </div>
              <Button className="w-full h-12 text-base bg-amber-600 hover:bg-amber-700 text-white shadow-md">
                Enroll in the Academy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
