import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Input, Button } from '@/components/design-system';
import { ChatMessage, MessageType } from '@/types';

const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Mock initial messages
  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      chatId: 'chat1',
      senderId: 'advisor1',
      receiverId: 'user1',
      message: 'Hello! Welcome to TripGlide support. How can I help you plan your perfect trip today?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      isRead: true,
    },
    {
      id: '2',
      chatId: 'chat1',
      senderId: 'user1',
      receiverId: 'advisor1',
      message: 'Hi! I\'m interested in the Brazil tour. Can you tell me more about the accommodation?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 240000).toISOString(),
      isRead: true,
    },
    {
      id: '3',
      chatId: 'chat1',
      senderId: 'advisor1',
      receiverId: 'user1',
      message: 'Great choice! The Iconic Brazil Adventure includes stays at the luxurious Copacabana Palace Hotel. It features ocean views, world-class amenities, and is perfectly located near the famous Copacabana Beach. Would you like me to check availability for specific dates?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 180000).toISOString(),
      isRead: true,
    },
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId: 'chat1',
      senderId: 'user1',
      receiverId: 'advisor1',
      message: inputMessage.trim(),
      type: MessageType.TEXT,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate advisor response
    setTimeout(() => {
      const advisorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        chatId: 'chat1',
        senderId: 'advisor1',
        receiverId: 'user1',
        message: getAdvisorResponse(inputMessage.trim()),
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
        isRead: true,
      };
      
      setMessages(prev => [...prev, advisorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getAdvisorResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'Our tours are competitively priced and include great value. The Brazil tour starts at $2,850 per person, which includes accommodation, daily breakfast, professional guide, and all entrance fees. Would you like me to send you a detailed pricing breakdown?';
    }
    
    if (lowerMessage.includes('availability') || lowerMessage.includes('dates')) {
      return 'I can check availability for you! Our next Brazil tour departures are March 15th, April 12th, and May 20th. Each tour has limited spots available. Which dates work best for your schedule?';
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
      return 'We offer flexible cancellation policies. You can cancel up to 30 days before departure for a full refund, or up to 14 days for a 50% refund. Travel insurance is also available for additional protection. Would you like more details about our policies?';
    }
    
    if (lowerMessage.includes('group') || lowerMessage.includes('family')) {
      return 'We offer special group discounts for 4+ travelers and have family-friendly tours available. Our Brazil tour accommodates up to 12 people per group. Would you like information about group pricing or family-specific activities?';
    }
    
    return 'Thank you for your question! I\'d be happy to help you with that. Let me get you the most accurate information. Is there anything specific about our tours you\'d like to know more about?';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUserMessage = item.senderId === 'user1';
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.advisorMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isUserMessage ? theme.colors.primary : theme.colors.surface,
            alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUserMessage ? '#FFFFFF' : theme.colors.text }
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isUserMessage ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={[styles.messageContainer, styles.advisorMessageContainer]}>
        <View style={[styles.messageBubble, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
            <View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
            <View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.advisorInfo}>
          <View style={styles.advisorAvatar}>
            <Text style={styles.advisorAvatarText}>👨‍💼</Text>
          </View>
          <View style={styles.advisorDetails}>
            <Text style={[styles.advisorName, { color: theme.colors.text }]}>
              Travel Advisor
            </Text>
            <Text style={[styles.advisorStatus, { color: theme.colors.success }]}>
              • Online
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={{ color: theme.colors.primary }}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={{ color: theme.colors.textSecondary }}>📎</Text>
          </TouchableOpacity>
          
          <Input
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            containerStyle={styles.messageInput}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputMessage.trim() ? theme.colors.primary : theme.colors.border,
              }
            ]}
            onPress={sendMessage}
            disabled={!inputMessage.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Quick Replies */}
      <View style={[styles.quickReplies, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.quickRepliesTitle, { color: theme.colors.textSecondary }]}>
          Quick questions:
        </Text>
        <View style={styles.quickRepliesRow}>
          <TouchableOpacity
            style={[styles.quickReplyButton, { backgroundColor: theme.colors.background }]}
            onPress={() => setInputMessage('What are your cancellation policies?')}
          >
            <Text style={[styles.quickReplyText, { color: theme.colors.text }]}>
              Cancellation policy
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickReplyButton, { backgroundColor: theme.colors.background }]}
            onPress={() => setInputMessage('Do you offer group discounts?')}
          >
            <Text style={[styles.quickReplyText, { color: theme.colors.text }]}>
              Group discounts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  advisorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advisorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  advisorAvatarText: {
    fontSize: 20,
  },
  advisorDetails: {},
  advisorName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  advisorStatus: {
    fontSize: 12,
    fontFamily: 'Instrument Sans',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  advisorMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Instrument Sans',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Instrument Sans',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickReplies: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickRepliesTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  quickRepliesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickReplyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickReplyText: {
    fontSize: 12,
    fontFamily: 'Instrument Sans',
  },
});

export default ChatScreen;
