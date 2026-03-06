import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Smile,
  Users,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';

export default function ChatPage() {
  const { currentUser, teams, users, messages, sendMessage } = useApp();
  const [messageInput, setMessageInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const userTeam = teams.find(t => t.id === currentUser.teamId);
  const teamMembers = userTeam 
    ? users.filter(u => userTeam.members.some(m => m.userId === u.id))
    : [];

  const teamMessages = messages.filter(m => m.teamId === currentUser.teamId);

  // Group messages by date
  const groupedMessages = teamMessages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof teamMessages>);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [teamMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentUser.teamId) return;
    
    sendMessage(currentUser.teamId, messageInput);
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!userTeam) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Chat</h1>
          <p className="text-gray-500">Chat with your team members</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Team Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Join or create a team to start chatting with your colleagues.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Chat</h1>
          <p className="text-gray-500">{userTeam.name}</p>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex flex-col h-full">
        {/* Chat Header */}
        <CardHeader className="border-b py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">{userTeam.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {teamMembers.length} members • {teamMembers.filter(m => m.id !== currentUser.id).length} online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date} className="mb-6">
                {/* Date Divider */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </div>
                </div>

                {/* Messages for this date */}
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.userId === currentUser.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                      >
                        <img
                          src={message.userAvatar}
                          alt={message.userName}
                          className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"
                        />
                        <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {message.userName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {format(new Date(message.createdAt), 'h:mm a')}
                            </span>
                          </div>
                          <div
                            className={`px-4 py-2 rounded-2xl text-sm ${
                              isCurrentUser
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            {message.message}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {teamMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Start the conversation</h3>
                <p className="text-gray-500">Send a message to your team</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
