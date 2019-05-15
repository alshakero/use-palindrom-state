# usePalindromState: a Palindrom-React hook

This custom React hook helps you use Palindrom in your React apps with much ease.

### Install

```sh
npm i use-palindrom-state
```

### How to use

1. To initiate a Palindrom connection, you need to call `setupPalindromConnection` and preferably wait for it to resolve.
2. Then you can use the `usePalindromState` hook across your app.

Example:

```js
import React from 'react';
import { setupPalindromConnection, usePalindromState } from 'use-palindrom';

const options = {
    remoteUrl: 'http://localhost:8080/palindrom'
}

/* this needs to be done once. But there is no harm if you do it multiple times,
it will resolve immediately if the connection is setup already */
setupPalindromConnection(options);

export default HelloWorld() {
    const state = usePalindromState();
    return <div>Hello {state.user.name}!</div>
}

```

## Note

If you mutate the state before the connection is established, the changes will be lost. This is the duration that is spent until `setupPalindromConnection`'s returned promise resolves. To make sure that doesn't happen, wait for `setupPalindromConnection`'s promise to resolve before calling `usePalindromState` or mutating the state.

## License

MIT
