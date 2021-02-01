import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener
} from 'react-native-iap'
import {
  AVAILABLE_PRODUCTS_SKU,
  AVAILABLE_SUBSCRIPTIONS_SKU
} from './constants'

// internal uses only
let purchaseUpdateSubscription
let purchaseErrorSubscription

// callback is an success first
export const startSession = async (callback) => {
  try {
    const result = await RNIap.initConnection()
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
    console.log('[IAP]====> Init Results', result)
    callback(result)
  } catch (err) {
    console.warn('[IAP]====> ', err.code, err.message)
    callback(false, `${err.code}: ${err.message}`)
  }
}

// callback is an success first
export const getAppSubscriptions = async (callback) => {
  try {
    const DigitalProducts = await RNIap.getSubscriptions(
      AVAILABLE_SUBSCRIPTIONS_SKU
    )
    console.log('[IAP]====> Got Subscriptions', DigitalProducts)
    callback(true, DigitalProducts)
  } catch (err) {
    console.warn('[IAP]====> ', err.code, err.message)
    callback(false, `${err.code}: ${err.message}`)
  }
}

// callback is an success first
export const getAppProducts = async (callback) => {
  try {
    const DigitalProducts = await RNIap.getProducts(AVAILABLE_PRODUCTS_SKU)
    console.log('[IAP]====> Got Products', DigitalProducts)
    callback(true, DigitalProducts)
  } catch (err) {
    console.warn('[IAP]====> ', err.code, err.message)
    callback(false, `${err.code}: ${err.message}`)
  }
}

// callback is an success first
export const getUserPurchases = async (callback) => {
  try {
    console.info(
      '[IAP]====> Getting available purchases ' +
        '(non-consumable or unconsumed consumable)'
    )
    const purchases = await RNIap.getAvailablePurchases()
    const hasPuchases = purchases && purchases.length
    console.info('[IAP]====> Available purchases :: ', purchases)
    console.info(hasPuchases && purchases[0].transactionReceipt)
    callback(true, purchases)
  } catch (err) {
    console.warn('[IAP]====> ', err.code, err.message)
    callback(false, `${err.code}: ${err.message}`)
  }
}

// needs product SKU as argument
// callback is an success first
export const requestUserPermissionToPurchase = async (SKU, callback) => {
  // callback only called after the whole process is completed
  try {
    const requestResult = await RNIap.requestPurchase(SKU)
    callback && callback(requestResult)
  } catch (err) {
    console.warn('[IAP]====> ', err.code, err.message)
    callback && callback(false, `${err.code}: ${err.message}`)
  }
}

// needs subscription SKU as argument
// callback is an success first
export const requestUserPermissionToSubscribe = async (SKU, callback) => {
  // callback only called after the whole process is completed
  try {
    const requestResult = await RNIap.requestSubscription(SKU)
    callback && callback(requestResult)
  } catch (err) {
    console.warn('[IAP]====> ', err.code, err.message)
    callback && callback(false, `${err.code}: ${err.message}`)
  }
}

// callback is an success first
export const subscribeToPurchaseEvents = async (callback) => {
  // internal uses only
  purchaseUpdateSubscription = purchaseUpdatedListener(
    async (purchase: InAppPurchase | SubscriptionPurchase) => {
      const receipt = purchase.transactionReceipt
      if (receipt) {
        console.log('[IAP]====> Attempting to conclude purchase', receipt)
        try {
          const result = await finishTransaction(purchase)
          console.log('[IAP]====> Transaction result', result)
          callback(true, result, purchase)
        } catch (ackErr) {
          console.warn('[IAP]====> Transaction Acknowledgement Error', ackErr)
          callback(false, ackErr, purchase)
        }
      } else {
        callback(false, 'Transaction Error: No receipt', purchase)
      }
    }
  )
  // internal uses only
  purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
    console.log('[IAP]====> purchase Error:', error)
    callback(false, `Purchase Error: ${error.message}`, error)
  })
}

// internal uses only
const unsubscribeFromPurchaseEvents = () => {
  if (purchaseUpdateSubscription) {
    purchaseUpdateSubscription.remove()
    purchaseUpdateSubscription = null
  }
  if (purchaseErrorSubscription) {
    purchaseErrorSubscription.remove()
    purchaseErrorSubscription = null
  }
}

// cleans up everything
export const endSession = () => {
  unsubscribeFromPurchaseEvents()
  RNIap.endConnection()
}
