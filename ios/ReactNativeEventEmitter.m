//
//  ReactNativeEventEmitter.m
//  plottr_mobile
//
//  Created by Cameron Sutter on 5/14/20.
//
// See: http://reactnative.dev/docs/native-modules-ios.html#exporting-swift
//

#import <Foundation/Foundation.h>

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
