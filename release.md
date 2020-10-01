## To release

1. Increment build number in project properties
1. Info.plist -> App Transport Security -> localhost -> NO
1. Product -> Scheme -> RELEASE
1. Change Scheme Destination to Generic iOS Device
1. Product -> Build
1. Product -> Archive
1. Organizer -> Validate, Upload

## Change back after release:

1. Product -> Scheme -> plottr_mobile
1. Change Scheme Destination to iPad (7th generation)
1. Info.plist -> App Transport Security -> localhost -> YES