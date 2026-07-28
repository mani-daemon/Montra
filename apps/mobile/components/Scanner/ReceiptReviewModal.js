import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  Image, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCreateTransaction } from '../../services/queries';
import { uploadReceipt } from '../../services/api';
import { CATEGORIES } from '../../constants/categories';
import { COLORS, SIZES } from '../../constants/theme';
import { useCurrency } from '../../context/CurrencyContext';

export default function ReceiptReviewModal({ visible, imageUri, onClose }) {
  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [confidence, setConfidence] = useState(100);
  const [category, setCategory] = useState(CATEGORIES[1].label); // Default to Food for demo
  const { currency } = useCurrency();
  const createTxMutation = useCreateTransaction();

  // Call real AI API
  useEffect(() => {
    let mounted = true;
    
    const analyzeImage = async () => {
      if (!imageUri) return;
      
      setLoading(true);
      try {
        const result = await uploadReceipt(imageUri);
        if (mounted) {
          setMerchant(result.merchant_name || result.title);
          setAmount(String(result.total_amount || result.amount));
          setConfidence(result.confidence || 100);
          if (result.category) setCategory(result.category);
        }
      } catch (error) {
        if (mounted) {
          console.error("OCR Error:", error);
          // Fallback if AI fails so user can still manually enter
          setMerchant('');
          setAmount('');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (visible && imageUri) {
      analyzeImage();
    }
    
    return () => {
      mounted = false;
    };
  }, [visible, imageUri]);

  const handleSave = () => {
    if (!merchant || !amount) return;

    createTxMutation.mutate(
      {
        title: merchant,
        amount: parseFloat(amount),
        type: 'expense',
        category: category,
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Review Receipt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Receipt Preview */}
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          )}

          {/* Form Fields or Loading */}
          <View style={styles.formContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>AI is analyzing receipt...</Text>
                <Text style={styles.loadingSubtext}>Extracting merchant and amount</Text>
              </View>
            ) : (
              <>
                {confidence < 80 && (
                  <View style={styles.warningBox}>
                    <Feather name="alert-triangle" size={20} color="#FDB623" />
                    <Text style={styles.warningText}>Low confidence scan. Please verify the extracted values.</Text>
                  </View>
                )}
                
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Merchant</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.input} 
                      value={merchant} 
                      onChangeText={setMerchant}
                    />
                    <Feather name="alert-circle" size={16} color={COLORS.warning} />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Total Amount ({currency.symbol})</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.input} 
                      value={amount} 
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.input}>{category}</Text>
                    <Feather name="chevron-down" size={20} color={COLORS.textSecondary} />
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSave}
                  disabled={createTxMutation.isPending}
                >
                  {createTxMutation.isPending ? (
                    <ActivityIndicator color={COLORS.text} />
                  ) : (
                    <Text style={styles.saveButtonText}>Confirm & Save</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardAlt,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  imageContainer: {
    height: 180,
    backgroundColor: COLORS.background,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardAlt,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    padding: SIZES.padding,
    paddingTop: 0,
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: 'bold',
    marginTop: 16,
  },
  loadingSubtext: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 4,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(253, 182, 35, 0.1)',
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(253, 182, 35, 0.3)',
  },
  warningText: {
    color: '#FDB623',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardAlt,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.md,
    paddingVertical: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: 'bold',
  },
});
