import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import InsightModal from '../components/InsightModal';
import { COLORS, SIZES } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';

export default function ScanScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insightVisible, setInsightVisible] = useState(false);
  const { currency } = useCurrency();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeReceipt = () => {
    if (!image) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setInsightVisible(true);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>AI Receipt Scanner</Text>
      <Text style={styles.subtitle}>Upload or scan a receipt to extract expenses automatically</Text>

      <View style={styles.uploadCard}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderBox}>
            <Feather name="file-text" size={60} color={COLORS.primaryLight} />
            <Text style={styles.placeholderText}>No receipt selected</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
          <Feather name="image" size={20} color={COLORS.text} style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity 
            style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
            onPress={analyzeReceipt}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <>
                <Feather name="cpu" size={20} color={COLORS.text} style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>Analyze with AI</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <InsightModal
        visible={insightVisible}
        onClose={() => setInsightVisible(false)}
        title="✨ AI Analysis Complete"
        message={`Store: Walmart\nDate: Today\nTotal Amount: ${currency.symbol}42.50\nCategory: Grocery`}
        actions={[
          {
            text: 'Save Transaction',
            primary: true,
            onPress: () => setImage(null),
          },
          {
            text: 'Cancel',
            primary: false,
            onPress: () => {},
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 60, paddingHorizontal: 20 },
  headerTitle: { color: COLORS.text, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, marginTop: 6, marginBottom: 24 },
  uploadCard: {
    height: 320,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderBox: { alignItems: 'center' },
  placeholderText: { color: COLORS.textSecondary, fontSize: 15, marginTop: 12 },
  actionsContainer: { gap: 12 },
  secondaryButton: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
});