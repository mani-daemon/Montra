import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AssistantScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "Hello Mani! 👋 I'm your Montra Financial Assistant. Ask me anything about your balance, spending habits, or budget goals.",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // پیشنهادهای آماده برای پرسش سریع
  const quickPrompts = [
    "📊 How much did I spend this week?",
    "💡 Give me 3 tips to save money",
    "☕ Show my coffee expenses",
  ];

  const handleSend = (textToSend) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    // ۱. اضافه کردن پیام کاربر
    const userMsg = { id: Date.now().toString(), sender: 'user', text: messageContent };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // ۲. شبیه‌سازی پاسخ هوش مصنوعی
    setTimeout(() => {
      let aiResponseText = "I analyzed your recent transactions. You spent $125 on groceries and $15 on coffee this week. You're well within your $500 monthly budget!";
      
      if (messageContent.includes("tips") || messageContent.includes("save")) {
        aiResponseText = "💡 Here are 3 quick tips:\n1. Limit food delivery to twice a week.\n2. Review your recurring app subscriptions.\n3. Transfer 10% of income to savings automatically.";
      }

      const aiMsg = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color="#7F3DFF" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.headerTitle}>Montra AI Advisor</Text>
          <Text style={styles.headerSubtitle}>Powered by Financial Vision AI</Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble, 
            item.sender === 'user' ? styles.userBubble : styles.aiBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
            ]}>
              {item.text}
            </Text>
          </View>
        )}
        ListFooterComponent={
          isTyping ? (
            <View style={[styles.messageBubble, styles.aiBubble, { width: 80 }]}>
              <ActivityIndicator color="#7F3DFF" size="small" />
            </View>
          ) : null
        }
      />

      {/* Quick Prompts */}
      <View style={styles.promptsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={quickPrompts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.promptChip} onPress={() => handleSend(item)}>
              <Text style={styles.promptText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Montra AI..."
          placeholderTextColor="#8F90A6"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090E',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E2D',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#8F90A6',
    fontSize: 12,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
  },
  aiBubble: {
    backgroundColor: '#1E1E2D',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  userBubble: {
    backgroundColor: '#7F3DFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  promptsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  promptChip: {
    backgroundColor: '#1E1E2D',
    borderColor: '#2D2D3D',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  promptText: {
    color: '#8F90A6',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#13131A',
    borderTopWidth: 1,
    borderTopColor: '#2D2D3D',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E2D',
    color: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#7F3DFF',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});