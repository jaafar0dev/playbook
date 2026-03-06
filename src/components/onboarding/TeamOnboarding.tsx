import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, X, ArrowRight, CheckCircle, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/types';

interface TeamMemberInput {
  email: string;
  role: UserRole;
}

interface TeamOnboardingProps {
  onComplete: (teamName: string, members: TeamMemberInput[]) => void;
  onSkip: () => void;
}

const roles: UserRole[] = ['Marketing', 'Sales', 'Finance', 'Operations', 'Product'];

export default function TeamOnboarding({ onComplete, onSkip }: TeamOnboardingProps) {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<TeamMemberInput[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentRole, setCurrentRole] = useState<UserRole>('Marketing');
  const [step, setStep] = useState(1);

  const addMember = () => {
    if (!currentEmail.trim()) return;
    setMembers([...members, { email: currentEmail, role: currentRole }]);
    setCurrentEmail('');
    setCurrentRole('Marketing');
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) return;
    setStep(2);
  };

  const handleComplete = () => {
    onComplete(teamName, members);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Create Your Team</CardTitle>
            <CardDescription>
              Set up a team workspace to collaborate with your co-founders and team members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="e.g., StartupX Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Why create a team?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Assign tasks to specific team members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Track collective progress
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Built-in team chat
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onSkip}>
                Skip for now
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleCreateTeam}
                disabled={!teamName.trim()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Invite Team Members</CardTitle>
          <CardDescription>
            Add your co-founders and team members to {teamName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Member Form */}
          <div className="space-y-3">
            <Label>Add a team member</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="colleague@example.com"
                  className="pl-10"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMember()}
                />
              </div>
              <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as UserRole)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addMember} disabled={!currentEmail.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Members List */}
          {members.length > 0 && (
            <div className="space-y-2">
              <Label>Team Members ({members.length})</Label>
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.email}</p>
                    </div>
                    <Badge variant="secondary">{member.role}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleComplete}>
              {members.length > 0 ? `Send ${members.length} Invitation${members.length > 1 ? 's' : ''}` : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
