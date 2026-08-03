import { Pressable, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';

import { Mission } from '../../types/mission';

type MissionCardProps = {
  mission: Mission;
  onPress: () => void;
};

export function MissionCard({ mission, onPress }: MissionCardProps) {
  const createdAt = new Date(mission.date_creation).toLocaleDateString('fr-FR');

  return (
    <Pressable onPress={onPress}>
      <Card style={{ borderRadius: 20, backgroundColor: '#FFFFFF' }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Chip compact style={{ backgroundColor: '#DDEBFF' }}>
              {mission.code}
            </Chip>
            <Chip compact style={{ backgroundColor: mission.statut ? '#DDF5E4' : '#FCE3E1' }}>
              {mission.statut_label}
            </Chip>
          </View>

          <Text variant="titleMedium">{mission.intitule}</Text>
          <Text variant="bodyMedium" style={{ color: '#52606D', marginTop: 4 }}>
            Reference: {mission.reference}
          </Text>
          <Text numberOfLines={3} variant="bodySmall" style={{ color: '#7B8794', marginTop: 8 }}>
            {mission.description}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
            <Text variant="labelSmall">Creee le {createdAt}</Text>
            <Text variant="labelSmall">{mission.has_pdf ? 'PDF disponible' : 'PDF a generer'}</Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}
