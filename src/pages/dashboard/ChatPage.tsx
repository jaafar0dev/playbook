import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  Smile,
  Users,
  MoreVertical,
  Phone,
  Video,
  Globe,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";

type ChatMode = "team" | "community";

export default function ChatPage() {
  const { currentUser, teams, users, messages, sendMessage } = useApp();
  const [messageInput, setMessageInput] = useState("");
  const [chatMode, setChatMode] = useState<ChatMode>("team");
  const scrollRef = useRef<HTMLDivElement>(null);

  const userTeam = teams.find((t) => t.id === currentUser.teamId);
  const teamMembers = userTeam
    ? users.filter((u) => userTeam.members.some((m) => m.userId === u.id))
    : [];

  // Filter messages based on active tab
  const activeMessages =
    chatMode === "team"
      ? messages.filter((m) => m.teamId === currentUser.teamId)
      : messages.filter((m) => m.teamId === "community"); // Using 'community' as a special global teamId

  // Group messages by date
  const groupedMessages = activeMessages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, typeof activeMessages>,
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, chatMode]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // If in team chat but no team, prevent sending
    if (chatMode === "team" && !currentUser.teamId) return;

    const targetTeamId =
      chatMode === "team" ? currentUser.teamId! : "community";
    sendMessage(targetTeamId, messageInput);
    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // UI state variables based on active mode
  const headerTitle =
    chatMode === "team"
      ? userTeam?.name || "No Team"
      : "Global Growth Community";
  const headerIcon =
    chatMode === "team" ? (
      <Users className="h-5 w-5 text-blue-600" />
    ) : (
      <Globe className="h-5 w-5 text-indigo-600" />
    );
  const headerSub =
    chatMode === "team"
      ? `${teamMembers.length} members • ${teamMembers.filter((m) => m.id !== currentUser.id).length} online`
      : "1,248 founders • 342 online";

  const noTeamView = chatMode === "team" && !userTeam;

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)]">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
          <p className="text-gray-500">Collaborate and learn with others</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setChatMode("team")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              chatMode === "team"
                ? "bg-white shadow-sm text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            My Team
          </button>
          <button
            onClick={() => setChatMode("community")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              chatMode === "community"
                ? "bg-white shadow-sm text-indigo-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            Community
          </button>
        </div>
      </div>

      {noTeamView ? (
        <Card className="h-[80%]">
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Team Yet
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Join or create a team to start chatting with your colleagues, or
              switch to the Community tab to chat with other founders.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex flex-col h-full">
          {/* Chat Header */}
          <CardHeader className="border-b py-4 bg-white z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${chatMode === "team" ? "bg-blue-100" : "bg-indigo-100"}`}
                >
                  {headerIcon}
                </div>
                <div>
                  <CardTitle className="text-base">{headerTitle}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-gray-500">{headerSub}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chatMode === "team" && (
                  <>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-hidden p-0 bg-gray-50/50">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="mb-6">
                  {/* Date Divider */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
                      {format(new Date(date), "MMMM d, yyyy")}
                    </div>
                  </div>

                  {/* Messages for this date */}
                  <div className="space-y-4">
                    {msgs.map((message) => {
                      const isCurrentUser = message.userId === currentUser.id;

                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                        >
                          <img
                            src={
                              message.userAvatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userName}`
                            }
                            alt={message.userName}
                            className="w-8 h-8 rounded-full bg-white border shadow-sm flex-shrink-0"
                          />
                          <div
                            className={`max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`flex items-center gap-2 mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                            >
                              <span className="text-sm font-medium text-gray-700">
                                {isCurrentUser ? "You" : message.userName}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {format(new Date(message.createdAt), "h:mm a")}
                              </span>
                            </div>
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                isCurrentUser
                                  ? chatMode === "team"
                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                    : "bg-indigo-600 text-white rounded-tr-sm"
                                  : "bg-white border text-gray-800 rounded-tl-sm"
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

              {activeMessages.length === 0 && (
                <div className="text-center py-12">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${chatMode === "team" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}
                  >
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Start the conversation
                  </h3>
                  <p className="text-gray-500">
                    Send the first message to the{" "}
                    {chatMode === "team" ? "team" : "community"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4 bg-white z-10">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </Button>
              <Input
                placeholder={`Message ${chatMode === "team" ? "your team" : "the community"}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
              />
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`flex-shrink-0 ${chatMode === "community" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
