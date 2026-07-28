import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

import ScanningOverlay from '../components/Scanner/ScanningOverlay';
import CameraControls from '../components/Scanner/CameraControls';
import ReceiptReviewModal from '../components/Scanner/ReceiptReviewModal';
import { COLORS, SIZES } from '../constants/theme';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [flash, setFlash] = useState('off');
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionIconWrapper}>
          <Feather name="camera-off" size={40} color={COLORS.danger} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          Montra needs access to your camera to scan receipts and invoices automatically.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        setIsReviewing(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const handleGalleryPick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setIsReviewing(true);
    }
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        flash={flash}
        facing="back"
      >
        {/* Top Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
            <Feather 
              name={flash === 'on' ? 'zap' : 'zap-off'} 
              size={20} 
              color={flash === 'on' ? COLORS.primaryLight : COLORS.text} 
            />
          </TouchableOpacity>
          <View style={styles.modePill}>
            <Text style={styles.modeText}>Single Receipt</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name="help-circle" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Reanimated Overlay & Viewfinder */}
        <ScanningOverlay />

        {/* Bottom Shutter & Controls */}
        <CameraControls 
          onCapture={handleCapture}
          onPickGallery={handleGalleryPick}
        />
      </CameraView>

      {/* Review & Edit Modal */}
      <ReceiptReviewModal
        visible={isReviewing}
        imageUri={capturedImage}
        onClose={() => {
          setIsReviewing(false);
          setCapturedImage(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  camera: {
    flex: 1,
  },
  headerControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(39, 39, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modePill: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeText: {
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  permissionIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  permissionMessage: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
  },
  permissionButtonText: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: 'bold',
  },
});