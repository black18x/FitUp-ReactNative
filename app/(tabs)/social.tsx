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
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

  const challenges = [
    {
      id: 1,
      title: '30-Day Step Challenge',
      participants: 1247,
      daysLeft: 12,
      progress: 0.65,
      icon: TrendingUp,
      color: colors.primary,
    },
    {
      id: 2,
      title: 'Push-up Challenge',
      participants: 523,
      daysLeft: 5,
      progress: 0.85,
      icon: Award,
      color: colors.accent,
    },
  ];

  const posts = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true,
      },
      type: 'workout',
      content: 'Just crushed my morning HIIT session! 🔥 45 minutes of pure intensity. Feeling amazing!',
      workout: {
        name: 'HIIT Cardio Blast',
        duration: '45 min',
        calories: 425,
      },
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: false,
      },
      type: 'achievement',
      content: 'New personal record! Finally hit my 10K steps goal for 7 days straight 🎉',
      achievement: {
        title: 'Weekly Walker',
        description: '7-day step goal streak',
        icon: Trophy,
      },
      timestamp: '4 hours ago',
      likes: 45,
      comments: 12,
    },
    {
      id: 3,
      user: {
        name: 'Emma Davis',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true,
      },
      type: 'progress',
      content: 'Month 3 transformation update! The consistency is paying off. Never give up! 💪',
      progress: {
        before: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=200',
        after: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=200',
        timeframe: '3 months',
      },
      timestamp: '6 hours ago',
      likes: 89,
      comments: 23,
    },
    {
      id: 4,
      user: {
        name: 'Alex Rodriguez',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: false,
      },
      type: 'nutrition',
      content: 'Meal prep Sunday done! ✅ Healthy choices make healthy habits. What\'s your go-to meal prep?',
      timestamp: '8 hours ago',
      likes: 31,
      comments: 15,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

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
          >
            {challenges.map((challenge) => (
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
          {posts.map(renderPost)}
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