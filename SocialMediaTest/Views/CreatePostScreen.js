import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../Controllers/PostController'; 
import { auth } from '../firebaseConfig'; 

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handlePost = async () => {
    if (text.trim() === '') {
      Alert.alert('Error', 'Post cannot be empty');
      return;
    }

    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not authenticated");

      const result = await createPost(uid, text, image);

      if (result.success) {
        Alert.alert('Posted!', 'Your post has been created.');
        setText('');
        setImage(null);
      } else {
        Alert.alert('Error', result.error || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }

    setLoading(false);
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
        editable={!loading}
      />

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <TouchableOpacity onPress={pickImage} style={styles.pickButton} disabled={loading}>
        <Text style={styles.pickText}>{loading ? 'Uploading...' : 'Pick Image'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePost} style={styles.postButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postText}>Post</Text>
        )}
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
