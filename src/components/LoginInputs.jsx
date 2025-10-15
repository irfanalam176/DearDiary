import { View, Text,TextInput } from 'react-native'
import React from 'react'
import { style } from '../style/style'

const LoginInputs = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <View style={{width:"100%",alignItems:"center"}}>
       <TextInput
        style={style.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

export default LoginInputs