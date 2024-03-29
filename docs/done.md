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

### ✅️ Remove unnecessary types from types.ts

Lots of cruft in here from pre- React Query

### ✅️ Toggle mock/production mode in app

Maybe even with a visible reminder of what mode I'm in on all screens?

### ✅️ Use React Query

Bigger lift than I thought. RQ is strange!

#### Fix network error

I _think_ this is fixed, and either way I'm pretty sure that moving to RQ would have changed it. I never got good tests on this though, so it's possible that something similar is still kicking around. Will open a new item if that's the case, since it'll likely be different under RQ.

Since the last time I had it working -- sometime in the past week? --
I can't use the app in production mode any more.

I try to make a request and I get an error in the React console in the terminal after about 75 seconds:
`Type Error: network request failed`.

This is on iOS.
Apparently people are seeing this on Android only in recent React Native versions,
e.g. <https://github.com/facebook/react-native/issues/29608>.

Tried upgrading React Native etc, no change in behavior.

Going to try getting the Android build working to compare it with...
... nope, getting the same error.
This must not be a platform specific problem, but something else.
Try investigating the "Should be using hook for smart request balancer queue" task?

Here's a bunch of logs

    [Fri Nov 27 2020 23:35:32.313]  DEBUG    setPinboardIdempotently(): Setting new Pinboard object
    mode: Mock ==> Production
    username: undefined ==> mrled
    tokenSecret: undefined ==> ******CENSORED******
    rssSecret: undefined === undefined
    [Fri Nov 27 2020 23:35:32.314]  DEBUG    Pinboard(): Pinboard credential: {"username":"mrled","authTokenSecret":"******CENSORED******"}
    [Fri Nov 27 2020 23:35:32.315]  DEBUG    Pinboard(): Using API token secret credential
    [Fri Nov 27 2020 23:35:32.322]  DEBUG    Pinboard(): No credential for feeds
    [Fri Nov 27 2020 23:35:32.322]  LOG      App.tsx: sharedData:
    [Fri Nov 27 2020 23:35:32.323]  LOG      App.tsx: sharedMimeType:
    [Fri Nov 27 2020 23:35:32.323]  DEBUG    setPinboardIdempotently(): Pinboard is already set, nothing to do
    [Fri Nov 27 2020 23:35:32.324]  LOG      App.tsx: sharedData:
    [Fri Nov 27 2020 23:35:32.425]  LOG      App.tsx: sharedMimeType:
    [Fri Nov 27 2020 23:35:32.647]  LOG      Set setting 'PinboardMode' to 'Production'.
    [Fri Nov 27 2020 23:35:32.648]  LOG      Set credential 'PinboardApiTokenSecretCredential'
    [Fri Nov 27 2020 23:35:37.234]  LOG      Logging in with API token mrled:******CENSORED******
    [Fri Nov 27 2020 23:35:37.234]  LOG      pinboard.api.getJsonWithApiTokenSecretCredential(): result: {"_U":0,"_V":0,"_W":null,"_X":null}
    [Fri Nov 27 2020 23:36:12.339]  ERROR    fetchOrReturnFaux() error: TypeError: Network request failed
    [Fri Nov 27 2020 23:36:12.416]  ERROR    queuedFetchOrReturnFaux(): error: TypeError: undefined is not an object (evaluating 'error.response.status')
    [Fri Nov 27 2020 23:36:47.239]  ERROR    fetchOrReturnFaux() error: TypeError: Network request failed
    [Fri Nov 27 2020 23:36:47.302]  ERROR    queuedFetchOrReturnFaux(): error: TypeError: undefined is not an object (evaluating 'error.response.status')
    [Fri Nov 27 2020 23:36:47.456]  WARN     Possible Unhandled Promise Rejection (id: 0):
    TypeError: undefined is not an object (evaluating 'error.response.status')
    http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:106292:27
    tryCallOne@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:27058:16
    http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:27159:27
    _callTimer@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:30598:17
    _callImmediatesPass@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:30637:17
    callImmediates@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:30854:33
    __callImmediates@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:2736:35
    http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:2522:34
    __guard@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:2719:15
    flushedQueue@http://10.0.2.2:8081/index.bundle?platform=android&dev=true&minify=false:2521:21
    flushedQueue@[native code]
    callFunctionReturnFlushedQueue@[native code]
    info Reloading app...
    info Opening developer menu...

#### Maybe I should use React Query?

The overview really sells it <https://react-query.tanstack.com/docs/overview>. I have like, ALL of those problems.

Biggest question: can I rate limit its requests?
Looks like the answer is YES!
<https://react-query.tanstack.com/docs/guides/default-query-function>

I can define a 'default query function', which in the example uses `axios.get`.
`smart-request-balancer` also uses Axios... I bet I can glue these things together.

I think that would also work for fetching real/fake data.

... done

### ✅️️ Fix queuing

Now that I've moved to React Query, fetching all bookmarks pauses future queries for 5 minutes.

Done when removing the smart request queue.

### ✅️️⬜️ Cancel outstanding tasks on unmounting a component

If I request data from the network, and then navigate away before it returns and updates the view,
I need to cancel that task or else I will get an error on the console like this:

    [Fri Nov 20 2020 22:24:52.770]  ERROR    Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

Also done when removing the smart request queue.
