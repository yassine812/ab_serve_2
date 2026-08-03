import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function MissionDetailScreen() {
  const { missionId } = useLocalSearchParams<{ missionId: string }>();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4F6F8' }} contentContainerStyle={{ padding: 16 }}>
      <Card style={{ borderRadius: 20 }}>
        <Card.Content>
          <Text variant="titleLarge">Mission #{missionId}</Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, color: '#52606D' }}>
            Ecran detail a completer ensuite avec les gammes, operations et photos.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
