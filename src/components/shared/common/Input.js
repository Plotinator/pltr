import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import styles from './InputStyles'
import Colors from '../../../utils/Colors'

const { textGray } = Colors

export default class Input extends Component {
  handleOnChangeText = TextValue => {
    const { onChangeText } = this.props
    onChangeText(TextValue)
  }

  focus = () => this.refs.input.focus()
  
  blur = () => this.refs.input.blur()

  render () {
    const {
      autoCompleteType,
      autoCapitalize,
      placeholder,
      multiline,
      numberOfLines,
      darkMode,
      placeholderTextColor = textGray,
      returnKeyType,
      maxLength,
      style,
      inputStyle,
      keyboardType,
      secureTextEntry,
      selectTextOnFocus,
      value,
      center,
      bordered,
      gray,
      editable,
      onChangeText,
      onSubmitEditing,
      onFocus,
      onBlur,
      textContentType,
      onContentSizeChange,
      autofocus,
      autogrow
    } = this.props

    const inputStyles = [styles.input]
    inputStyles.push(inputStyle)

    const containerStyles = [styles.container]
    if (bordered) containerStyles.push(styles.bordered)
    if (center) inputStyles.push(styles.center)
    if (darkMode) inputStyles.push(styles.darkMode)
    containerStyles.push(style)

    const placeholderText = placeholder || ''

    return (
      <View style={containerStyles}>
        <TextInput
          ref='input'
          autoCapitalize={autoCapitalize}
          autoCompleteType={autoCompleteType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          maxLength={maxLength}
          numberOfLines={numberOfLines}
          placeholderTextColor={placeholderTextColor}
          underlineColorAndroid='transparent'
          placeholder={placeholderText}
          editable={editable}
          style={inputStyles}
          selectTextOnFocus={selectTextOnFocus}
          keyboardType={keyboardType}
          onSubmitEditing={onSubmitEditing}
          value={value}
          onBlur={onBlur}
          onChangeText={this.handleOnChangeText}
          returnKeyType={returnKeyType}
          onFocus={onFocus}
          textContentType={textContentType}
          onContentSizeChange={onContentSizeChange}
          autofocus={autofocus}
          autogrow={autogrow}
        />
      </View>
    )
  }
}
