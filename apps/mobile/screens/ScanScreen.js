import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
      Alert.alert(
        "✨ AI Analysis Complete",
        "Store: Walmart\nDate: Today\nTotal Amount: $42.50\nCategory: Grocery",
        [{ text: "Save Transaction", onPress: () => setImage(null) }]
      );
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
            <Ionicons name="document-text-outline" size={60} color="#7F3DFF" />
            <Text style={styles.placeholderText}>No receipt selected</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
          <Ionicons name="images-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity 
            style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
            onPress={analyzeReceipt}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>Analyze with AI</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090E', paddingTop: 60, paddingHorizontal: 20 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#8F90A6', fontSize: 14, marginTop: 6, marginBottom: 24 },
  uploadCard: {
    height: 320,
    backgroundColor: '#1E1E2D',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2D2D3D',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderBox: { alignItems: 'center' },
  placeholderText: { color: '#8F90A6', fontSize: 15, marginTop: 12 },
  actionsContainer: { gap: 12 },
  secondaryButton: {
    backgroundColor: '#2D2D3D',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#7F3DFF',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});