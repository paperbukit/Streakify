import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { DailyGoalCard } from "../components/goals/DailyGoalCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { DailyGoal } from "@shared/schema";
import { Plus, Target, Trophy } from "lucide-react";

export default function DailyGoals() {
  const { dailyGoals, addDailyGoal, updateDailyGoal, deleteDailyGoal } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<DailyGoal | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetCount: 1,
    xpReward: 30,
  });

  const completedGoals = dailyGoals.filter(goal => goal.isCompleted);
  const pendingGoals = dailyGoals.filter(goal => !goal.isCompleted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Daily goal form submitted with data:', formData);
    
    if (!formData.title.trim()) {
      console.log('Goal title is empty, returning');
      return;
    }

    const goalData = {
      ...formData,
      currentCount: 0,
      isCompleted: false,
    };

    console.log('About to add daily goal:', goalData);

    try {
      if (editingGoal) {
        await updateDailyGoal(editingGoal.id, goalData);
        setEditingGoal(null);
        console.log('Goal updated successfully');
      } else {
        await addDailyGoal(goalData);
        console.log('Goal added successfully');
      }

      setFormData({
        title: '',
        description: '',
        targetCount: 1,
        xpReward: 30,
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating goal:', error);
    }
  };

  const handleEdit = (goal: DailyGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetCount: goal.targetCount,
      xpReward: goal.xpReward,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteDailyGoal(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Daily Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set daily targets and track your consistency
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-aqua-500 hover:bg-aqua-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Edit Goal' : 'Create New Daily Goal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter goal description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetCount">Target Count</Label>
                  <Input
                    id="targetCount"
                    type="number"
                    value={formData.targetCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) }))}
                    min={1}
                    max={100}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
                    min={1}
                    max={100}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingGoal(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-aqua-500 hover:bg-aqua-600 text-white">
                  {editingGoal ? 'Update' : 'Create'} Goal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {dailyGoals.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-aqua-400 to-aqua-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {completedGoals.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {dailyGoals.length > 0 ? Math.round((completedGoals.length / dailyGoals.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals Sections */}
      <div className="space-y-8">
        {/* Pending Goals */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Active Goals ({pendingGoals.length})
          </h2>
          <div className="space-y-4">
            {pendingGoals.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No active goals yet
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-aqua-500 hover:bg-aqua-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            ) : (
              pendingGoals.map((goal) => (
                <DailyGoalCard key={goal.id} goal={goal} />
              ))
            )}
          </div>
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Completed Today ({completedGoals.length})
            </h2>
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <DailyGoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
