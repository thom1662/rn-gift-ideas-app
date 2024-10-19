import React from 'react';
import { Button } from '@rneui/themed';
import { StyleSheet, Text } from 'react-native';
import colors from '../assets/colors';



const CustomBtn = ({ onPress, title, outlined }) => {
  
    return (
      <Button
      title={title}
      titleStyle={styles.title}
      containerStyle={styles.btnContainer}
      onPress={onPress}
      color= {colors.btnPrimary}
      type={outlined ? 'outline' : 'solid'}
      radius= 'lg'
      buttonStyle={ outlined? { borderColor: colors.btnPrimary, borderWidth: 2, backgroundColor: '#fff' } : {} }
      />
    )

  }


  const styles = StyleSheet.create({
    title: {
      marginVertical: 2,
      fontWeight: '500',
    },
    btnContainer: { 
      marginVertical: 6,
      marginHorizontal: 16,
    }
    
  });

  export default CustomBtn;