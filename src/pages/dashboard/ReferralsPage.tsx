import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  DollarSign,
  TrendingUp,
  Gift,
  Mail,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function ReferralsPage() {
  const { currentUser, referrals, getReferralLink } = useApp();
  const [copied, setCopied] = useState(false);
  const referralLink = getReferralLink();
  
  const userReferrals = referrals.filter(r => r.referrerId === currentUser.id);
  const totalEarnings = userReferrals.reduce((acc, r) => acc + r.rewardAmount, 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { icon: Mail, label: 'Email', color: 'bg-gray-100 hover:bg-gray-200' },
    { icon: Twitter, label: 'Twitter', color: 'bg-sky-100 hover:bg-sky-200 text-sky-600' },
    { icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-100 hover:bg-blue-200 text-blue-600' },
    { icon: Facebook, label: 'Facebook', color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-500">Invite founders and earn rewards</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{userReferrals.length}</p>
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
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reward per Referral</p>
                <p className="text-2xl font-bold text-gray-900">$10</p>
              </div>
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                <Gift className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="flex-1 bg-gray-50"
            />
            <Button 
              onClick={handleCopyLink}
              variant={copied ? 'default' : 'outline'}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-3">Share via</p>
            <div className="flex gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="ghost"
                  className={`flex-1 h-14 ${option.color}`}
                >
                  <option.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Share Your Link',
                description: 'Copy your unique referral link and share it with fellow founders.',
                icon: Share2,
              },
              {
                step: '2',
                title: 'They Sign Up',
                description: 'When someone uses your link to join DoGrowth, you get credited.',
                icon: Users,
              },
              {
                step: '3',
                title: 'Earn Rewards',
                description: 'Receive $10 in wallet credit for every successful referral.',
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-blue-600 mb-2">{item.step}</div>
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {userReferrals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No referrals yet</h3>
              <p className="text-gray-500">Start sharing your link to earn rewards</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReferrals.map((referral) => (
                <div 
                  key={referral.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{referral.referredUserName}</h4>
                    <p className="text-sm text-gray-500">
                      Joined on {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    +${referral.rewardAmount}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
