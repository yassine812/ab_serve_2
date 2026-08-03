import { View } from 'react-native';
import { Text } from 'react-native-paper';

export function MissionEmptyState() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
      }}
    >
      <Text variant="titleMedium">Aucune mission trouvee</Text>
      <Text variant="bodyMedium" style={{ marginTop: 8, color: '#7B8794', textAlign: 'center' }}>
        Ajuste les filtres ou verifie qu il existe des missions actives cote backend.
      </Text>
    </View>
  );
}
