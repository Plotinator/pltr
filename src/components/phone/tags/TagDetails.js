import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Container, Content, Form, Input, Label, Item } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import { ColorWheel } from 'react-native-color-wheel'
import tinycolor from 'tinycolor2'

class TagDetails extends Component {
  constructor (props) {
    super(props)
    const { route } = props
    const { isNewTag, tag } = route.params
    const tagObj = isNewTag ? cloneDeep(initialState.tag) : tag
    const color = tinycolor(tagObj.color)
    console.log('color.toHexString()', color.toHexString())
    this.state = {
      isNewTag: isNewTag,
      changes: isNewTag,
      id: tagObj.id,
      title: tagObj.title,
      color: color.toHexString(),
    }
  }

  componentDidMount () {
    this.setSaveButton()
  }

  componentDidUpdate () {
    this.setSaveButton()
  }

  setSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => <SaveButton changes={this.state.changes} onPress={this.saveChanges} />
    })
  }

  saveChanges = () => {
    const { changes, isNewTag, id, title, color } = this.state
    console.log('SAVE CHANGES', this.state)
    if (!changes) return
    if (isNewTag) {
      this.props.actions.addTagWithValues(title, color)
      this.props.navigation.setParams({isNewTag: false})
    } else {
      this.props.actions.editTag(id, title, color)
    }
    this.setState({isNewTag: false, changes: false})
  }

  setNewColor = (hsvColor) => {
    // TODO: Fix this
    console.log('HSV before', hsvColor.h)
    if (hsvColor.h < 0) hsvColor.h = hsvColor.h * -1 + 100
    console.log('HSV after', hsvColor.h)
    const color = tinycolor(hsvColor)
    this.setState({color: color.toHexString(), changes: true})
  }

  render () {
    const { title, color } = this.state
    // return <Container>
    //   <Content style={styles.content}>
    //     <Form style={styles.form}>
    //       <Item inlineLabel last regular style={styles.label}>
    //         <Label>{t('Title')}</Label>
    //         <Input
    //           value={title}
    //           onChangeText={text => this.setState({title: text, changes: true})}
    //           autoCapitalize='sentences'
    //         />
    //       </Item>
    //       <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
    //         <Label>{t('Color')}</Label>
    //         <View style={[styles.currentColor, {backgroundColor: color}]}></View>
    //       </Item>
    //     </Form>
    //   </Content>
    //   <View style={{flex: 1}}>
    //     <Label>{t('Change Color:')}</Label>
    //     <ColorWheel
    //       initialColor={color}
    //       onColorChangeComplete={this.setNewColor}
    //       style={styles.colorWheel}
    //       thumbStyle={{ height: 30, width: 30, borderRadius: 30 }}
    //       thumbSize={30}
    //     />
    //   </View>
    // </Container>
    return <Container>
      <Form style={styles.form}>
        <Item inlineLabel last regular style={styles.label}>
          <Label>{t('Title')}</Label>
          <Input
            value={title}
            onChangeText={text => this.setState({title: text, changes: true})}
            autoCapitalize='sentences'
          />
        </Item>
        <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
          <Label>{t('Color')}</Label>
          <View style={[styles.currentColor, {backgroundColor: color}]}></View>
        </Item>
      </Form>
      <View style={{flex: 1}}>
        <Label style={styles.content}>{t('Change Color:')}</Label>
        <ColorWheel
          initialColor={color}
          onColorChange={this.setNewColor}
          // onColorChangeComplete={this.setNewColor}
          style={styles.colorWheel}
          thumbSize={30}
        />
      </View>
    </Container>
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  label: {
    marginBottom: 16,
  },
  afterList: {
    marginTop: 16,
  },
  form: {
    padding: 16,
    marginTop: 16,
  },
  currentColor: {
    height: 50,
    width: 50,
  },
  colorWheel: {
    width: Dimensions.get('window').width,
    elevation: 300,
  },
})

TagDetails.propTypes = {
  note: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  startEditing: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.tagActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagDetails)
