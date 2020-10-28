import AsyncStorage from '@react-native-community/async-storage'
import Config from 'react-native-config'

const USER_KEY = '@user_info'
const BASE_URL = 'http://getplottr.com'
let SALES_PRODUCT_IDS = [12772, 12768, 11325, 11538, 14460, 29035, 33345]
const PRODUCT_IDS = {mac:'11321', windows: '11322', pro: '33345'}
const NAME_PATTERN = /Plottr .* (Windows|Mac)/
const TESTR_EMAIL = 'special_tester_email@getplottr.com'
const TESTR_CODE = 735373

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
  if (email == TESTR_EMAIL) return newUserInfoTemplate(TESTR_EMAIL, [], TESTR_CODE)
  const url = salesURL(email)
  try {
    let response = await fetch(url)
    let json = await response.json()
    let validSalesId = null
    let userInfo = null
    if (json.sales && json.sales.length) {
      await Promise.all(json.sales.map(async s => {
        const hasValidSalesProduct = s.products.some(p => SALES_PRODUCT_IDS.includes(p.id))
        if (hasValidSalesProduct && s.licenses) {
          // check each valid license
          const validations = await Promise.all(s.licenses
            .filter(isValidLicense)
            .map(async l => {
              const id = getProductIdFromLicense(l)
              return await isActiveLicense(l.key, id)
            }))
          const isValid = validations.some(v => v)
          validSalesId = isValid ? s.ID : validSalesId
        }
      }))
      if (validSalesId) {
        userInfo = newUserInfoTemplate(email, json.sales, validSalesId)
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo))
      }
    }
    return userInfo
  } catch (error) {
    console.error(error)
    return false
  }
}

// valid means not expired, invalid, nor disabled, and not the bundle license
// also, don't check the bundle license
function isValidLicense (license) {
  return ['active', 'inactive'].includes(license.status) && !license.name.includes('Bundle')
}

isActiveLicense = async (license, productId) => {
  const url = licenseURL('check_license', license, productId)
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

function licenseURL (action, license, productId) {
  return `${BASE_URL}/?edd_action=${action}&item_id=${productId}&license=${license}`
}

// otherKeys is an array of arrays e.g. [['email', 'me@example.com'], ...]
function apiURL (path = '', otherKeys) {
  return `${BASE_URL}/edd-api${path}?key=${Config.EDD_KEY}&token=${Config.EDD_TOKEN}&number=-1${otherKeys.map(k => `&${k[0]}=${k[1]}`)}`
}

function newUserInfoTemplate (email, sales, idToVerify) {
  return { email, verified: false, chancesLeft: 3, isV2: true, sales, idToVerify }
}

function getProductIdFromLicense (license) {
  if (license.name.includes('Mac')) {
    return PRODUCT_IDS.mac
  } else if (license.name.includes('Windows')) {
    return PRODUCT_IDS.windows
  } else if (license.name.includes('Pro')) {
    return PRODUCT_IDS.pro
  } else if (license.name.includes('2020')) {
    return PRODUCT_IDS.twenty
  }
  return null
}

export async function checkStoredLicense () {
  const info = await getUserVerification()
  if (!info) return false

  if (info.email == TESTR_EMAIL) return true

  const sale = info.sales.find(s => s.ID == info.idToVerify)
  if (!sale) return false

  const validations = await Promise.all(s.licenses
    .filter(isValidLicense)
    .map(async l => {
      const id = getProductIdFromLicense(l)
      return await isActiveLicense(l.key, id)
    }))
  return validations.some(v => v)
}