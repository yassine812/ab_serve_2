import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function ValidationsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8', padding: 16 }}>
      <Card style={{ borderRadius: 20 }}>
        <Card.Content>
          <Text variant="titleMedium">Validations</Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, color: '#52606D' }}>
            Ecran reserve au flux RO et Responsable a brancher dans l iteration suivante.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
