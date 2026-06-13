import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Calendar, Zap } from "lucide-react";

interface MissionCompletion {
  missionId: string;
  missionTitle: string;
  studentAnswers: Record<string, string>;
  xpEarned: number;
  dnaCategory: string;
  completionDate: string;
  level: number;
  totalXp: number;
}

export default function ProgressJournal() {
  const [, navigate] = useLocation();
  const [completions, setCompletions] = useState<MissionCompletion[]>([]);
  const [selectedMission, setSelectedMission] = useState<MissionCompletion | null>(null);

  useEffect(() => {
    // Load completions from localStorage
    const saved = localStorage.getItem("mission_completions");
    if (saved) {
      try {
        setCompletions(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading completions:", error);
      }
    }
  }, []);

  const totalXpEarned = completions.reduce((sum, c) => sum + c.xpEarned, 0);
  const uniqueDnaCategories = [...new Set(completions.map((c) => c.dnaCategory))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">📖 Progress Journal</h1>
        </div>
        <p className="text-blue-100">Track your completed missions and growth over time</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">MISSIONS COMPLETED</p>
              <p className="text-4xl font-bold text-blue-600">{completions.length}</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL XP EARNED</p>
              <p className="text-4xl font-bold text-purple-600">{totalXpEarned}</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">DNA TRAITS DEVELOPED</p>
              <p className="text-4xl font-bold text-green-600">{uniqueDnaCategories.length}</p>
            </div>
          </Card>
        </div>

        {/* DNA Categories */}
        {uniqueDnaCategories.length > 0 && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🧬 DNA Traits Developed</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueDnaCategories.map((category) => {
                const count = completions.filter((c) => c.dnaCategory === category).length;
                return (
                  <div
                    key={category}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-800"
                  >
                    {category} <span className="text-xs text-gray-600">({count})</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Completed Missions List */}
        <Card className="p-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Completed Missions</h2>
          {completions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No missions completed yet. Start a mission to see your progress here!
            </p>
          ) : (
            <div className="space-y-3">
              {completions.map((completion, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => setSelectedMission(completion)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{completion.missionTitle}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(completion.completionDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={14} />
                          +{completion.xpEarned} XP
                        </span>
                        <span className="text-purple-600 font-semibold">{completion.dnaCategory}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedMission(completion)}>
                      View Answers
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedMission.missionTitle}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMission(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">XP EARNED</p>
                  <p className="text-2xl font-bold text-blue-600">+{selectedMission.xpEarned}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">DNA TRAIT</p>
                  <p className="text-lg font-bold text-purple-600">{selectedMission.dnaCategory}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">COMPLETED</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedMission.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Your Answers</h3>
              <div className="space-y-4">
                {Object.entries(selectedMission.studentAnswers).map(([questionId, answer], index) => (
                  <div key={questionId} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">Question {index + 1}</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setSelectedMission(null)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
