import AsyncStorage from '@react-native-community/async-storage'
import Config from 'react-native-config'

const USER_KEY = '@user_info'
const BASE_URL = 'http://getplottr.com'
const PRODUCT_IDS = {mac:'11321', windows: '11322'}
// const SUBSCRIPTION_ID = '10333'
const NAME_PATTERN = /Plottr .* (Windows|Mac)/

export async function getUserVerification () {
  const info = await AsyncStorage.getItem(USER_KEY)
  return info ? JSON.parse(info) : null
}

export function verifyUser (userInfo) {
  userInfo.verified = true
  AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo)) // not await-ing it
  return userInfo
}

export async function reset () {
  await AsyncStorage.removeItem(USER_KEY)
  return null
}

export async function checkForActiveLicense (email) {
  const url = salesURL(email)
  try {
    let response = await fetch(url)
    let json = await response.json()
    let validSalesId = null
    let userInfo = null
    if (json.sales && json.sales.length) {
      await Promise.all(json.sales.map(async s => {
        if (s.licenses) {
          // check each license (besides the bundle)
          const validations = await Promise.all(s.licenses
            .filter(l => l.status == 'active' && l.name.match(NAME_PATTERN))
            .map(async l => {
              let id = null
              if (l.name.includes('Mac')) {
                id = PRODUCT_IDS.mac
              } else if (l.name.includes('Windows')) {
                id = PRODUCT_IDS.windows
              }
              return await isActiveLicense(l.key, id)
            }))
          const isValid = validations.some(v => v)
          validSalesId = isValid ? s.ID : validSalesId
        }
      }))
      if (validSalesId) {
        userInfo = newUserInfoTemplate(json.sales, validSalesId)
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo))
      }
    }
    return userInfo
  } catch (error) {
    console.error(error)
    return false
  }
}

isActiveLicense = async (license, productId) => {
  const url = licenseURL(license, productId)
  try {
    let response = await fetch(url, {headers: {'User-Agent': 'mobile;mobile-app'}})
    let json = await response.json()
    return json.success
  } catch (error) {
    console.error(error)
    return false // maybe not?
  }
}

function salesURL (email) {
  return apiURL('/sales/', [['email', email]])
}

function licenseURL (license, productId) {
  return `${BASE_URL}/?edd_action=check_license&item_id=${productId}&license=${license}`
}

// otherKeys is an array of arrays e.g. [['email', <val>], ...]
function apiURL (path = '', otherKeys) {
  return `${BASE_URL}/edd-api${path}?key=${Config.EDD_KEY}&token=${Config.EDD_TOKEN}&number=-1${otherKeys.map(k => `&${k[0]}=${k[1]}`)}`
}

function newUserInfoTemplate (sales, idToVerify) {
  return { verified: false, chancesLeft: 3, isV2: true, sales, idToVerify }
}