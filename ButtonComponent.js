import React, {Component} from 'react';
import {Button, View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

export default function ButtonComponent() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route.name;
  return (
    <View style={styles.buttonGroup}>
      <View style={styles.buttonleft}>
        {/* <TouchableOpacity
          title="Basmati"
          onPress={() => {
            navigation.navigate('Basmati');
          }}
          style={
            currentRouteName == 'Nonbasmati'
              ? styles.nonbasmatiButtonStyle
              : styles.basmatiButtonStyle
          }>
          <Text style={styles.buttonText}>Basmati</Text>
        </TouchableOpacity> */}
        <View style={{alignSelf: 'flex-end'}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 28,
              marginTop: 10,
            }}>
            {currentRouteName == 'Nonbasmati' ? 'Non Basmati' : 'Basmati'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRight}>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Nonbasmati');
          }}
          title="Non Basmati"
          style={
            currentRouteName == 'Nonbasmati'
              ? styles.nonbasmatiButtonStyle
              : styles.basmatiButtonStyle
          }>
          <Text style={styles.buttonText}>Non Basmati</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            console.log('hhhuj');
            currentRouteName == 'Nonbasmati'
              ? navigation.navigate('Basmati')
              : navigation.navigate('Nonbasmati');
          }}
          style={{
            maxHeight: 40,
            alignItems: 'flex-end',
            padding: 10,
          }}>
          <Image
            style={{
              width: '10%',
              resizeMode: 'stretch',
              height: '100%',
              padding: 15,
              borderRadius: 5,
              borderWidth: 2,
            }}
            source={require('./images/2.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = {
  basmatiButtonStyle: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#019340',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#019340',
  },
  nonbasmatiButtonStyle: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#bd9f5f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#019340',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonleft: {
    width: '35%',
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonRight: {
    width: '35%',
    marginRight: -70,
  },
};
