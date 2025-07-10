import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Task, TaskPriority } from "@shared/schema";
import { Plus, Search, Filter } from "lucide-react";

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM as TaskPriority,
    tags: [] as string[],
    hasQuantity: false,
    targetCount: 1,
    xpReward: 10,
    dueDate: '',
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.isCompleted) ||
                         (filterStatus === 'pending' && !task.isCompleted);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!formData.title.trim()) {
      console.log('Title is empty, returning');
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      isCompleted: false,
      currentCount: 0,
    };

    console.log('About to add task:', taskData);

    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
        console.log('Task updated successfully');
      } else {
        await addTask(taskData);
        console.log('Task added successfully');
      }

      setFormData({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        tags: [],
        hasQuantity: false,
        targetCount: 1,
        xpReward: 10,
        dueDate: '',
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      tags: task.tags,
      hasQuantity: task.hasQuantity,
      targetCount: task.targetCount,
      xpReward: task.xpReward,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    });
    setIsCreateDialogOpen(true);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks and track your progress
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-aqua-500 hover:bg-aqua-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as TaskPriority }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
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
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasQuantity"
                  checked={formData.hasQuantity}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasQuantity: checked }))}
                />
                <Label htmlFor="hasQuantity">Has quantity target</Label>
              </div>
              
              {formData.hasQuantity && (
                <div>
                  <Label htmlFor="targetCount">Target Count</Label>
                  <Input
                    id="targetCount"
                    type="number"
                    value={formData.targetCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) }))}
                    min={1}
                    max={100}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingTask(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-aqua-500 hover:bg-aqua-600 text-white">
                  {editingTask ? 'Update' : 'Create'} Task
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as TaskPriority | 'all')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'completed' | 'pending')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || filterPriority !== 'all' || filterStatus !== 'all' 
                ? "No tasks match your filters" 
                : "No tasks created yet"}
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-aqua-500 hover:bg-aqua-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Task
            </Button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
