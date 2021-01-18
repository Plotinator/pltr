import React, { useEffect, useState, Component } from 'react'
import { Provider } from 'react-redux'
import DocumentRoot from './DocumentRoot'
import { configureStore } from '../store/configureStore'
import MainErrorBoundary from './MainErrorBoundary'
import t from 'format-message'
import Dashboard from './screens/dashboard'
import DocumentPicker from 'react-native-document-picker'
import rnfs, { DocumentDirectoryPath } from 'react-native-fs'
import { showAlert, showInputAlert } from './shared/common/AlertDialog'
import AsyncStorage from '@react-native-community/async-storage'
import { setDocumentURL } from '../middlewares/DocumentSaver'

let store = configureStore({})

export default class Main extends Component {
  state = {
    document: null,
    loading: false,
    recentDocuments: []
  }

  setLoading = (loading) => this.setState({ loading })

  setDocument = (document) => {
    setDocumentURL(document && document.documentURL)
    this.setState({ document })
  }

  closeDocument = () => {
    this.setDocument(null)
    store = configureStore({})
  }

  componentDidMount() {
    this.getRecentDocuments()
  }

  handleDocumentOpened = (data) => {
    this.setDocument(data)
    this.setLoading(false)
    this.addRecentDocument(data)
  }

  handleNewProject = ({ input }) => {
    this.setLoading(true)
    const fileName = String(input || 'New Story')
      .replace(/\s+/gi, '_')
      .replace(/[^a-zA-Z0-9_\-]/gi)
    const filePath = DocumentDirectoryPath + `/${fileName}.pltr`;
    const fileData = `{"storyName": "${input}", "newFile": true}`
    const writeProjectFile = () => {
      rnfs.writeFile(filePath, fileData, 'utf8')
        .then(() => this.handleDocumentOpened({
          data: fileData,
          documentURL: filePath
        }))
        .catch((err) => {
          this.showCreateFileError()
        })
        .finally(() => this.setLoading(false));
    }
    rnfs.exists(filePath)
      .then((exists) => {
        if(exists) {
          const actions = [
            {
              positive: true,
              name: t('OVERWRITE'),
              callback: writeProjectFile
            },
            {
              name: t('Cancel').toUpperCase(),
              callback: () => this.setLoading(false)
            }
          ]
          showAlert({
            title: t('LOOK OUT!'),
            message: t(
              'You already have a file named {file}',
              { file: `"${fileName}.pltr"` }
            ),
            actions
          })
        } else writeProjectFile()
      })
  }

  getRecentDocuments () {
    AsyncStorage.getItem('recentDocuments').then(data => {
      if(data) {
        try {
          const recentDocuments = JSON.parse(data || '[]')
          this.setState({ recentDocuments })
        } catch(e) {
          console.log('corrupt recent docs', e)
        }
      }
    })
  }

  addRecentDocument ({ data, documentURL }) {
    const { recentDocuments = [] } = this.state
    const documentObject = JSON.parse(data)
    const { storyName, series } = documentObject
    const projetName = (series && series.name) || storyName

    recentDocuments.forEach((document, i) => {
      const { name, url } = document
      if(url == documentURL && name == projetName) {
        recentDocuments.splice(i, 1)
      }
    })

    recentDocuments.unshift({
      name: projetName,
      url: documentURL
    })

    // top 4
    this.setState({ recentDocuments: recentDocuments.splice(0, 4) })
    AsyncStorage.setItem('recentDocuments', JSON.stringify(recentDocuments))
  }

  showFileProcessingError () {
    showAlert({
      title: t('UH-OH!'),
      message: t('We had a problem processing your file')}
    )
  }

  showInValidFileError () {
    showAlert({
      title: t('UH-OH!'),
      message: t('Please select a valid Plottr file')
    })
  }

  showCreateFileError () {
    showAlert({
      title: t('UH-OH!'),
      message: t('We had a problem creating a new project')
    })
  }

  readDocumentFile (uri) {
    rnfs.readFile(decodeURI(uri), 'utf8')
      .then((data) => {
        const document = {
          data,
          documentURL: uri
        }
        this.handleDocumentOpened(document)
      })
      .catch((err) => {
        this.showFileProcessingError()
      })
      .finally(() => this.setLoading(false));
  }

  readDocument = ({ name, url }) => {
    this.readDocumentFile(url)
  }

  selectDocument = () => {
    try {
      DocumentPicker.pick({
        mode: 'open',
        // type: [
        //   'public.pltr',
        //   'public.json',
        // ],
      }).then((res) => {
        this.setLoading(true)
        const { uri, fileCopyUri, name } = res
        if(name.match('.pltr')) {
          this.readDocumentFile(uri)
        } else {
          this.showInValidFileError()
          this.setLoading(false)
        }
      })
      .catch((error) => {
        if(!String(error).match(/canceled/i)) {
          this.showFileProcessingError()
        }
      })
      .finally(() => this.setLoading(false))
    } catch (err) {
      this.showFileProcessingError()
      this.setLoading(false)
    }
  }

  createDocument = () => {
    showInputAlert({
      title: t('New Project'),
      message: t('Enter the name of your story'),
      actions: [
        {
          name: t('CREATE PROJECT'),
          callback: this.handleNewProject,
          positive: true
        },
        {
          name: t('Cancel').toUpperCase()
        }
      ]
    })
  }

  recoverFromError = () => {
    this.setDocument(null)
  }

  renderProjectDocument() {
    const { logout } = this.props
    const { document } = this.state
    const { documentURL } = document || {}
    return (
      <Provider store={store} key={documentURL}>
        <MainErrorBoundary recover={this.recoverFromError}>
          <DocumentRoot
            document={document}
            closeFile={this.closeDocument}
            logout={logout}
          />
        </MainErrorBoundary>
      </Provider>
    )
  }

  renderDashboard() {
    const {
      readDocument,
      createDocument,
      selectDocument,
      state: {
        loading,
        recentDocuments
      }
    } = this
    return (
      <Dashboard
        loading={loading}
        readDocument={readDocument}
        recentDocuments={recentDocuments}
        createDocument={createDocument}
        openDocument={selectDocument}
      />
    )
  }

  render() {
    const { document } = this.state
    return this[document ? 'renderProjectDocument' : 'renderDashboard']()
  }
}
