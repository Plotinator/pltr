//
//  DocArchiver.swift
//  plottr_mobile
//
//  Created by Cameron Sutter on 9/17/20.
//

import Foundation

class DocumentBrowserConfig: NSKeyedArchiver {
  override func decodeObject(forKey key: String) -> Any? {
    print("KEY", key)
    switch key {
    case "UIView":
      return UIView()
    case "UITitle":
      return "Plottr Documents"
    case "UITabBarItem":
      return nil
    case "UINavigationItem":
      return nil
    case "UIParentViewController":
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      return appDelegate.window
    default:
      return nil
    }
  }
  
  override func decodeBool(forKey key: String) -> Bool {
    print("BOOL KEY", key)
    if (key == "UIWantsFullScreenLayout") {
      return true
    }
    return true
  }
  
  override func containsValue(forKey key: String) -> Bool {
    print("CONTAINS KEY", key)
    if (key == "UIAutoresizesArchivedViewToFullSize") {
      return false
    }
    return false
  }
}
