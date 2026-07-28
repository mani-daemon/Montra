import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export default function InsightModal({ visible, onClose, title, message, actions }) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Feather name="sparkles" size={28} color={COLORS.primaryLight} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.actionsContainer}>
            {actions ? (
              actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.button, action.primary ? styles.primaryButton : styles.secondaryButton]}
                  onPress={() => {
                    if (action.onPress) action.onPress();
                    onClose();
                  }}
                >
                  <Text style={[styles.buttonText, action.primary ? styles.primaryText : styles.secondaryText]}>
                    {action.text}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onClose}>
                <Text style={[styles.buttonText, styles.primaryText]}>Got it</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.padding,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardAlt,
  },
  iconContainer: {
    backgroundColor: COLORS.primaryBg,
    padding: 16,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.cardAlt,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: SIZES.md,
  },
  primaryText: {
    color: COLORS.text,
  },
  secondaryText: {
    color: COLORS.text,
  },
});
