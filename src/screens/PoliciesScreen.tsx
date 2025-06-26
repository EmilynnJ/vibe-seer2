import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';

const policies = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'January 15, 2024',
    content: `
## Information We Collect

We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

### Personal Information
- Name and contact information
- Payment information
- Communication preferences
- Reading history and preferences

### Usage Information
- Device information
- Log files and usage statistics
- Location information (with permission)

## How We Use Your Information

We use the information we collect to:
- Provide and improve our services
- Process payments and transactions
- Send you updates and promotional content
- Provide customer support
- Ensure security and prevent fraud

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties except:
- With your consent
- To service providers who help us operate our business
- When required by law
- To protect our rights and safety

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your account and data
- Opt-out of marketing communications

## Contact Us

If you have questions about this Privacy Policy, please contact us at privacy@psychicconnect.com.
    `
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'January 15, 2024',
    content: `
## Acceptance of Terms

By accessing and using Psychic Connect, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily access Psychic Connect for personal, non-commercial transitory viewing only.

### This license shall not permit you to:
- Modify or copy the materials
- Use the materials for commercial purposes
- Remove copyright or proprietary notations
- Transfer materials to another person

## Service Description

Psychic Connect provides a platform for users to connect with psychic readers for entertainment and guidance purposes.

### Our services include:
- Psychic readings via chat, phone, or video
- Live streaming sessions
- Community forums
- Digital and physical products

## User Responsibilities

Users are responsible for:
- Maintaining account security
- Providing accurate information
- Using services respectfully
- Complying with all applicable laws

## Payment Terms

- All readings are charged per minute
- Payments are processed securely
- Refunds are subject to our refund policy
- Users must be 18+ to make purchases

## Disclaimer

Psychic readings are for entertainment purposes only. We do not guarantee specific outcomes or results.

## Limitation of Liability

Psychic Connect shall not be liable for any damages arising from the use of our services.

## Contact Us

For questions about these Terms, contact us at legal@psychicconnect.com.
    `
  },
  eula: {
    title: 'End User License Agreement',
    lastUpdated: 'January 15, 2024',
    content: `
## License Grant

Subject to the terms of this EULA, we grant you a limited, non-exclusive, non-transferable license to use the Psychic Connect mobile application.

## Restrictions

You may not:
- Reverse engineer, decompile, or disassemble the application
- Create derivative works
- Distribute, rent, lease, or sublicense the application
- Use the application for illegal purposes

## Intellectual Property

All intellectual property rights in the application belong to Psychic Connect or its licensors.

## Updates and Modifications

We may update the application from time to time. These updates may be automatically downloaded and installed.

## Termination

This license is effective until terminated. We may terminate your license immediately if you breach any terms.

## Warranty Disclaimer

The application is provided "as is" without warranty of any kind.

## Support

For technical support, please contact support@psychicconnect.com.

## Governing Law

This EULA is governed by the laws of the jurisdiction where Psychic Connect is based.
    `
  }
};

export default function PoliciesScreen() {
  const [selectedPolicy, setSelectedPolicy] = useState<keyof typeof policies>('privacy');

  const currentPolicy = policies[selectedPolicy];

  const renderContent = (content: string) => {
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => {
      if (section.startsWith('## ')) {
        return (
          <Text key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {section.replace('## ', '')}
          </Text>
        );
      } else if (section.startsWith('### ')) {
        return (
          <Text key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {section.replace('### ', '')}
          </Text>
        );
      } else if (section.startsWith('- ')) {
        const items = section.split('\n').filter(item => item.startsWith('- '));
        return (
          <View key={index} className="ml-4 mb-3">
            {items.map((item, itemIndex) => (
              <Text key={itemIndex} className="text-gray-700 mb-1 leading-6">
                • {item.replace('- ', '')}
              </Text>
            ))}
          </View>
        );
      } else {
        return (
          <Text key={index} className="text-gray-700 mb-4 leading-6">
            {section.trim()}
          </Text>
        );
      }
    });
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
      {/* Policy Selection */}
      <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(policies).map(([key, policy]) => (
            <Pressable
              key={key}
              onPress={() => setSelectedPolicy(key as keyof typeof policies)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedPolicy === key
                  ? 'bg-blue-600'
                  : 'bg-white border border-gray-300'
              }`}
            >
              <Text className={`font-medium ${
                selectedPolicy === key ? 'text-white' : 'text-gray-700'
              }`}>
                {policy.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">{currentPolicy.title}</Text>
          <Text className="text-gray-600 mt-2">Last updated: {currentPolicy.lastUpdated}</Text>
        </View>

        {/* Content */}
        <View className="px-4 py-6">
          {renderContent(currentPolicy.content)}
        </View>

        {/* Contact Information */}
        <View className="px-4 py-6 bg-gray-50 mx-4 mb-8 rounded-xl">
          <View className="flex-row items-center mb-3">
            <Ionicons name="mail" size={20} color="#666" />
            <Text className="ml-3 text-gray-700 font-medium">Questions about our policies?</Text>
          </View>
          <Text className="text-gray-600 mb-4">
            If you have any questions about our policies, please don't hesitate to contact us.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={16} color="#8B5CF6" />
              <Text className="ml-2 text-purple-600">legal@psychicconnect.com</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={16} color="#8B5CF6" />
              <Text className="ml-2 text-purple-600">1-800-PSYCHIC</Text>
            </View>
          </View>
        </View>

        {/* Agreement Statement */}
        <View className="px-4 py-6 bg-blue-50 mx-4 mb-8 rounded-xl">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="font-medium text-blue-900 mb-2">Important Notice</Text>
              <Text className="text-blue-800 text-sm leading-5">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these policies.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}