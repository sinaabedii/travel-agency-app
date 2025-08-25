import React, { memo, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = memo(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  inputStyle,
  disabled = false,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const sizeStyles = {
      small: { minHeight: 40 },
      medium: { minHeight: 48 },
      large: { minHeight: 56 },
    };

    const variantStyles = {
      default: {
        borderBottomWidth: 1,
        borderBottomColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
      },
      filled: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
      },
      outlined: {
        borderWidth: 1,
        borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
      },
    };

    return {
      flexDirection: 'row',
      alignItems: 'center',
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: error ? theme.colors.error : theme.colors.text,
      marginBottom: theme.spacing.xs,
    };
  };

  const getHelperTextStyle = (isError: boolean): TextStyle => {
    return {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.xs,
      color: isError ? theme.colors.error : theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    };
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing.sm }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: theme.spacing.sm }}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || hint) && (
        <Text style={getHelperTextStyle(!!error)}>
          {error || hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
