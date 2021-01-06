# ⬜️ ⬜️ ️⬜️ ️⬜️ ️⬜️ ️️ Todo

Remaining work.

## Tasks

### ⬜️ Fix network error

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

### ⬜️ Use some secret gesture to bring up DebugInfo

It's nice to have, but it would be nicer if it weren't a tab.
Maybe a 4 finger swipe or some other gesture that's unlikely to be accidental would be better.

### ⬜️ Add simple filters for the feeds

- Do not show Twitter / show only Twitter
- Do/don't display tags, user notes, user name
- Show only bookmarks with notes / do not show bookmarks with notes

### ⬜️ Build an in-app web view

This is exceptionally lazy, but: see the devnotes I added in ebd6be97e3dd990e9eafbdcae947a71882697ce2.
They contain a link or two and some thoughts.
(And I reverted that commit right after.)

### ⬜️ Discover tab: add screen for filtering bookmarks in public feed

- Filter by username
- Filter by up to three tags
- Search within those results (not sure how to make clear in UI)

### ⬜️ Profile tab: add features

- See all/public/private/unread/tagged/untagged bookmarks
- Expose all of the rest of the API
- See network

### ⬜️ Finish typing the Pinboard React Query hooks

- Type return values
- Use a generic `.getJson<ReturnType>()` -like function to set `ReturnType` so I know what to expect the raw API results to be. See the stuff I just did in the PinboardApi for examples.
- Use `OneToThreeStrings` or `YesOrNo` as appropriate
- While I'm there, make sure all HTTP calls (API, Feeds, anything) are going in to a named queue.

### ⬜️ Cache results of API calls

- Cache results of API calls
- Always show when data was last updated
- If the data is new enough, don't bother contacting API at all
- What's new enough? Probably depends on the API call.
- If data is too old, show cached data and note that it's loading newer data in the background
- If data is nonexistent, just note that it's loading

Should we let users force request new data from API?

- Maybe a pull to refresh mechanism
- Brute force: delete local caches button in settings

One idea: a `Local cache` control panel that pops up or over or something

- Anything that holes cached data has a panel like this
- "Force refresh now" button
- Displays info on when item was last cached etc

UPDATE: I think this is done now that I'm using React Query, but need to do some testing.

### ⬜️ Fix queuing

Now that I've moved to React Query, fetching all bookmarks pauses future queries for 5 minutes.

### ⬜️ Work perfectly offline

This is part of caching results and perfect data sync.

Maybe with this? <https://github.com/rgommezz/react-native-offline>

### ⬜️ Cancel outstanding tasks on unmounting a component

If I request data from the network, and then navigate away before it returns and updates the view,
I need to cancel that task or else I will get an error on the console like this:

    [Fri Nov 20 2020 22:24:52.770]  ERROR    Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

### ⬜️ 🔱 Implement tag management

- See all untagged bookmarks
- Rename tags
- Group tags with the same prefix (like my `code:typescript`, `code:python`, etc convention)
- Show tags with fewer than X or more than Y bookmarks, as a way to surface too generic or too broad tags

### ⬜️ 🔱 Add a share sheet

The share sheet is the most important feature of the app tbh.
It needs to be perfect.
And it cannot lose data, ever.

- Extremely fast, single view. No animations shifting over to the right to edit the description or add tags.
- Never lose data. If it can't post to the server, must save operation and try again later.

#### Share sheet steps

- Using <https://github.com/meedan/react-native-share-menu>
- When adding `ShareViewController.swift` from the `node_modules` directory, it asked me if I wanted to create a `LightmarksShare-Bridging-Headers.h`... I said NO here.
- For the new share extension target you create, it has you update your Podfile.
  It tells you to manually link the packages there... I think this is different from the normal target,
  which autolinks them... I think manually linking them gives you more control so your extension doesn't get too big.
  (There is a RAM limit for share extensions.)
