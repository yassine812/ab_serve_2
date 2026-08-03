import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { useAuthSession } from '../../../../src/hooks/useAuthSession';

export default function ProfileScreen() {
  const { user, signOut } = useAuthSession();

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8', padding: 16 }}>
      <Card style={{ borderRadius: 20 }}>
        <Card.Content>
          <Text variant="titleMedium">{user?.display_name ?? 'Utilisateur'}</Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, color: '#52606D' }}>
            {user?.email || user?.username}
          </Text>
          <Text variant="bodySmall" style={{ marginTop: 8, color: '#7B8794' }}>
            Roles: {user?.roles?.join(', ') || 'aucun'}
          </Text>
          <Button mode="outlined" onPress={() => void signOut()} style={{ marginTop: 20 }}>
            Se deconnecter
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
