# iOS

## To release

1. In project properties, Increment Build number and Version
1. Info.plist -> App Transport Security -> localhost -> NO
1. Product -> Scheme -> RELEASE
1. Change Scheme Destination to Any iOS Device
1. Product -> Build
1. Product -> Archive
1. Organizer -> Validate, Upload

### Change back after release:

1. Product -> Scheme -> plottr_mobile
1. Change Scheme Destination to iPad (8th generation)
1. Info.plist -> App Transport Security -> localhost -> YES


# Android

1. In android/app/build.gradle on line 136 & 137, increment versionCode and versionName
1. Run `./gradlew bundleRelease` in `<project>/android` in the command line
1. The file to upload is in `<project>/android/app/build/outputs/bundle/release`
