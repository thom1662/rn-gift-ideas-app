import React from 'react'
import { Dialog } from '@rneui/base';
import { Button, StyleSheet, Text, } from 'react-native';



const CustomDialog = ({ visible, title, message, onClose }) => {
  return (
    <Dialog isVisible={visible} overlayStyle={styles.modal}>
      <Dialog.Title title={title} />
      <Text>{message}</Text>
      <Dialog.Actions>
        <Button title='Close' onPress={onClose}/>

      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default CustomDialog;