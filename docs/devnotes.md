# betterpins

Development notes, whatever.

## Completed log, finished tasks

### Icons

Using some icons for tab navigation. Started here: <https://reactnavigation.org/docs/use-navigation>

That required setting up react-native-vector-icons: <https://github.com/oblador/react-native-vector-icons>

Using `react-native link` didn't work, and I couldn't figure out CocoaPods in 30 seconds.
I installed using the manual instructions.
There was a stumbling block there too --
I had to go into Xcode and remove the icons from getting copied at build time, per
<https://github.com/oblador/react-native-vector-icons/issues/1074>.
Otherwise I got a ton of errors like 'Multiple commands produce /long/path/whatever.ttf'.

To fix this, I blindly followed instructions without thinking too hard:

> Find a solution, simply remove duplicate reference fonts in "Copy Bundle Resources" NOT in "[CP] Copy Pods Resources"

and

> For anyone else who didn't know this, Copy Bundle Resources can be found under the Build Phases` tab in the target in your project

I have not yet done this for Android!! So whenever I get around to testing Android, I guess it will be a pain in the ass and I hope I remember this note.
