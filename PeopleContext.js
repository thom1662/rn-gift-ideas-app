import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

//provide the people list from context obj
export const PeopleProvider = ({ children }) => {
  //context is accessible by all child elements (this wraps all the pages in navigator)
  const [people, setPeople] = useState([]);

  const STORAGE_KEY = 'people'; //name of the list

  // Load people from AsyncStorage
  useEffect(() => {
    const loadPeople = async () => {
      const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));
    };
    loadPeople();
    console.log(people);
  }, []);

  const addPerson = async (name, dob) => {
    const newPerson = {
      id: randomUUID(),
      name,
      dob,
      ideas: [],
    };
    const updatedPeople = [...people, newPerson];
    console.log(updatedPeople);
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const deletePerson = async (id) => {
    //console.log(`delete this id: ${id}`);
    const updatedPeople = people.filter((person) => person.id !== id);
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };


  return <PeopleContext.Provider value={{ people, addPerson, deletePerson }}>{children}</PeopleContext.Provider>;
};

export default PeopleContext;
