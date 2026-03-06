import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Briefcase, 
  Key,
  Camera,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function ProfilePage() {
  const { currentUser, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    updateUser({
      ...currentUser,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          Profile updated successfully!
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-gray-500">{currentUser.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                <Badge className="bg-blue-100 text-blue-700">{currentUser.role}</Badge>
                <Badge variant="outline">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Referral Code</div>
              <div className="text-lg font-mono font-medium text-gray-900">{currentUser.referralCode}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">
                <Briefcase className="h-4 w-4 inline mr-2" />
                Role
              </Label>
              <Input
                id="role"
                value={currentUser.role}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referral">
                <Key className="h-4 w-4 inline mr-2" />
                Referral Code
              </Label>
              <Input
                id="referral"
                value={currentUser.referralCode}
                disabled
                className="bg-gray-50 font-mono"
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-500">Tasks Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">48h</div>
            <div className="text-sm text-gray-500">Hours Logged</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">35%</div>
            <div className="text-sm text-gray-500">Roadmap Progress</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
