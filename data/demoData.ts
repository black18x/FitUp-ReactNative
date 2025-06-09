// Demo data for the FitnessApp

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string[];
  joinDate: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  exercises: Exercise[];
  calories: number;
  equipment: string[];
  image?: string;
  tags: string[];
  rating: number;
  completions: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  instructions: string[];
  muscleGroups: string[];
  equipment?: string;
  image?: string;
  videoUrl?: string;
}

export interface DailyStats {
  date: string;
  steps: number;
  stepGoal: number;
  calories: number;
  calorieGoal: number;
  activeMinutes: number;
  activeGoal: number;
  heartRate: number;
  sleep: number; // in hours
  water: number; // in glasses
  workoutsCompleted: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  workoutName?: string;
  achievements?: string[];
  likes: number;
  comments: number;
  timestamp: string;
  image?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Workout' | 'Steps' | 'Calories' | 'Streak' | 'Social';
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Demo Data

export const currentUser: User = {
  id: '1',
  name: 'Alex Northrop',
  email: 'alex.northrop@example.com',
  age: 28,
  height: 175,
  weight: 70,
  fitnessLevel: 'Intermediate',
  goals: ['Lose Weight', 'Build Muscle', 'Improve Endurance'],
  joinDate: '2024-01-15',
};

export const dailyStats: DailyStats = {
  date: new Date().toISOString().split('T')[0],
  steps: 8547,
  stepGoal: 10000,
  calories: 420,
  calorieGoal: 600,
  activeMinutes: 45,
  activeGoal: 60,
  heartRate: 72,
  sleep: 7.5,
  water: 6,
  workoutsCompleted: 1,
};

export const workoutCategories = [
  'All',
  'Strength',
  'Cardio',
  'HIIT',
  'Yoga',
  'Flexibility',
  'Core',
  'Full Body',
  'Upper Body',
  'Lower Body',
];

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    sets: 3,
    reps: 15,
    restTime: 60,
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep your core tight throughout the movement',
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
  },
  {
    id: '2',
    name: 'Squats',
    description: 'Fundamental lower body exercise',
    sets: 3,
    reps: 20,
    restTime: 90,
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Push through heels to return to starting position',
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
  },
  {
    id: '3',
    name: 'Plank',
    description: 'Isometric core strengthening exercise',
    sets: 3,
    duration: 60,
    restTime: 60,
    instructions: [
      'Start in a push-up position',
      'Lower onto your forearms',
      'Keep your body in a straight line',
      'Hold the position for the specified time',
    ],
    muscleGroups: ['Core', 'Shoulders', 'Back'],
    reps: 1,
  },
  {
    id: '4',
    name: 'Burpees',
    description: 'Full-body high-intensity exercise',
    sets: 3,
    reps: 10,
    restTime: 120,
    instructions: [
      'Start standing upright',
      'Drop into a squat and place hands on floor',
      'Jump feet back into plank position',
      'Do a push-up, then jump feet forward',
      'Jump up with arms overhead',
    ],
    muscleGroups: ['Full Body'],
  },
  {
    id: '5',
    name: 'Mountain Climbers',
    description: 'Dynamic cardio and core exercise',
    sets: 3,
    reps: 30,
    restTime: 60,
    instructions: [
      'Start in plank position',
      'Alternate bringing knees to chest rapidly',
      'Keep core tight and hips level',
      'Maintain steady breathing rhythm',
    ],
    muscleGroups: ['Core', 'Cardio', 'Shoulders'],
  },
];

export const workouts: Workout[] = [
  {
    id: '1',
    name: 'Morning Energizer',
    description: 'Quick 15-minute workout to start your day with energy',
    duration: 15,
    difficulty: 'Easy',
    category: 'Full Body',
    exercises: [exercises[0], exercises[1], exercises[2]],
    calories: 120,
    equipment: [],
    tags: ['Morning', 'Quick', 'Bodyweight'],
    rating: 4.8,
    completions: 1250,
  },
  {
    id: '2',
    name: 'HIIT Blast',
    description: 'High-intensity interval training for maximum calorie burn',
    duration: 25,
    difficulty: 'Hard',
    category: 'HIIT',
    exercises: [exercises[3], exercises[4], exercises[0], exercises[1]],
    calories: 285,
    equipment: [],
    tags: ['HIIT', 'Cardio', 'Fat Burn'],
    rating: 4.9,
    completions: 890,
  },
  {
    id: '3',
    name: 'Strength Builder',
    description: 'Build muscle and strength with compound movements',
    duration: 45,
    difficulty: 'Medium',
    category: 'Strength',
    exercises: [exercises[1], exercises[0], exercises[2], exercises[4]],
    calories: 320,
    equipment: ['Dumbbells'],
    tags: ['Strength', 'Muscle Building'],
    rating: 4.7,
    completions: 650,
  },
  {
    id: '4',
    name: 'Core Focus',
    description: 'Targeted core strengthening routine',
    duration: 20,
    difficulty: 'Medium',
    category: 'Core',
    exercises: [exercises[2], exercises[4]],
    calories: 150,
    equipment: [],
    tags: ['Core', 'Abs', 'Stability'],
    rating: 4.6,
    completions: 780,
  },
  {
    id: '5',
    name: 'Cardio Crusher',
    description: 'High-energy cardio workout to boost endurance',
    duration: 30,
    difficulty: 'Medium',
    category: 'Cardio',
    exercises: [exercises[3], exercises[4], exercises[1]],
    calories: 250,
    equipment: [],
    tags: ['Cardio', 'Endurance', 'Fat Burn'],
    rating: 4.5,
    completions: 920,
  },
  {
    id: '6',
    name: 'Beginner Flow',
    description: 'Perfect for those just starting their fitness journey',
    duration: 20,
    difficulty: 'Easy',
    category: 'Full Body',
    exercises: [exercises[0], exercises[1], exercises[2]],
    calories: 140,
    equipment: [],
    tags: ['Beginner', 'Low Impact'],
    rating: 4.9,
    completions: 1500,
  },
];

