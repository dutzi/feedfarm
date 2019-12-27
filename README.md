# Feed Farm

![Feed Farm Logo](/public/favicon.png)

## Setup

You'll first have to get a license for GreenSock and place the GSAP SDK in a folder named gsap-sdk.

Then:

```bash
yarn
cd functions
npm i
cd ../
yarn link-shared
```

## Running

```bash
yarn start
```

## Notes

After making changes to the feedfarm-shared/utils file, you'll have to restart the dev server to see them in action

## Setting CORS

```
gsutil cors set cors.json gs://feedfarm-app.appspot.com/
```

## License

MIT
