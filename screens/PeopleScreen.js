import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Button, FlatList, View, Text, SafeAreaView, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FAB } from '@rneui/themed';
import PeopleContext from "../PeopleContext";

export default function PeopleScreen() {
  const navigation = useNavigation();

  const { people } = useContext(PeopleContext);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <Text>{item.dob}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <FAB
        size='small'
        title='Add Person'
        icon={{
          name: 'add',
          color: 'white',
        }}
        color=""
        style={styles.fab}
        onPress={() => navigation.navigate('AddPerson')}
      />

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  listItem: {
    padding: 20,
    backgroundColor: 'pink',
    borderRadius: 15,
  },
  list: {
    marginVertical: 10,
  },
  fab: {
    // position: 'absolute',
    // right: 50,
    // bottom: 100,
    marginVertical: 32,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
});