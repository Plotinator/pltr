//
//  DocumentViewController.swift
//  plottr_mobile
//
//  Created by Cameron Sutter on 5/14/20.
//

import UIKit
//import React

@objc(DocumentViewController)
class DocumentViewController: UIViewController {

  var document: PlottrDocument?
  var vc: UIViewController?
  static var _sharedInstance: DocumentViewController?

  static func setSharedInstance(instance: DocumentViewController?) {
    DocumentViewController._sharedInstance = instance
  }

  static func sharedInstance() -> DocumentViewController? {
    return _sharedInstance
  }
  
  func openDocument() -> Void {
//    vc = UIViewController()
    // Access the document
    document?.open(completionHandler: { (success) in
      if success {
        // Display the content of the document
        
        let jsCodeLocation = self.jsURL()

        let initialData:NSDictionary = [
          "documentURL": (self.document?.fileURL)!.absoluteString,
          "data": self.document?.stringContents() ?? ""
        ]

        let rootView = RCTRootView(
          bundleURL: jsCodeLocation,
          moduleName: "plottr_mobile",
          initialProperties: (initialData as! [AnyHashable : Any]),
          launchOptions: nil
        )
        self.view = rootView
//        DocumentViewController._sharedInstance?.view = rootView
//        DocumentViewController._sharedInstance?.vc?.view = rootView
//        self.present(DocumentViewController._sharedInstance!.vc!, animated: true, completion: nil)
//        let vc = UIViewController()
//        vc.view = rootView
//        self.addChild(vc)
//        self.view.addSubview(vc.view)
//        self.present(self, animated: true, completion: nil)
//        self.present(self, animated: true, completion: nil)
//        self.vc?.view = rootView
//        self.present(self.vc!, animated: true, completion: nil)
      } else {
        // Make sure to handle the failed import appropriately, e.g., by presenting an error message to the user.
        print("failed import")
      }
    })
  }

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
//
//    vc = UIViewController()
//
//    DocumentViewController._sharedInstance = self
//
//    // Access the document
//    document?.open(completionHandler: { (success) in
//      if success {
//        // Display the content of the document
//
//        let jsCodeLocation = self.jsURL()
//
//        let initialData:NSDictionary = [
//          "documentURL": (self.document?.fileURL)!.absoluteString,
//          "data": self.document?.stringContents() ?? ""
//        ]
//
//        let rootView = RCTRootView(
//          bundleURL: jsCodeLocation,
//          moduleName: "plottr_mobile",
//          initialProperties: (initialData as! [AnyHashable : Any]),
//          launchOptions: nil
//        )
////        DocumentViewController._sharedInstance?.view = rootView
//        DocumentViewController._sharedInstance?.vc?.view = rootView
//        self.present(DocumentViewController._sharedInstance!.vc!, animated: true, completion: nil)
////        self.vc?.view = rootView
////        self.present(self.vc!, animated: true, completion: nil)
//      } else {
//        // Make sure to handle the failed import appropriately, e.g., by presenting an error message to the user.
//        print("failed import")
//      }
//    })
  }
  
  func jsURL () -> URL {
    #if DEBUG
      return URL(string: "http://localhost:8081/index.bundle?platform=ios")!
    #else
//      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
      return URL(string: "main.jsbundle")!
    #endif
    
    // debug
//    let jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")
//    let jsCodeLocation = URL(string: "http://192.168.120.219:8081/index.bundle?platform=ios")

    // release
//    let jsCodeLocation = URL(string: "main.jsbundle")
  }

  // MARK React Native methods

  @objc func updateDocument(_ data: String) -> Void {
    let docViewController = DocumentViewController._sharedInstance
    let doc = docViewController?.document
    doc?.updateStringContents(data: data)
    docViewController?.document?.save(to: (doc?.fileURL)!, for: UIDocument.SaveOperation.forOverwriting, completionHandler: { (saved) in
      print("SAVED doc")
    })
  }

  @objc func closeDocument() -> Void {
    guard let docViewController = DocumentViewController._sharedInstance else { return }
    docViewController.document?.close(completionHandler: nil)

    DispatchQueue.main.async {
      guard let docBrowser = docViewController.parent as? DocumentBrowserViewController else { return }
      docBrowser.closeDocument()
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appDelegate.openDocumentBrowser()
    }
  }
}
