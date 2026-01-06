import { useAuth } from '@/contexts/AuthContext';

export function useUser() {
  const { user, profile, loading, profileLoading } = useAuth();

  const getUserName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }

    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }

    if (user?.email) {
      return user.email.split('@')[0];
    }

    return 'Usuário';
  };

  return {
    user,
    profile,
    userId: user?.id,
    userEmail: user?.email,
    userName: getUserName(),
    userAvatar: profile?.avatar_url || null,
    isAuthenticated: !!user,
    loading: loading || profileLoading,
    profileLoading,
  };
}
