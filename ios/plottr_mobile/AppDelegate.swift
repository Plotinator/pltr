//
//  AppDelegate.swift
//  plottr_mobile
//
//  Created by Cameron Sutter on 8/17/20.
//

import Foundation
import UIKit

#if DEBUG
#if FB_SONARKIT_ENABLED
import FlipperKit
#endif
#endif

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?
  var bridge: RCTBridge!
  var rootViewController: UIViewController!

  func sourceURL() -> URL {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
//      return URL(string: "http://localhost:8081/index.bundle?platform=ios")!
    #else
      return Bundle.main.url(forResource:"main", withExtension:"jsbundle")!
    #endif
  }

  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    initializeFlipper(with: application)
    
//    guard let documentPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first else { return true }

//    let localDocumentsDirectoryURL = URL(fileURLWithPath: documentPath)
    
    let rootView = RCTRootView(bundleURL: self.sourceURL(), moduleName: "plottr_mobile", initialProperties: nil, launchOptions: launchOptions)

    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.rootViewController = UIViewController()

    rootViewController.view = rootView

    self.window!.rootViewController = rootViewController;
    self.window!.makeKeyAndVisible()
    
    return true
  }

  private func initializeFlipper(with application: UIApplication) {
    #if DEBUG
    #if FB_SONARKIT_ENABLED
      let client = FlipperClient.shared()
      let layoutDescriptorMapper = SKDescriptorMapper(defaults: ())
//      FlipperKitLayoutComponentKitSupport.setUpWith(layoutDescriptorMapper)
      client?.add(FlipperKitLayoutPlugin(rootNode: application, with: layoutDescriptorMapper!))
      client?.add(FKUserDefaultsPlugin(suiteName: nil))
      client?.add(FlipperKitReactPlugin())
      client?.add(FlipperKitNetworkPlugin(networkAdapter: SKIOSNetworkAdapter()))
//      client?.add(FlipperReactPerformancePlugin.sharedInstance())
      client?.start()
    #endif
    #endif
  }
  
  func application(_ app: UIApplication, open inputURL: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // Ensure the URL is a file URL
    guard inputURL.isFileURL else { return false }

    print("app delegate")

    // Reveal / import the document at the URL
//    guard let documentBrowserViewController = window?.rootViewController as? DocumentBrowserViewController else { return false }
//
//    documentBrowserViewController.revealDocument(at: inputURL, importIfNeeded: true) { (revealedDocumentURL, error) in
//      if let error = error {
//        // Handle the error appropriately
//        print("Failed to reveal the document at URL \(inputURL) with error: '\(error)'")
//        return
//      }
//
//      // Present the Document View Controller for the revealed URL
//      documentBrowserViewController.presentDocument(at: revealedDocumentURL!)
//    }

    return true
  }

  func openDocumentBrowser() {
    guard let window = self.window else { return }
    UIView.transition(with: window, duration: 0.3, options: .transitionCurlDown, animations: {
      window.rootViewController = DocumentBrowserViewController()
    }, completion:nil)
//    window.rootViewController?.present(DocumentBrowserViewController(), animated: true, completion: nil)
  }
  
  func closeDocumentBrowser() {
    guard let window = self.window else { return }
    UIView.transition(with: window, duration: 0.3, options: .transitionCurlUp, animations: {
      window.rootViewController = self.rootViewController
    }, completion:nil)
  }
  
  func applicationWillResignActive(_ application: UIApplication) {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  }

  func applicationWillTerminate(_ application: UIApplication) {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
  }

}
