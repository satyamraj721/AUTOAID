import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import * as Location from 'expo-location'; // Assuming Expo for this example

interface SOSButtonProps {
  onSOSTriggered: (booking: any) => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onSOSTriggered }) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      // 1. Get Location
      // const { coords } = await Location.getCurrentPositionAsync({});
      
      // 2. Call API
      // const response = await api.post('/bookings/sos', {
      //   lat: coords.latitude,
      //   lng: coords.longitude
      // });

      // Mock Response
      setTimeout(() => {
        Alert.alert("SOS Sent", "Searching for nearest mechanics...");
        onSOSTriggered({ id: '123', status: 'SEARCHING' });
        setLoading(false);
      }, 1500);

    } catch (error) {
      Alert.alert("Error", "Failed to trigger SOS");
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading}
      className="bg-red-600 h-48 w-48 rounded-full items-center justify-center shadow-xl border-4 border-red-400"
    >
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <View className="items-center">
          <Text className="text-white text-4xl font-extrabold">SOS</Text>
          <Text className="text-white text-sm mt-2 font-medium">TAP FOR HELP</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
