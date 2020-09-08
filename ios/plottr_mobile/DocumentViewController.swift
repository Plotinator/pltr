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
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return true
  }

  var document: PlottrDocument?
  var vc: UIViewController?
  var events: DocEvents = DocEvents.sharedInstance
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

        let initialData:NSDictionary = [
          "documentURL": (self.document?.fileURL)!.absoluteString,
          "data": self.document?.stringContents() ?? ""
        ]
        
//        self.events.openDocument(data: initialData)
        DocEvents.openDocument(data: initialData)

      } else {
        // Make sure to handle the failed import appropriately, e.g., by presenting an error message to the user.
        print("failed import")
      }
    })
  }

  // MARK: React Native methods

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
  }
}

