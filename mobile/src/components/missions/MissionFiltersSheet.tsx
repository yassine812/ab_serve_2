import { ScrollView, View } from 'react-native';
import { Button, Chip, Modal, Portal, Text } from 'react-native-paper';

type MissionFiltersSheetProps = {
  visible: boolean;
  references: string[];
  currentReference?: string;
  onDismiss: () => void;
  onApply: (reference?: string) => void;
  onReset: () => void;
};

export function MissionFiltersSheet({
  visible,
  references,
  currentReference,
  onDismiss,
  onApply,
  onReset,
}: MissionFiltersSheetProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          margin: 16,
          borderRadius: 24,
          padding: 20,
          maxHeight: '75%',
        }}
      >
        <Text variant="titleMedium">Filtres missions</Text>
        <Text variant="bodySmall" style={{ marginTop: 6, color: '#7B8794' }}>
          Filtre par reference sans surcharger l interface terrain.
        </Text>

        <Text variant="labelLarge" style={{ marginTop: 18, marginBottom: 10 }}>
          Reference
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip selected={!currentReference} onPress={() => onApply(undefined)}>
              Toutes
            </Chip>
            {references.map((reference) => (
              <Chip
                key={reference}
                selected={currentReference === reference}
                onPress={() => onApply(reference)}
              >
                {reference}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
          <Button onPress={onReset}>Reinitialiser</Button>
          <Button mode="contained" onPress={onDismiss}>
            Fermer
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
