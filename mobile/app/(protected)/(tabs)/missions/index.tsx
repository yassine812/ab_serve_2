import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Button, Searchbar, Text } from 'react-native-paper';

import { MissionCard } from '../../../../src/components/missions/MissionCard';
import { MissionEmptyState } from '../../../../src/components/missions/MissionEmptyState';
import { MissionFiltersSheet } from '../../../../src/components/missions/MissionFiltersSheet';
import { useMissionMetaQuery, useMissionsQuery } from '../../../../src/hooks/useMissionsQuery';

export default function MissionsScreen() {
  const [search, setSearch] = useState('');
  const [referenceFilter, setReferenceFilter] = useState<string | undefined>(undefined);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filters = useMemo(
    () => ({
      mine: '1',
      search: search.trim() || undefined,
      reference: referenceFilter,
    }),
    [referenceFilter, search],
  );

  const missionsQuery = useMissionsQuery(filters);
  const metaQuery = useMissionMetaQuery({ mine: '1' });

  if (missionsQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6F8' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8', paddingHorizontal: 16, paddingTop: 16 }}>
      <Text variant="headlineSmall">Mes missions</Text>
      <Text variant="bodyMedium" style={{ marginTop: 4, marginBottom: 12, color: '#52606D' }}>
        Consulte les missions actives, filtre rapidement et ouvre le detail terrain.
      </Text>

      <Searchbar
        placeholder="Code, intitule, reference"
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 12 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Button mode="outlined" onPress={() => setFiltersVisible(true)}>
          Filtres
        </Button>
        <Text variant="labelMedium" style={{ color: '#52606D' }}>
          {metaQuery.data?.counts.active ?? missionsQuery.data?.count ?? 0} actives
        </Text>
      </View>

      <FlatList
        data={missionsQuery.data?.results ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 12, paddingBottom: 24, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={missionsQuery.isRefetching} onRefresh={missionsQuery.refetch} />
        }
        renderItem={({ item }) => (
          <MissionCard
            mission={item}
            onPress={() => router.push(`/(protected)/missions/${item.id}`)}
          />
        )}
        ListEmptyComponent={<MissionEmptyState />}
      />

      <MissionFiltersSheet
        visible={filtersVisible}
        references={metaQuery.data?.references ?? []}
        currentReference={referenceFilter}
        onDismiss={() => setFiltersVisible(false)}
        onApply={(nextReference) => {
          setReferenceFilter(nextReference);
          setFiltersVisible(false);
        }}
        onReset={() => {
          setReferenceFilter(undefined);
          setFiltersVisible(false);
        }}
      />
    </View>
  );
}
