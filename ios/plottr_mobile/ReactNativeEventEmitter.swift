//
//  ReactNativeEventEmitter.swift
//  plottr_mobile
//
//  Created by Cameron Sutter on 8/18/20.
//

import Foundation

@objc(ReactNativeEventEmitter)
open class ReactNativeEventEmitter: RCTEventEmitter {
  
  @objc public override static func requiresMainQueueSetup() -> Bool {
      return true
  }
    
  override init() {
    super.init()
    DocEvents.sharedInstance.registerEventEmitter(eventEmitter: self)
  }
  
  /// Base overide for RCTEventEmitter.
  ///
  /// - Returns: all supported events
  @objc open override func supportedEvents() -> [String] {
    return DocEvents.allEvents
  }

}
