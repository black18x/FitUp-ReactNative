import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Play,
  Clock,
  Flame,
  Target,
  Dumbbell,
  Heart,
  Zap,
  Users,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const isLargeScreen = width > 1024;

export default function WorkoutsScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#F97316',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    cardGlass: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.4)' : 'rgba(255, 255, 255, 0.4)',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const categories = [
    { name: 'All', icon: Target, color: colors.primary },
    { name: 'Strength', icon: Dumbbell, color: colors.accent },
    { name: 'Cardio', icon: Heart, color: colors.error },
    { name: 'HIIT', icon: Zap, color: colors.warning },
    { name: 'Yoga', icon: Users, color: colors.success },
  ];

  const featuredWorkouts = [
    {
      id: 1,
      name: 'Morning Power',
      description: 'High-intensity full body workout',
      duration: '30 min',
      calories: '350 cal',
      difficulty: 'Advanced',
      category: 'HIIT',
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
      exercises: 12,
    },
    {
      id: 2,
      name: 'Core Strength',
      description: 'Target your core with focused exercises',
      duration: '25 min',
      calories: '200 cal',
      difficulty: 'Intermediate',
      category: 'Strength',
      image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
      exercises: 8,
    },
  ];

  const popularWorkouts = [
    {
      id: 3,
      name: 'Fat Burn Cardio',
      description: 'Burn calories with cardio exercises',
      duration: '45 min',
      calories: '400 cal',
      difficulty: 'Beginner',
      category: 'Cardio',
      exercises: 10,
    },
    {
      id: 4,
      name: 'Upper Body Blast',
      description: 'Focus on arms, chest, and shoulders',
      duration: '35 min',
      calories: '280 cal',
      difficulty: 'Intermediate',
      category: 'Strength',
      exercises: 9,
    },
    {
      id: 5,
      name: 'Flexibility Flow',
      description: 'Improve flexibility and mobility',
      duration: '20 min',
      calories: '120 cal',
      difficulty: 'Beginner',
      category: 'Yoga',
      exercises: 6,
    },
    {
      id: 6,
      name: 'Leg Day Intense',
      description: 'Build lower body strength',
      duration: '40 min',
      calories: '320 cal',
      difficulty: 'Advanced',
      category: 'Strength',
      exercises: 11,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.warning;
      case 'Advanced': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colorScheme === 'dark'
          ? ['#0F172A', '#1E293B', '#334155']
          : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
        }
        style={styles.backgroundGradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Workouts</Text>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface }]}>
            <Filter size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search workouts..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryItem,
                { 
                  backgroundColor: selectedCategory === category.name ? category.color : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <category.icon 
                size={20} 
                color={selectedCategory === category.name ? 'white' : category.color} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  { 
                    color: selectedCategory === category.name ? 'white' : colors.text,
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Workouts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Workouts</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {featuredWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={[styles.featuredCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.featuredImage, { backgroundColor: colors.surface }]}>
                  <Play size={32} color={colors.primary} />
                </View>
                <View style={styles.featuredContent}>
                  <Text style={[styles.featuredTitle, { color: colors.text }]}>{workout.name}</Text>
                  <Text style={[styles.featuredDescription, { color: colors.textSecondary }]}>
                    {workout.description}
                  </Text>
                  <View style={styles.featuredStats}>
                    <View style={styles.statItem}>
                      <Clock size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {workout.duration}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Flame size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {workout.calories}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Target size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {workout.exercises} exercises
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: `${getDifficultyColor(workout.difficulty)}15` }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(workout.difficulty) }
                    ]}>
                      {workout.difficulty}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Workouts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Workouts</Text>
          {popularWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={[styles.workoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.workoutIcon, { backgroundColor: colors.surface }]}>
                <Play size={24} color={colors.primary} />
              </View>
              <View style={styles.workoutContent}>
                <View style={styles.workoutHeader}>
                  <Text style={[styles.workoutTitle, { color: colors.text }]}>{workout.name}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: `${getDifficultyColor(workout.difficulty)}15` }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(workout.difficulty) }
                    ]}>
                      {workout.difficulty}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.workoutDescription, { color: colors.textSecondary }]}>
                  {workout.description}
                </Text>
                <View style={styles.workoutStats}>
                  <View style={styles.statItem}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {workout.duration}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Flame size={14} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {workout.calories}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Target size={14} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {workout.exercises} exercises
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: 'Inter-Bold',
  },
  filterButton: {
    width: isTablet ? 52 : 44,
    height: isTablet ? 52 : 44,
    borderRadius: isTablet ? 26 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: isTablet ? 40 : 20,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-Regular',
  },
  categoriesContainer: {
    paddingHorizontal: isTablet ? 40 : 20,
    paddingBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: 25,
    marginRight: isTablet ? 16 : 12,
    borderWidth: 0.5,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: isTablet ? 40 : 20,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingHorizontal: isTablet ? 40 : 20,
  },
  featuredCard: {
    width: isTablet ? 350 : 280,
    borderRadius: 20,
    marginRight: isTablet ? 20 : 16,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  featuredImage: {
    height: isTablet ? 180 : 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: isTablet ? 20 : 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  featuredStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: isTablet ? 40 : 20,
    padding: isTablet ? 20 : 16,
    borderRadius: 20,
    marginBottom: isTablet ? 16 : 12,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutContent: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 12,
  },
  workoutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
});