import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { style } from '../style/style';
import { useFocusEffect } from '@react-navigation/native';
import { DiaryRepository } from '../database.service';
import useDelete from '../hooks/useDelete';

const Events = ({ navigation, route }) => {
  const { category, page } = route.params;
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchText, setSearchText] = useState('');

  async function getNotes() {
    try {
      const response = await DiaryRepository.getEventsEntries();
      if (response.length > 0) {
        setNotes(response);
        setFilteredNotes(response);
      } else {
        setNotes([]);
        setFilteredNotes([]);
      }
    } catch (e) {
      console.log('Cannot get Entries' + e);
    }
  }

  async function deleteNote(id) {
    try {
      const response = await DiaryRepository.deleteEventsEntry(id);
      if (response.rowsAffected > 0) {
        getNotes();
      }
      await useDelete(id,"events")
    } catch (e) {
      console.log('Cannot delete Entry' + e);
    }
  }

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter((note) =>
        note.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getNotes();
    }, [])
  );

  const colors = ['#C8FAD6', '#C7F4F6', '#C9E2FF', '#ffadadff'];

  return (
    <ImageBackground
      source={require('../assets/images/home.png')}
      style={{ width: '100%', height: '100%' }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={style.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={style.headerText}>{page}</Text>
        </View>

        <View style={{ paddingHorizontal: 25 }}>
          <TouchableOpacity
            style={style.newDiaryCard}
            onPress={() =>
              navigation.navigate('writeEvent', { category: category })
            }
          >
            <Text style={style.newDiaryText}>Write a New diary..</Text>
            <Image
              source={require('../assets/images/writeText.png')}
              style={style.diaryIcon}
            />
          </TouchableOpacity>

          {/* Search Box */}
          <View style={style.searchBox}>
            <TextInput
              placeholder="Search"
              style={style.searchInput}
              placeholderTextColor={'gray'}
              value={searchText}
              onChangeText={handleSearch}
            />
            <Ionicons name="search" size={20} color="#666" />
          </View>

          <Text style={style.sectionTitle}>Recents</Text>
          {filteredNotes.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                style.recentCard,
                { backgroundColor: colors[idx % colors.length] },
              ]}
              onPress={() => {
                setSelectedNoteId(null);
                navigation.navigate('viewEvent', {
                  id: item.id,
                  noteTitle: item.title,
                  content: item.content,
                  noteDate:item.date
                });
              }}
              onLongPress={() => setSelectedNoteId(item.id)}
            >
              <Image
                source={require('../assets/images/flower2.png')}
                style={style.recentIcon}
              />
              <View style={{ marginRight: 'auto' }}>
                <Text style={style.recentText}>{item.title}</Text>
                <Text style={style.recentText}>{item.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="black" />

              {selectedNoteId == item.id && (
                <TouchableOpacity
                  style={style.deleteNoteBtn}
                  onPress={() => deleteNote(item.id)}
                >
                  <Ionicons name="trash" size={30} color="white" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Events;
