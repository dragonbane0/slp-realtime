# `slp-realtime`

[![Build Status](https://github.com/vinceau/slp-realtime/workflows/build/badge.svg)](https://github.com/vinceau/slp-realtime/actions?workflow=build)

This is a real-time slp parsing library.

## Development

### Setup

```bash
git clone https://github.com/vinceau/slp-realtime
cd slp-realtime
yarn install
```

### Build

```bash
yarn run build
```

You can also run `yarn run watch` to continuously build whenever changes are detected.

### Test

```bash
yarn run test
```

### Example Typescript Usage

The following code is not tested! It also assumes you have the Slippi Desktop app set up to relay onto port 1667.

```typescript
import { SlippiLivestream } from 'slp-realtime';

const r = new SlippiLivestream({
    writeSlpFiles: false,
    writeSlpFileLocation: '.'
});

r.on('gameStart', () => {
    console.log('game started');
});
r.on('gameEnd', () => {
    console.log('game ended');
});

r.on('spawn', () => {
    console.log('spawn');
});
r.on('death', () => {
    console.log('death');
});
r.on('comboStart', () => {
    console.log('comboStart');
});
r.on('comboExtend', () => {
    console.log('comboExtend');
});
r.on('comboEnd', (c, s) => {
    console.log('the combo ended');
});

const address = '0.0.0.0';
const port = 1667;
r.start(address, port)
    .then(() => {
        console.log('connected');
    })
    .catch(err => {
        console.error(err);
    });

```
