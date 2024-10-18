import React from 'react';
import { Button } from '@rneui/themed';
import { StyleSheet, Text } from 'react-native';
import colors from '../assets/colors';



const CustomBtn = ({ onPress, title, color, }) => {
  
    return (
      <Button
      title={title}
      titleStyle={styles.title}
      containerStyle={styles.btnContainer}
      onPress={onPress}
      color={color}
      radius= 'lg'
      />
    )

  }


  const styles = StyleSheet.create({
    title: {
      marginVertical: 2,
      color: 'white',
    },
    btnContainer: {
      marginVertical: 8,
      marginHorizontal: 16,
    }
    
  });

  export default CustomBtn;