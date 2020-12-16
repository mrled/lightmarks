# ✅ ✅ ✅ ✅ ✅ Completed log, finished tasks

Work I've finished (or rejected)

## Tasks

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

### ✅ 🔱 Implement a Discover tab

- View for the popular feed
- View for the recent feed
- Navigation with back button
- Show list of bookmarks

The list of bookmarks even looks halfway decent, fuck yeah

### ✅ When tapping on links, highlight the link

- Important for links to u:USERNAME and to actual bookmarked links
- Especially useful for screen recordings

Done. This was actually already working for regular text with `onPress` events.
I added a `<Pressable>` for a set of two `<Text>` components I wanted to be part of a single link.

### ✅ 🔱 Implement a Profile tab

- Show recent posts
- Requires understanding separate API results from feeds vs API

### ✅ 🔱 Implement a global API rate limit

Pinboard will rate limit you, and it won't even follow its own docs and use a rate limit message.

- Start by following guidelines in API docs
- Add a back-off mechanism, where it doubles the wait time
- How to manage too many tasks filling it up?

Used `smart-request-balancer` for this, we'll see how it goes.
No plan yet for dealing with too many tasks filling it up...
I expect I'll need to get more sophisticated with time.
Biggest weakness currently is lack of cached data --
loading same data over and over again will result in a queue that's full of reloading the same stuff.
Added task for caching old results.

- <https://github.com/energizer91/smart-request-balancer>
- <https://hackernoon.com/limiting-your-api-requests-the-right-way-9608b661a0ce>

### ✅️ Get an icon

At least a prelim one

- Got `collections_bookmark` from Material Design icons
- Used <http://easyappicon.com/> to convert it to Android and iOS icons
- Add to iOS: Open xcworkspace (or xcproj if you don't have a workspace), go to project name -> Image Assets -> AppIcon, add the right sizes one by one
- Add to Android: not sure yet, Android build is broken and I'm over it

### ✅️ Rename to Lightmarks

- Rename all the stuff in Xcode that I could
- Move folders to new names
- `rg -i betterpins` and replace with `Lightmarks` everywhere, even in Xcode files
- Don't forget to `find -name '*betterpins*'` too
- And `rg` will not find text matches in the `.gitignore` file, AND will ignore items listed in `.gitignore`,
  so look at that file separately.

Also during this

- Change the bundle identifier to be `com.micarhl.me` rather than `org.reactjs.native.example` --
  `rg -i org.reactjs.native.example` and change from there
- Remove everything related to tvOS, first in Xcode and then with `rg` and `rm`

How to do this for Android? No idea, that's for later I guess.

### ✅️ Get Android build working

I rarely look at this, and it wasn't building.
Now it is.

- Had to move to Gradle 6.3 to deal with changes in React Native package since I initialized my project
- Had to add react-native-config package for some reason, <https://github.com/luggit/react-native-config/issues/228>
- Follow react-native-vector-icons instructions for Android

#### Changing the name to Lightmarks in the Android project

- Set package name to `com.micahrl.lightmarks`, lower case. Apparently Java convention is that packages ought to have lower case, and my linter caught it -- although I seem to be importing a bunch of things with case, idk.
- All I had to do was `rg` files containing the old name, and `find` files/directories with the old name in their filenames, and rebuild, and that was it

### ✅️ Replace `console.error` with `console.warn`

Apparently React Native doesn't play nice with `console.error`?
See <https://react-query.tanstack.com/docs/react-native>.

### Figured out what flipper is lol

All the fucking flipper shit everywhere is for a nice debugger.
How come no one told me this.
smh.

<https://fbflipper.com/>

### ✅️ Break up usePinboard into multiple hooks

Advice on the Reactiflux Discord is that if you have a hook more than a page, it's probably too long.
Certainly my 200 line usePinboard hook should probably be refactored.

Advised I keep storage (Keychain/UserDefaults) and the API client separate, for example.

Can be decomposed into multiple hooks.
Libs like React Query should help as well.

DONE. The new useAppConfiguration hook is still 100 lines, but that's better than the old one.

#### Ok this is going to be a fucking huge thing

- React Query actually recommends that you have a _separate hook for each API call_:
  <https://react-query.tanstack.com/docs/examples/custom-hooks>.
  "...each query has been refactored to be it's own custom hook. This design is the suggested way to use React Query, as it makes it much easier to manage query keys and shared query logic."
- This would mean a couple dozen hooks, e.g. `hooks/pinboard/usePbApiUserPosts`, `hooks/pinboard/usePbApiUserTags`, `hooks/pinboard/usePbApiUserRecent`, etc etc etc. (... is this even sustainable for larger APIs? What are you doing, using codegen for this shit? Fuck's sake.)
- How would I manage state like PinboardMode, authentication, etc in such a regime?
- I think the answer is _more fucking hooks_. E.g. `usePinboardMode()` and `usePinboardAuth()` hooks that are called from every API endpoint hook.
- That seems _surprising_ but maybe not _insane_? Like if someone knows React it'll probably make sense, but it would probably not make sense at all who hasn't been inducted into the Church of Hooks.
- What helped crystalize how this is expected to work started with this blog post: <https://blog.logrocket.com/frustrations-with-react-hooks/>...
- ... which linked to this GitHub comment from a React developer: <https://github.com/facebook/react/issues/14476#issuecomment-471199055>
- In the latter, there is an example of separate `useFetch` and `useFetchWithAuth` hooks
- And in both of them are some good examples of patterns I can use.
- I guess I'm afraid this is faddish... is anyone going to understand this shit in 5 years?

DONE too. This does seem to have some benefits, like I don't have to explicitly handle promises or anything, it feels like working with synchronous code. However, it'll take me a long time to get used to it, and it took a long time to refactor, and I had to touch basically every file in my project.

### ✅️ Should be using hook for smart request balancer queue

Realized just now that I define the queue in the module, but I don't think it'll work like that.
Need to use a hook or something.
Not sure of the right abstractions for this...
maybe I create the queue in usePinboard() and pass it in to `new Pinboard()` when I instantiate?

Done.

### ✅️ Do I need a UI kit?

- NativeBase seems like a decent default. It has a lot of components. (Maybe some are paid only?)
- UI Kitten might look pretty good, but has way fewer components.
- react-native-paper is Material Design, so I don't think it'll look right on iOS
- Lots of other ones, but these seem to be the biggest?

I have to say, discovering this stuff is hard when you're starting from absolute scratch like me.
I literally only even found these because I was searching all of github for how to set a React Navigation stack nav top bar... and the results were all from people using paper or UI Kitten or similar.

UPDATE: Decided not to do this. Will just reinvent my own thing, at least for now.
