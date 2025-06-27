import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@shared/schema";

export default function Announcements() {
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements", { active: "true" }],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info": return "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30";
      case "warning": return "bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30";
      case "success": return "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30";
      case "error": return "bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/30";
      default: return "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30";
    }
  };

  const getDotColor = (type: string) => {
    switch (type) {
      case "info": return "bg-cyan-400";
      case "warning": return "bg-orange-400";
      case "success": return "bg-green-400";
      case "error": return "bg-red-400";
      default: return "bg-cyan-400";
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 animate-pulse">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-2 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white">Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No announcements</p>
            </div>
          ) : (
            announcements?.map((announcement) => (
              <div
                key={announcement.id}
                className={`p-4 rounded-xl border ${getTypeColor(announcement.type || "info")}`}
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 ${getDotColor(announcement.type || "info")} rounded-full mt-2 mr-3 animate-pulse`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white mb-1">
                      {announcement.title}
                    </p>
                    <p className="text-xs text-slate-400 mb-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {announcement.type || "info"}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDate(announcement.createdAt?.toString() || "")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {announcements && announcements.length > 0 && (
          <Button variant="ghost" className="w-full mt-4 text-cyan-400 hover:text-cyan-300">
            View All Announcements
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
