import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCreateTransaction } from '../services/queries';
import { CATEGORIES } from '../constants/categories';
import { COLORS, SIZES } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';

export default function AddTransactionModal({ visible, onClose }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const { currency } = useCurrency();
  
  const createTxMutation = useCreateTransaction();

  const handleSubmit = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in both title and amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    createTxMutation.mutate(
      {
        title: title.trim(),
        amount: parsedAmount,
        type: type,
        category: category,
      },
      {
        onSuccess: () => {
          // Reset form
          setTitle('');
          setAmount('');
          setType('expense');
          setCategory(CATEGORIES[0].label);

          onClose(); // Close modal
        },
        onError: () => {
          Alert.alert('Error', 'Failed to save transaction. Please try again.');
        },
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Type Selector (Income / Expense) */}
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.expenseActive]}
              onPress={() => setType('expense')}
            >
              <Feather
                name="arrow-up-right"
                size={18}
                color={type === 'expense' ? COLORS.text : COLORS.textSecondary}
              />
              <Text style={[styles.typeText, type === 'expense' && styles.activeText]}>
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.incomeActive]}
              onPress={() => setType('income')}
            >
              <Feather
                name="arrow-down-left"
                size={18}
                color={type === 'income' ? COLORS.text : COLORS.textSecondary}
              />
              <Text style={[styles.typeText, type === 'income' && styles.activeText]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Grocery Shopping"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          {/* Amount Input */}
          <Text style={styles.label}>Amount ({currency.symbol})</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Category Selector */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.label && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat.label)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.label && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={createTxMutation.isPending}
          >
            {createTxMutation.isPending ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.submitButtonText}>Save Transaction</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.cardAlt,
    padding: 8,
    borderRadius: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardAlt,
    borderRadius: SIZES.radius,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  expenseActive: {
    backgroundColor: COLORS.danger,
  },
  incomeActive: {
    backgroundColor: COLORS.success,
  },
  typeText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.text,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.cardAlt,
    color: COLORS.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: SIZES.md,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  categoryChip: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  categoryTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: 'bold',
  },
});