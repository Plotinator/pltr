import React, { Component } from 'react'
import { View } from 'react-native'
import styles from './RichEditorStyles'
import Colors from '../../../utils/Colors'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { moderateScale } from 'react-native-size-matters';
import Text from './Text'

export default class RichTextEditor extends Component {

  getEditor = () => this.richText

  setEditor = ref => this.richText = ref

  handleEditorInitialized = () => {
    //
  }

  renderTitleIcons = title => ({ tintColor }) => (
    <Text fontSize={16} fontStyle={'bold'} color={tintColor}>{title}</Text>
  )

  render () {
    const {
      style,
      value,
      onFocus,
      onChange,
      placeholder,
      editorStyle,
      toolbarStyle,
      initialHTMLText
    } = this.props

    const containerStyles = [styles.editorContainer]
    containerStyles.push(style)

    const toolbarStyles = [styles.richToolbar]
    toolbarStyles.push(toolbarStyle)

    const editorStyles = [styles.richEditor]
    editorStyles.push(editorStyle)

    const placeholderText = placeholder || ''
    const initialText = typeof initialHTMLText == 'object' ? '' : initialHTMLText
    return (
      <View style={containerStyles}>
        <RichEditor
          pasteAsPlainText
          ref={this.setEditor}
          style={editorStyles}
          editorStyle={{ color: Colors.darkGray }}
          placeholder={placeholderText}
          onFocus={onFocus}
          initialContentHTML={initialText}
          onChange={onChange}
          editorInitializedCallback={this.handleEditorInitialized}
        />
        <RichToolbar
          style={toolbarStyles}
          iconSize={moderateScale(20)}
          iconMap={{
            heading2: this.renderTitleIcons('H1'),
            heading3: this.renderTitleIcons('H3'),
          }}
          editor={this.richText}
          getEditor={this.getEditor}
          selectedIconTint={Colors.orange}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            // actions.alignLeft,
            // actions.alignCenter,
            // actions.alignRight,
            actions.heading2,
            actions.heading3,
            actions.insertOrderedList,
            actions.insertBulletsList,
            // actions.removeFormat,
            // actions.undo,
            // actions.redo,
          ]}
        />
      </View>
    )
  }
}
