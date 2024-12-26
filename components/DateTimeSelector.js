import React, { useState } from 'react'
import { Platform, View, Text, StyleSheet, Button } from 'react-native'
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateTimeSelector() {
    const[selectDate, setSelectedDate] =  useState('');
    const [fromTime, setFromTime] = useState(new Date());
    const [toTime, setToTime] = useState(new Date());
    const [showFromTimePicker, setShowFromTimePicker] = useState(false);
    const [showToTimePicker, setShowToTimePicker] = useState(false);

    const onDateChange = (date) => {
        setSelectedDate(date.dateString);
    };

    const onFromTimeChange = (event, selectedTime) => {
        if (event.type === 'set') {  // Check if the user pressed OK
            const currentTime = selectedTime || fromTime;
            setFromTime(currentTime);
        }
        setShowFromTimePicker(false);
    };

    const onToTimeChange = (event, selectedTime) => {
        if (event.type === 'set') {  // Check if the user pressed OK
            const currentTime = selectedTime || toTime;
            setToTime(currentTime);
          }
          setShowToTimePicker(false);

    };
  return (
    <View style = {styles.container}>
        <Calendar
        onDayPress={onDateChange}
        markedDates={{
            [selectDate]: { selected: true },
        }}

        theme={{
            backgroundColor: '#1E1E1E',
            calendarBackground: '#1E1E1E',
            textSectionTitleColor: '#ffffff',
            selectedDayBackgroundColor: '#F5A623',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#F5A623',
            dayTextColor: '#ffffff',
            arrowColor: '#F5A623',
            monthTextColor: '#ffffff',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
        }}
        />

        {/* Digital Time From*/}
        <Text style={styles.label}>From</Text>
        <Text style={styles.digitalTime}>{fromTime.toLocaleTimeString()}</Text>
        <Button title="Chage From Time" onPress={() => setShowFromTimePicker(true)}/>
        
        {showFromTimePicker &&(
            <DateTimePicker
            value={fromTime}
            mode="time"
            display="spinner"
            onChange={onFromTimeChange}
            />
        )}

        {/* Digital Time To*/}
        <Text style={styles.label}>To</Text>
        <Text style={styles.digitalTime}>{toTime.toLocaleTimeString()}</Text>
        <Button title="Chage To Time" onPress={() => setShowToTimePicker(true)}/>

        {showToTimePicker &&(
            <DateTimePicker
            value={toTime}
            mode="time"
            display="spinner"
            onChange={onToTimeChange}
            />
        )}


    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 20,
      },
      label: {
        color: '#F5A623',
        fontSize: 24,
        marginVertical: 10,
      },
      digitalTime: {
        color: '#F5A623',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
      },
})
