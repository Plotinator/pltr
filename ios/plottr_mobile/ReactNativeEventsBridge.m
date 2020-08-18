//
//  EventEmitterBridge.m
//  plottr_mobile
//
//  Created by Cameron Sutter on 8/17/20.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeEventEmitter, RCTEventEmitter)

//RCT_EXTERN_METHOD(startNewDocument:(NSDictionary*)data)
//
//RCT_EXTERN_METHOD(openDocument:(NSDictionary*)data)

RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(requiresMainQueueSetup)

@end
