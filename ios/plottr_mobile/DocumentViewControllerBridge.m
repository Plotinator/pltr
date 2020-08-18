//
//  DocumentBridge.m
//  plottr_mobile
//
//  Created by Cameron Sutter on 5/14/20.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTRootView.h>
//#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(DocumentViewController, NSObject)

RCT_EXTERN_METHOD(updateDocument:(NSString *)data)

RCT_EXTERN_METHOD(closeDocument)

RCT_EXTERN_METHOD(requiresMainQueueSetup)

@end
