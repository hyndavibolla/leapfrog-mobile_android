# LeapFrog mobile application

This is the repository for the LeapFrog mobile application. It is constructed using React Native.

# Usage

## How to work with this repository

1. Clone this repository to your local machine

   ```console
   git clone git@github.com:ShopYourWay-Leapfrog/leapfrog-mobile.git
   ```

2. (TODO: Install / run steps.)

- `yarn install` installs dependencies. It should be used in favor of npm to use the lock file
- `yarn android` starts application on android
- `yarn ios` starts application on ios
- `yarn start` starts the bundler which serves the react native application (js code)
- `yarn start:android` starts the bundler which serves the react native application (js code) on android emulator
- `yarn start:ios` starts the bundler which serves the react native application (js code) on ios simulator
- `yarn storybook` starts the bundler which serves the storybook application (js code)
- `yarn storybook:android`: starts the bundler which serves the storybook application (js code) on android emulator
- `yarn storybook:ios`: starts the bundler which serves the storybook application (js code) on ios simulator
- `yarn test` runs tests
- `yarn react-native` access to the locally installed react native cli

## Branching strategy

This repository follows the gitflow methodology, with its main branch being `main`, instead of the usual `master`. For more explanations on the branch name see [this article](https://www.zdnet.com/article/github-to-replace-master-with-alternative-term-to-avoid-slavery-references/). For more explanation on gitflow, see [the GitFlow Workflow explained](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

## Sending changes

Every code modification that introduced and modifies behavior, or attaches documentation (this is, mostly all changes) should go through a code review process. This code review requires at least two team members from seeing and approving the pull request.

Push your changes into a branch. **Do not push directly to `main`.** Create a PR and explain your changes. The team will be notified and will participate providing a code review.

The title of each PR must have the following format:

`[<jira-ticket-id>] <Description>`

Where `<jira-ticket-id>` is something like LEAP-123 and `<description>` by general, is the Jira ticket description, but if this is too long you must summarize it.
If you don't have any ticket assigned, generally technical tasks, just put `[NO-TICKET] <Description>`.

For more information on how to send and explain your changes, read [How to create a Good Pull Request](https://blog.alphasmanifesto.com/2016/07/11/how-to-create-a-good-pull-request/).

For more information on how to review other's code and provide feedback, read [How to Perform a Good Code Review](https://blog.alphasmanifesto.com/2016/11/17/how-to-perform-a-good-code-review/).

## Merging code

Every merge to the main branch should be a squashed commit that includes all of the changes discussed in the PR and the final state of those changes. We follow the modifications specified in the [git-rebase-squash](https://github.com/MakingSense/development-guidelines/blob/master/git-workflow/README.md).

# Standards and conventions

See more at our [Conventions documentation](CONVENTIONS.md)

# External libraries / systems used

You can see our list of external libraries used in our [External licenses documentation](EXTERNAL-LICENSES.md).

This document can be regenerated with the following command:

```console
yarn generate-licenses
```

# Environments

There are four environments: DEV, QA, UAT, and PROD. There is one dotenv file for each environment where we can put variables to use it across the app.
These dotenv files are located at `./envs` and to switch between environments you first have to run:

```yarn env:desired-env```

For example, if you want to switch to QA env, you must do:

```yarn env:qa```

This is going to copy the contents of `./envs/.qa` file and paste them into the `./.env` file, that finally, is the file that the app will read.

Last but not least, after switching environments, you must run the app clearing the cache by doing:

```yarn start --reset-cache```

### Important note!
In order to run the tests we have defined another environment called `.test` located in `./envs` folder. When you run `yarn test` the first thing that it does is to set the environment to test, as a result of that the `./.env` file is generated with all the content of `./envs/.test`.
There is a possibility of you not seeing these changes reflected on the environmental variables and that would be because of jests's cache. To solve that, you must run:

```yarn test --clearCache```

# Troubleshooting

## I am not notified of new PRs

- Verify that you're following the repository.
- If you don't want to, you can add your name to the [CODEOWNERS file](.github/CODEOWNERS). Notice that you can add paths and file types.
- Verify what email address is associated to your GitHub user, in your user settings.

## I accidentally pushed a change

- Notify the team immediately.
- Contact your technical leader to undo the changes.

# Technical Documentation

## This project uses:

- [React Native with Typescript](https://reactnative.dev/docs/typescript)
- [React Navigation](https://reactnavigation.org/)
- [Emotion](https://emotion.sh/docs/@emotion/native) for styling

## State Management

> This project uses **react context** and **react hooks** to handle state management in a fashion similar to a **redux/middleware** combination.

State management itself is achieved by using a **root level global context provider**, exactly as we would do by using _redux_. The **state object** and **dispatch function**s are exposed by the **global context** and consumed wherever needed. It's recommended that component's consuming the context directly are few and as top level as possible encouraging the use of presentation components which are a lot simpler to test and maintain.
> **Side effects** _(for instance fetching data from the server and storing it on the global context)_ are handled by **custom hooks**. These hooks will have access to a **deps** _(dependencies)_ object which will serve as an abstraction for all external services uses _(from the custom hook itself)_. This will allow us to have access to all necessary data/functionality needed for our hooks, as well as an easy strategy for testing _(in which **deps** will be replaced by a mocked version)_.

### Global provider setup

```typescript
export const GlobalProvider = (...) => {
  const [state, dispatch] = useReducer(
    combineReducers<IGlobalState>({ artist: artistReducer }), // global state/reducer map
    initState // initial global state
  );
  // dependency meant to access the "current" state without depending on react's life cycle.
  // This is meant to be used in cases where a custom hook altered the state by dispatching an action,
  // either by itself or by invoking another custom hook, and needs access to the latest state version
  useEffect(() => deps.stateSnapshot.set(state), [state]); 
  
  // exposing the state, dispatch and dependencies object
  return <GlobalContext.Provider value={{ state, dispatch, deps }}>{children}</GlobalContext.Provider>; 
});
```

### Global provider instance

```typescript
export const AppRoot = () => {
  return (
    <GlobalProvider deps={getDeps()}>
      <>/** ...application */</>
    </GlobalProvider>
  );
};
```

### Custom hook with state management side effect

```typescript
export const useArtistEffect = () => {
  const { dispatch, deps } = useContext(GlobalContext); // accessing dispatch and dependencies used by all these callbacks
  const searchArtist = useCallback(
    async (search: string) => {
      // deps.stateSnapshot.get().artist.artistMap // to get a snapshot of the current state
      const { artists } = await (await deps.apiService.request(`url.com?s=${search}`)).json();
      const [artist] = (artists || []) as IArtist[];
      if (artist) dispatch(actions.searchSuccess(artist)); // dispatching action which will create a new state version
      return artist?.idArtist; // returning information to be used locally by the component
    },
    [dispatch]
  );
  return useMemo(() => ({ searchArtist }), [searchArtist]); // returning callbacks
};

/* insde the component */
const { state } = useContext(GlobalContext);
const { searchArtist } = useArtistEffect();

const id = await searchArtist('search criteria'); // searching for artist and storing the searched artist's id *probably in a local state*
const artist = state.artist.artistMap[searchState.id]; // accessing the global state where all *up to date* artists are stored and selecting the artist this components needed to fetch
```

## Testing

> This project is prepared to be tested **without the need** of using tools such as _jest.mock_. Instead it uses strategies like **dependency injection**

### Testing a component that consumes the global state provider

```typescript
describe('Item', () => {
  it('should render', () => {
    const { toJSON } = render(
      <GlobalProvider // A provider is created using the real "GlobalProvider". In this case, we pass down the provider's props our mock dependencies and inital state
        deps={getMockDeps()}
        initState={{ ...initialState, artist: { ...initialState.artist, artistMap: { [getArtist_1().idArtist]: getArtist_1() } } }}
      >
        <Item route={{ params: { id: getArtist_1().idArtist } }} /> // Routes in this case are consumed by props
      </GlobalProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Testing a custom side effect that uses the global state provider

- Note in this case we are using the *real combined reducers** to also test integration with the state management system. If we wanted to isolate this test to strictly unit test this hook, we could customize the **GlobalProivder** to take a the **combined reducers** function or map as a prop with whatever mock we need.

```typescript
it('should fetch an artist', async () => {
  const deps = getMockDeps(); // mock dependencies
  deps.apiService.request = () => Promise.resolve({ json: () => Promise.resolve({ artists: [getArtist_1()] }) }); // customizing a dependency to fit this test
  const wrapper = ({ children }: any) => <GlobalProvider deps={deps}>{children}</GlobalProvider>; // wrapper to be used by "@testing-library/react-hooks" so we can access the global state provider
  const { result } = renderHook(() => useArtistEffect(), { wrapper });
  let id: string;
  await act(async () => {
    id = await result.current.searchArtist(getArtist_1().strArtist); // getting the id returned by our custom hook (expected to be the one we customized on the mock dependencies)
  });

  expect(deps.stateSnapshot.set).toBeCalledTimes(2); // global state was set 2 times (one by the initial setup and one by this hook's execution)
  expect(deps.stateSnapshot.set).toBeCalledWith({
    ...initialState,
    artist: { ...initialState.artist, artistMap: { [getArtist_1().idArtist]: getArtist_1() } } // global state was set by this hook with the expected data from our mock
  });
  expect(id).toEqual(getArtist_1().idArtist); // id returned by this hook is the one in our mock dependency
});
```

## App Screen Orientation
The app is locked to portrait orientation, to revert that you must do the following actions:

* For android, in  android/app/src/main/AndroidManifest.xml remove the line `android:screenOrientation="portrait"`
* For ios, in ios/Leapfrog/Info.plist add these two lines (UIInterfaceOrientationLandscapeLeft, UIInterfaceOrientationLandscapeRight):

  ```
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
  ```

# Finally

Everything is debatable: if you have an idea that might improve the tools, the workflow, the standards, please discuss it with the team! We're always open to changing for something better.

And last but not least, have fun.