export const recentWorkouts = [
  {
    id: '1',
    name: 'Morning Run',
    duration: '32 min',
    calories: 285,
    type: 'Cardio',
    date: '2024-01-20',
  },
  {
    id: '2',
    name: 'Strength Training',
    duration: '45 min',
    calories: 320,
    type: 'Strength',
    date: '2024-01-19',
  },
  {
    id: '3',
    name: 'Yoga Session',
    duration: '25 min',
    calories: 150,
    type: 'Flexibility',
    date: '2024-01-18',
  },
  {
    id: '4',
    name: 'HIIT Workout',
    duration: '20 min',
    calories: 240,
    type: 'HIIT',
    date: '2024-01-17',
  },
];

export const progressData = {
  weight: [
    { date: '2024-01-01', value: 72 },
    { date: '2024-01-08', value: 71.5 },
    { date: '2024-01-15', value: 71 },
    { date: '2024-01-22', value: 70.5 },
    { date: '2024-01-29', value: 70 },
  ],
  workouts: [
    { week: 'Week 1', count: 3 },
    { week: 'Week 2', count: 4 },
    { week: 'Week 3', count: 5 },
    { week: 'Week 4', count: 4 },
  ],
  steps: [
    { date: '2024-01-15', value: 8200 },
    { date: '2024-01-16', value: 9500 },
    { date: '2024-01-17', value: 10200 },
    { date: '2024-01-18', value: 8800 },
    { date: '2024-01-19', value: 9800 },
    { date: '2024-01-20', value: 8547 },
  ],
};

export const socialPosts: SocialPost[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sarah Johnson',
    content: 'Just completed my first 5K run! Feeling amazing! 🏃‍♀️💪',
    workoutName: 'Morning Run',
    achievements: ['First 5K'],
    likes: 24,
    comments: 8,
    timestamp: '2024-01-20T08:30:00Z',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Mike Chen',
    content: 'New personal record on bench press! Hard work pays off 💪',
    likes: 18,
    comments: 5,
    timestamp: '2024-01-20T07:15:00Z',
  },
  {
    id: '3',
    userId: '4',
    userName: 'Emily Davis',
    content: 'Week 4 of my fitness journey complete! Already feeling stronger ✨',
    workoutName: 'Strength Builder',
    likes: 32,
    comments: 12,
    timestamp: '2024-01-19T19:45:00Z',
  },
  {
    id: '4',
    userId: '5',
    userName: 'David Wilson',
    content: 'Morning yoga session to start the day right 🧘‍♂️',
    workoutName: 'Yoga Flow',
    likes: 15,
    comments: 3,
    timestamp: '2024-01-19T06:30:00Z',
  },
];

export const achievements: Achievement[] = [
  {
    id: '1',
    name: 'First Workout',
    description: 'Complete your first workout',
    icon: '🎯',
    category: 'Workout',
    unlockedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Step Master',
    description: 'Walk 10,000 steps in a day',
    icon: '👣',
    category: 'Steps',
    progress: 8547,
    target: 10000,
  },
  {
    id: '3',
    name: 'Calorie Crusher',
    description: 'Burn 500 calories in a single workout',
    icon: '🔥',
    category: 'Calories',
    progress: 420,
    target: 500,
  },
  {
    id: '4',
    name: 'Week Warrior',
    description: 'Complete 5 workouts in a week',
    icon: '⚡',
    category: 'Workout',
    progress: 3,
    target: 5,
  },
  {
    id: '5',
    name: 'Social Butterfly',
    description: 'Share 10 workout posts',
    icon: '🦋',
    category: 'Social',
    unlockedAt: '2024-01-18',
  },
];

export const weeklyChallenge = {
  name: 'Step Challenge',
  description: 'Walk 50,000 steps this week',
  progress: 42500,
  target: 50000,
  daysLeft: 2,
  participants: 156,
  reward: '100 points + Badge',
};

