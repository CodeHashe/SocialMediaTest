import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (text.trim() === '') {
      Alert.alert('Error', 'Post cannot be empty');
      return;
    }

    // TODO: Upload to Firestore
    Alert.alert('Posted!', 'Your post has been created.');
    setText('');
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Post</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="What's on your mind?"
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
      />

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
        <Text style={styles.pickText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePost} style={styles.postButton}>
        <Text style={styles.postText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  title: {
    fontFamily: 'Altone-Bold',
    fontSize: 24,
    marginBottom: 16,
    color: '#333',
  },
  input: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlignVertical: 'top',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  pickButton: {
    backgroundColor: '#00BFA6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  pickText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  postButton: {
    backgroundColor: '#4ad9c1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
});
