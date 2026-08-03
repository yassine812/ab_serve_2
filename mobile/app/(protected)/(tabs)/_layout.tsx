import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0B5FFF',
        tabBarInactiveTintColor: '#7B8794',
        tabBarStyle: {
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen name="missions" options={{ title: 'Missions' }} />
      <Tabs.Screen name="validations" options={{ title: 'Validations' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
