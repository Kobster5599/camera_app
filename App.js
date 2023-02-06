import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Image, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Feather from '@expo/vector-icons/Feather';



export default function App() {

  const [ cameraType, setCameraType ] = useState(CameraType.front);
  const [ camera, setCamera ] = useState(null);
  const [ flashMode, setFlashMode ] = useState(Camera.Constants.FlashMode.off);
  const [ hasCameraPermission, setHasCameraPermission ] = useState(null);
  const [ image, setImage ] = useState(null);
  const cameraRef = useRef(null);


  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    console.log("In takePicture");
    if(cameraRef) {
      console.log("...with cameraRef");
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }

  };

  const savePicture = async () => {
    console.log('saving picure');
    if (image) {
  
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert('Picture saved! 🎉');
        setImage(null);
        console.log('saved successfully');
      } catch (error) {
        console.log(error);
      }
    }
  };

  if(hasCameraPermission === false) {
    return (
      <Text>No Camera Permissions</Text>
    );
  }


  if(!image) {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          flashMode={flashMode}
        >
        </Camera>
        <View style={styles.controlContainer}>
        <Pressable onPress={takePicture}>
          <Feather name= 'camera' style={styles.cameraButton} size= {32} color= 'white'/>
        </Pressable>
      </View>
        </View>
        
    );
  } else {
    return(
      <View style={styles.container}>
        <Image source={{uri: image}} style={styles.camera} />
        <View style={styles.controlContainer}>
          <Pressable onPress={savePicture}>
            <Text style={styles.ctlText}>Save Image</Text>
          </Pressable>
          <Pressable onPress={() => setImage(null)}>
            <Text style={styles.ctlText}>Discard Image</Text>
          </Pressable>
        </View>
      </View>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
    aspectRatio: 3/4,
  },

  cameraButton: {

  },

  ctlText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },

  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 12
  }
});