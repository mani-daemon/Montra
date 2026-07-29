import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function LoadingOverlay({ visible, message = "Loading..." }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          {message ? <Text style={styles.text}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    minWidth: 150,
  },
  text: {
    marginTop: 12,
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
});