export const nutritionTips = [
  'Drink water before each meal to help control portion sizes',
  'Include protein in every meal to maintain muscle mass',
  'Eat colorful fruits and vegetables for essential vitamins',
  'Plan your meals ahead to avoid unhealthy food choices',
  'Listen to your body - eat when hungry, stop when full',
];

export const workoutTips = [
  'Always warm up before exercising to prevent injury',
  'Focus on proper form over heavy weights',
  'Rest days are just as important as workout days',
  'Stay hydrated throughout your workout',
  'Track your progress to stay motivated',
];

// Utility functions
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getWorkoutsByCategory = (category: string): Workout[] => {
  if (category === 'All') return workouts;
  return workouts.filter(workout => workout.category === category);
};

export const searchWorkouts = (query: string): Workout[] => {
  if (!query.trim()) return workouts;
  const lowercaseQuery = query.toLowerCase();
  return workouts.filter(workout =>
    workout.name.toLowerCase().includes(lowercaseQuery) ||
    workout.description.toLowerCase().includes(lowercaseQuery) ||
    workout.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProgressPercentage = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100);
};

export const formatCalories = (calories: number): string => {
  return `${calories} cal`;
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy': return '#22C55E';
    case 'Medium': return '#F59E0B';
    case 'Hard': return '#EF4444';
    default: return '#64748B';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Strength': return '💪';
    case 'Cardio': return '❤️';
    case 'HIIT': return '⚡';
    case 'Yoga': return '🧘';
    case 'Flexibility': return '🤸';
    case 'Core': return '🎯';
    case 'Full Body': return '🔥';
    case 'Upper Body': return '💪';
    case 'Lower Body': return '🦵';
    default: return '🏃';
  }
};

export const getDaysInPeriod = (period: string): number => {
  switch (period) {
    case 'Week': return 7;
    case 'Month': return 30;
    case 'Year': return 365;
    default: return 7;
  }
};

export const getStatsForPeriod = (period: string) => {
  const days = getDaysInPeriod(period);
  
  // Generate mock data for the period based on current dailyStats
  const mockStats = Array.from({ length: days }, (_, index) => ({
    date: new Date(Date.now() - (days - index - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    workoutsCompleted: Math.floor(Math.random() * 3),
    caloriesBurned: 200 + Math.floor(Math.random() * 400),
    activeMinutes: 20 + Math.floor(Math.random() * 60),
    averageHeartRate: 65 + Math.floor(Math.random() * 30),
    steps: 5000 + Math.floor(Math.random() * 8000),
  }));
  
  const totalWorkouts = mockStats.reduce((sum: number, stat) => sum + stat.workoutsCompleted, 0);
  const totalCalories = mockStats.reduce((sum: number, stat) => sum + stat.caloriesBurned, 0);
  const totalDuration = mockStats.reduce((sum: number, stat) => sum + stat.activeMinutes, 0);
  const avgHeartRate = Math.round(mockStats.reduce((sum: number, stat) => sum + stat.averageHeartRate, 0) / mockStats.length);
  
  return {
    workouts: totalWorkouts,
    calories: totalCalories,
    duration: totalDuration,
    heartRate: avgHeartRate,
    data: mockStats
  };
};

export const getAchievementIcon = (type: string) => {
  switch (type) {
    case 'workout': return '🏃';
    case 'streak': return '🔥';
    case 'distance': return '📏';
    case 'time': return '⏱️';
    case 'calories': return '⚡';
    default: return '🏆';
  }
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return `${Math.floor(diffInDays / 7)}w ago`;
};

// Create a users array for social features
export const users = [
  currentUser,
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    age: 32,
    height: 168,
    weight: 65,
    fitnessLevel: 'Advanced',
    goals: ['Build Muscle', 'Improve Endurance'],
    joinDate: '2023-11-20',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    age: 25,
    height: 180,
    weight: 82,
    fitnessLevel: 'Beginner',
    goals: ['Lose Weight', 'Build Strength'],
    joinDate: '2024-02-10',
  },
];

export const challenges = [
  {
    id: '1',
    name: '30-Day Step Challenge',
    description: 'Walk 10,000 steps daily for 30 days',
    participants: 1247,
    daysLeft: 12,
    progress: 0.65,
    category: 'Steps',
    startDate: '2024-01-01',
    endDate: '2024-01-30',
  },
  {
    id: '2',
    name: 'Push-up Challenge',
    description: 'Complete 100 push-ups daily',
    participants: 523,
    daysLeft: 5,
    progress: 0.85,
    category: 'Strength',
    startDate: '2024-01-10',
    endDate: '2024-01-25',
  },
  {
    id: '3',
    name: 'Cardio Burn',
    description: 'Burn 500 calories through cardio',
    participants: 892,
    daysLeft: 18,
    progress: 0.45,
    category: 'Cardio',
    startDate: '2024-01-05',
    endDate: '2024-02-05',
  },
];
