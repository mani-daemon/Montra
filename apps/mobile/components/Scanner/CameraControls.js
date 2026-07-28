import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function CameraControls({ onCapture, onPickGallery }) {
  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onPickGallery}>
          <Feather name="image" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterButtonOuter} onPress={onCapture}>
          <View style={styles.shutterButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Feather name="edit-2" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>Tap the shutter to scan receipt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: SIZES.padding,
    zIndex: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(39, 39, 42, 0.8)', // Semi-transparent card
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.text,
  },
  helperText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: SIZES.sm,
  },
});
