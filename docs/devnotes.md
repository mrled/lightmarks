# betterpins

Development notes, whatever.

Emoji legend:

- white large square ⬜️ -- regular to-do item
- white check mark ✅ -- completed to-do item
- trident 🔱 -- large or important feature
- crescent moon 🌙 -- "moonshots", unpolished ideas

## ⬜️ ⬜️ ️⬜️ ️⬜️ ️⬜️ ️️ Todo

### ⬜️ Add simple filters for the feeds

- Do not show Twitter / show only Twitter
- Do/don't display tags, user notes, user name
- Show only bookmarks with notes / do not show bookmarks with notes

### ⬜️ Toggle mock/production mode in app

Maybe even with a visible reminder of what mode I'm in on all screens?

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

### ⬜️ Finish typing the Pinboard library

Make sure all the API calls are properly typed

### ⬜️ 🔱 Implement tag management

- See all untagged bookmarks
- Rename tags
- Group tags with the same prefix (like my `code:typescript`, `code:python`, etc convention)
- Show tags with fewer than X or more than Y bookmarks, as a way to surface too generic or too broad tags

### ⬜️ 🔱 Implement a global API rate limit

Pinboard will rate limit you, and it won't even follow its own docs and use a rate limit message.

- Start by following guidelines in API docs
- Add a back-off mechanism, where it doubles the wait time
- How to manage too many tasks filling it up?

### ⬜️ 🔱 Add a share sheet

The share sheet is the most important feature of the app tbh.
It needs to be perfect.
And it cannot lose data, ever.

### ⬜️ 🔱 Perfect data sync

NEVER LOSE DATA

- If I try to save a link and Pinboard is not responding (down/rate limited/no network), save link for later
- There is no real sync here, because Pinboard API doesn't show me list of events
- That should be ok for saving bookmarks, as saving it again doesn't hurt anything
- For situations where both the client and the server have edited bookmark metadata, there is sadly possibility to lose data. I think these situations will be rare, and I can do the best I can by trying not to delete data. Also, generally, missing description is not as bad as missing whole bookmark.

## 🌙 🌙 🌙 🌙 🌙 Longer, less finished ideas

AKA "moonshots"

These aren't to do items, they're less defined than that. Just thoughts.

### 🌙 Fancy filters for the feeds

- Ignore politics / Show only politics
- Show only long or only short articles

### 🌙 Parse Pinboard HTML for more features

- The /popular/wikipedia page
- Also fandom and Japanese popular pages
- User pages? (Maybe I can just get this wth feeds)
- Perhaps most importantly, on-site SEARCH. I can search the title/url/desc/tags of the local copy of my own bookmarks, but will need Pinboard's help to search the full text of my bookmarks or any public bookmarks!

Looks like e.g. Pushpin is just getting all it can of the recent/popular posts and filtering by wikipedia for its wikipedia screen.
Not sure what it's doing for its fandom screen -- maybe it can tell if a user has fandom enabled, and is just showing posts from those users?

### 🌙 An "On this day" feature, like Day One has

This is a cool feature from Day One; would be pretty cool to have in bookmarks too, I think.

## ✅ ✅ ✅ ✅ ✅ Completed log, finished tasks

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
