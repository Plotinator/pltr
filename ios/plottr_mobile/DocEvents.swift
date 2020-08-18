//
//  EventEmitter.swift
//  plottr_mobile
//
//  Created by Cameron Sutter on 8/17/20.
//

import Foundation

class DocEvents {
  
  public static var sharedInstance = DocEvents()
  private static var eventEmitter: ReactNativeEventEmitter!
  public static var allEvents = ["onOpenDocument"]
  
  private init() {}

  static func openDocument(data: NSDictionary) {
    eventEmitter.sendEvent(withName: "onOpenDocument", body: data)
  }
  
  func registerEventEmitter(eventEmitter: ReactNativeEventEmitter) {
    DocEvents.eventEmitter = eventEmitter
  }
}
