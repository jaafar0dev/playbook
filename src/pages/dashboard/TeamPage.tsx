import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Plus, 
  Mail, 
  Crown, 
  UserMinus,
  TrendingUp,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { UserRole } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const roles: UserRole[] = ['Founder', 'Marketing', 'Sales', 'Finance', 'Operations', 'Product'];

export default function TeamPage() {
  const { currentUser, users, teams, createTeam, inviteMember } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Marketing');
  const [newTeamName, setNewTeamName] = useState('');

  const userTeam = teams.find(t => t.id === currentUser.teamId);
  const teamMembers = userTeam 
    ? users.filter(u => userTeam.members.some(m => m.userId === u.id))
    : [];

  const isTeamOwner = userTeam?.ownerId === currentUser.id;

  const handleInvite = () => {
    if (userTeam) {
      inviteMember(userTeam.id, inviteEmail, inviteRole);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    }
  };

  const handleCreateTeam = () => {
    createTeam(newTeamName);
    setNewTeamName('');
    setIsCreateTeamModalOpen(false);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Founder':
        return 'bg-purple-100 text-purple-700';
      case 'Marketing':
        return 'bg-pink-100 text-pink-700';
      case 'Sales':
        return 'bg-green-100 text-green-700';
      case 'Finance':
        return 'bg-blue-100 text-blue-700';
      case 'Operations':
        return 'bg-orange-100 text-orange-700';
      case 'Product':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate team stats
  const totalTasks = 24;
  const completedTasks = 8;
  const teamProgress = Math.round((completedTasks / totalTasks) * 100);

  if (!userTeam) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500">Collaborate with your team members</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Team Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Create a team to invite members, assign roles, and track your collective progress.
            </p>
            <Button onClick={() => setIsCreateTeamModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </CardContent>
        </Card>

        {/* Create Team Modal */}
        <Dialog open={isCreateTeamModalOpen} onOpenChange={setIsCreateTeamModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="e.g., StartupX Team"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
              >
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userTeam.name}</h1>
          <p className="text-gray-500">Manage your team and track progress</p>
        </div>
        {isTeamOwner && (
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{teamProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">Team Roadmap Progress</span>
            <span className="text-sm text-gray-500">{completedTasks} of {totalTasks} tasks</span>
          </div>
          <Progress value={teamProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const memberRole = userTeam.members.find(m => m.userId === member.id)?.role;
              const isOwner = userTeam.ownerId === member.id;
              
              return (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      {isOwner && (
                        <Badge className="bg-amber-100 text-amber-700">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeColor(memberRole as UserRole)}>
                      {memberRole}
                    </Badge>
                    
                    {isTeamOwner && !isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove from team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => {
              const count = teamMembers.filter(m => 
                userTeam.members.find(tm => tm.userId === m.id)?.role === role
              ).length;
              if (count === 0) return null;
              
              return (
                <Badge key={role} variant="secondary" className="px-3 py-1">
                  {role}: {count}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  placeholder="colleague@example.com"
                  className="pl-10"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role">Assign Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                <SelectTrigger className="mt-2">
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
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleInvite}
              disabled={!inviteEmail.trim()}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
