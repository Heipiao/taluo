// ProfileTab.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileTab: React.FC = () => {
  return (
    <View style={styles.tabContainer}>
      <Text>我的 Tab</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileTab;
