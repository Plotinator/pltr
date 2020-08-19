import AsyncStorage from '@react-native-community/async-storage'

const BASE_URL = 'http://getplottr.com'
const PRODUCT_IDS = ['11321', '11322']
// const SUBSCRIPTION_ID = '10333'

export async function getUser() {
  const info = await AsyncStorage.getItem('@user_info')
  return info ? info : null
}

export async function checkForActiveLicense (email) {
  const url = salesURL(email)
  try {
    let response = await fetch(url)
    let json = await response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}

isActiveLicense = (body) => {
  // license could also be:
  // - site_inactive
  // - invalid
  // - disabled
  // - expired
  // - inactive

  // not handling site_inactive nor inactive differently than invalid for now
  return body.success && body.license == 'valid'
}

function getSubscriptionInfo (email, callback) {
  const req = makeRequest(subscriptionURL(email))
  request(req, (err, response, body) => {
    if (err) callback(err, null)
    else {
      const activeSub = findActiveSubscription(body)
      if (activeSub) {
        callback(null, activeSub)
      } else {
        callback(null, false)
      }
    }
  })
}

// function findActiveSubscription (body) {
//   if (body.error) return false
//   if (!body.subscriptions) return false

//   return body.subscriptions.find(sub => {
//     return sub.info && sub.info.product_id == SUBSCRIPTION_ID && sub.info.status == "active"
//   })
// }

function salesURL (email) {
  return apiURL('/sales/', [['email', email]])
}

// function subscriptionURL (email) {
//   let url = apiURL('/subscriptions')
//   url += `&customer=${email}`
//   return url
// }

// otherKeys is an array of arrays e.g. [['email', <val>], ...]
function apiURL (path = '', otherKeys) {
  return `${BASE_URL}/edd-api${path}?key=${process.env.EDD_KEY}&token=${process.env.EDD_TOKEN}&number=-1${otherKeys.map(k => `&${key[0]}=${key[1]}`)}`
}