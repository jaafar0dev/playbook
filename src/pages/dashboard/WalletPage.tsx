import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift,
  DollarSign,
  Clock,
  CreditCard,
  History
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function WalletPage() {
  const { currentUser, walletTransactions, getWalletBalance } = useApp();
  
  const balance = getWalletBalance();
  const userTransactions = walletTransactions.filter(t => t.userId === currentUser.id);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return { icon: ArrowDownLeft, color: 'bg-green-100 text-green-600' };
      case 'withdrawal':
        return { icon: ArrowUpRight, color: 'bg-red-100 text-red-600' };
      case 'bonus':
        return { icon: Gift, color: 'bg-violet-100 text-violet-600' };
      default:
        return { icon: DollarSign, color: 'bg-blue-100 text-blue-600' };
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'referral':
        return <Badge className="bg-green-100 text-green-700">Referral</Badge>;
      case 'withdrawal':
        return <Badge className="bg-red-100 text-red-700">Withdrawal</Badge>;
      case 'bonus':
        return <Badge className="bg-violet-100 text-violet-700">Bonus</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-500">Manage your earnings and view transaction history</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-violet-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-100 mb-2">Available Balance</p>
              <h2 className="text-5xl font-bold">${balance}</h2>
              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-white/20 text-white border-0">
                  <Clock className="h-3 w-3 mr-1" />
                  Withdrawals coming soon
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="h-12 px-6"
                disabled
              >
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Withdraw
              </Button>
              <Button 
                variant="outline" 
                className="h-12 px-6 border-white/30 text-white hover:bg-white/10"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Add Funds
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${userTransactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Referral Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${userTransactions.filter(t => t.type === 'referral').reduce((acc, t) => acc + t.amount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bonus Rewards</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${userTransactions.filter(t => t.type === 'bonus').reduce((acc, t) => acc + t.amount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                <Gift className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" />
            <CardTitle>Transaction History</CardTitle>
          </div>
          <Badge variant="secondary">{userTransactions.length} transactions</Badge>
        </CardHeader>
        <CardContent>
          {userTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userTransactions.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ).map((transaction) => {
                const { icon: Icon, color } = getTransactionIcon(transaction.type);
                
                return (
                  <div 
                    key={transaction.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        {getTransactionBadge(transaction.type)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${transaction.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
