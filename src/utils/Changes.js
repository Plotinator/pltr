import t from 'format-message'
import { showAlert } from '../components/shared/common/AlertDialog'

export const checkForChanges = (
  event,
  changes,
  saveChangesCallback,
  navigation
) => {
  // continue, no unsaved changes
  if (!changes) return

  // stop, alert user of unsaved changes
  event.preventDefault()
  showAlert({
    title: t('Save Changes?'),
    message: t('You have unsaved changes'),
    actions: [
      {
        positive: true,
        name: t('Yes, Save'),
        callback: () => {
          saveChangesCallback()
          navigation.dispatch(event.data.action)
        }
      },
      {
        name: t('No, Discard'),
        callback: () => navigation.dispatch(event.data.action)
      }
    ]
  })
}

export const addLeaveListener = (navigation, leaveCallback) => {
  navigation.addListener('beforeRemove', leaveCallback)
}

export const removeLeaveListener = (navigation, leaveCallback) => {
  navigation.removeListener('beforeRemove', leaveCallback)
}
