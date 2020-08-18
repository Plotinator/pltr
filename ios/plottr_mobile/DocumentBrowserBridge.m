//
//  UIDocumentBrowserViewControllerBridge.m
//  plottr_mobile
//
//  Created by Cameron Sutter on 8/17/20.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>


@interface RCT_EXTERN_MODULE(DocumentBrowser, NSObject)

//RCT_EXTERN_METHOD(updateDocument:(NSString *)data)

RCT_EXTERN_METHOD(openBrowser)
RCT_EXTERN_METHOD(closeBrowser)

RCT_EXTERN_METHOD(requiresMainQueueSetup)

@end