- I chose `Lightmarks://` for the URL scheme unique to my app
  - The docs are fucking silent about this, but it's clear from the example that you enter this twice in different formats
  - In your app's `Info.plist`, you enter it without the `://`. For intance, if your scheme is like `ExampleApp://`, you would enter `ExampleApp` only.
  - In the share extension's `Info.plist`, you enter it WITH the `://`, like `ExampleApp://`.
- Got an error about ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES bring overridden, fixed via
  <https://stackoverflow.com/questions/40191140/cocoapods-1-1-1-target-overrides-the-always-embed-swift-standard-libraries>
- There's a separate page "Custom iOS Share View
  <https://github.com/meedan/react-native-share-menu/blob/master/SHARE_EXTENSION_VIEW.md>
  ... if you don't do this, you get a default modal from iOS that has Cancel and Post buttons, a preview of the page you're sharing, and an editable text box that contains the HTML title of the page by default.
- I did also make a custom share extension view
  - Without this, you use an OS default share sheet thing, which I haven't seen since like iOS 5 or something, everyone customizes this now
  - The share extension view is a separate entrypoint in your app, from Node's perspective
  - Will commit it with example code from `react-native-share-menu` and add a real bookmark add screen in another commit

Update: ok, I did get the AddBookmark screen on the share sheet.
However, it doesn't seeme to actually submit anything.
My guess is that the share sheet process is getting killed and the submission is cancelled.

#### Actually saving the result and sending the data

- I should use NSUserData to save data from the extension into the app
  <https://stackoverflow.com/questions/24118918/sharing-data-between-an-ios-8-share-extension-and-main-app>
- I could use that + to save the shared bookmark to some kind of queue, which the app can read from
- I also want to start a background process to handle updloads
  - Looks like there is an iOS function for `NSURLSessionConfiguration` called `backgroundSessionConfigurationWithIdentifier`
  - ex: <https://github.com/EkoLabs/react-native-background-downloader>
  - ex: <https://github.com/Vydia/react-native-background-upload>
  - Swift code: <https://stackoverflow.com/questions/52567979/background-upload-with-share-extension>
- App will need to support "Finite-length tasks"
  - <https://www.raywenderlich.com/5817-background-modes-tutorial-getting-started#toc-anchor-008>
- I _think_ what I want is to have it dismiss immediately, without a "Saved!" notification like Pinner has...
  ... but it has to be 100% trustworthy
- Some options for data sharing: <https://dmtopolog.com/ios-app-extensions-data-sharing/>
- Based on that list, I wonder if database sharing (using the filesystem) is a better way than `NSURLSessionConfiguration`.
  Because: this way the queue is the only thing submitting HTTP requests,
  and the share extension is only saving to the queue and then asking the queue to start work
  (which the queue may do immediately, or may wait for earlier actions to do first).
- That makes me think of another thing: I could use the priority of `smart-request-balancer`
  to distinguish between background API calls and user-initiated API calls.
- Some details on `NSUserDefaults`: <http://dscoder.com/defaults.html>

### Show a list of unresolved actions in the UI

If there are actions that haven't been completed yet, like adding a new bookmark,
show that the action is still in the queue and what its state is.
A way of convincing users that the app is trustworthy by allowing them to verify it.

### ⬜️ 🔱 Perfect data sync

NEVER LOSE DATA

- If I try to save a link and Pinboard is not responding (down/rate limited/no network), save link for later
- There is no real sync here, because Pinboard API doesn't show me list of events
- That should be ok for saving bookmarks, as saving it again doesn't hurt anything
- For situations where both the client and the server have edited bookmark metadata, there is sadly possibility to lose data. I think these situations will be rare, and I can do the best I can by trying not to delete data. Also, generally, missing description is not as bad as missing whole bookmark.

### ⬜️ 🔱 Excellent PDF support

- Pull titles from PDF metadata
- Can I make the app doing anything useful while a PDF is loading? Is there a way to asynchronously load?
- Some kind of sane tag suggestion, even if it's just local

### ⬜️ 🔱 On-device read-later

- Add a reader mode
- Automatically strip garbage from webpages
- Option to pull archive version from Pinboard
- Keep reading progress perfectly - never lose your place, even if the app is force quit or the device reboots, goddamit.
