import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  MessageCircle,
  Share,
  Trophy,
  Users,
  Plus,
  TrendingUp,
  Award,
  Flame,
  Clock,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  socialPosts, 
  users, 
  challenges,
  formatDuration,
  getTimeAgo 
} from '../../data/demoData';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function SocialScreen() {
  const colorScheme = useColorScheme();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#F97316',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };
  // Create display data from imported demo data
  const challengeIcons = [TrendingUp, Award, Flame, Trophy];
  const challengeColors = [colors.primary, colors.accent, colors.success, colors.warning];
  
  const challengesData = challenges.map((challenge, index) => ({
    ...challenge,
    icon: challengeIcons[index % challengeIcons.length],
    color: challengeColors[index % challengeColors.length],
    title: challenge.name,
  }));

  // Transform social posts to match UI structure
  const postsData = socialPosts.map(post => {
    const user = users.find(u => u.id === post.userId) || {
      name: post.userName,
      avatar: post.userAvatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: Math.random() > 0.5, // Random verification status
    };

    return {
      id: parseInt(post.id),
      user,
      content: post.content,
      timestamp: getTimeAgo(post.timestamp),
      likes: post.likes,
      comments: post.comments,
      image: post.image,
      type: post.workoutName ? 'workout' : (post.achievements?.length ? 'achievement' : 'general'),
      workout: post.workoutName ? {
        name: post.workoutName,
        duration: formatDuration(Math.floor(Math.random() * 60) + 15), // Random duration
        calories: Math.floor(Math.random() * 400) + 200, // Random calories
      } : undefined,
      achievement: post.achievements?.length ? {
        title: post.achievements[0],
        description: `Unlocked: ${post.achievements[0]}`,
        icon: Trophy,
      } : undefined,
    };
  });

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const renderPost = (post: any) => {
    const isLiked = likedPosts.includes(post.id);

    return (
      <View key={post.id} style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={[styles.userName, { color: colors.text }]}>{post.user.name}</Text>
                {post.user.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{post.timestamp}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={[styles.moreText, { color: colors.textSecondary }]}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

        {/* Post Type Specific Content */}
        {post.type === 'workout' && post.workout && (
          <View style={[styles.workoutCard, { backgroundColor: colors.surface }]}>
            <View style={styles.workoutHeader}>
              <View style={[styles.workoutIcon, { backgroundColor: colors.primary }]}>
                <Flame size={16} color="white" />
              </View>
              <Text style={[styles.workoutName, { color: colors.text }]}>{post.workout.name}</Text>
            </View>
            <View style={styles.workoutStats}>
              <View style={styles.workoutStat}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.workoutStatText, { color: colors.textSecondary }]}>
                  {post.workout.duration}
                </Text>
              </View>
              <View style={styles.workoutStat}>
                <Flame size={14} color={colors.textSecondary} />
                <Text style={[styles.workoutStatText, { color: colors.textSecondary }]}>
                  {post.workout.calories} cal
                </Text>
              </View>
            </View>
          </View>
        )}

        {post.type === 'achievement' && post.achievement && (
          <View style={[styles.achievementCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.achievementIcon, { backgroundColor: colors.accent }]}>
              <post.achievement.icon size={24} color="white" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                {post.achievement.title}
              </Text>
              <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                {post.achievement.description}
              </Text>
            </View>
          </View>
        )}

        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleLike(post.id)}
          >
            <Heart 
              size={20} 
              color={isLiked ? colors.error : colors.textSecondary}
              fill={isLiked ? colors.error : 'none'}
            />
            <Text style={[
              styles.actionText, 
              { color: isLiked ? colors.error : colors.textSecondary }
            ]}>
              {post.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Community</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Active Challenges */}
        <View style={styles.challengesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Challenges</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengesContainer}
          >            {challengesData.map((challenge) => (
              <TouchableOpacity
                key={challenge.id}
                style={[styles.challengeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.challengeIcon, { backgroundColor: `${challenge.color}15` }]}>
                  <challenge.icon size={24} color={challenge.color} />
                </View>
                <Text style={[styles.challengeTitle, { color: colors.text }]}>{challenge.title}</Text>
                <View style={styles.challengeStats}>
                  <View style={styles.challengeStat}>
                    <Users size={12} color={colors.textSecondary} />
                    <Text style={[styles.challengeStatText, { color: colors.textSecondary }]}>
                      {challenge.participants}
                    </Text>
                  </View>
                  <Text style={[styles.challengeDays, { color: colors.textSecondary }]}>
                    {challenge.daysLeft} days left
                  </Text>
                </View>
                <View style={[styles.challengeProgress, { backgroundColor: colors.surface }]}>
                  <View 
                    style={[
                      styles.challengeProgressFill,
                      { backgroundColor: challenge.color, width: `${challenge.progress * 100}%` }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Activity Feed */}
        <View style={styles.feedSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          {postsData.map(renderPost)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  challengesContainer: {
    paddingHorizontal: 20,
  },
  challengeCard: {
    width: 200,
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    lineHeight: 22,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeStatText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  challengeDays: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  challengeProgress: {
    height: 4,
    borderRadius: 2,
  },
  challengeProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  feedSection: {
    paddingHorizontal: 20,
  },
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 6,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  moreText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  postContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  workoutName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStatText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});