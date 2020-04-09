import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const styles = StyleSheet.create({
  holder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  loadingImage: {
    height: 153,
    width: 270,
  },
});

const WebHolder = () => (
  <View style={styles.holder}>
    <Image source={require('./webloading.gif')} style={styles.loadingImage} />
  </View>
);

export default WebHolder;
