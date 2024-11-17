# DormSoup

This is frontend repo for [DormSoup](https://dormsoup.mit.edu). For privacy reasons, only authenticated MIT students could visit the website.

## Directory Structure

The project structure should be:

- DormSoup
  - dormsoup
    - (other files)
    - .env (ask andiliu for the file)
    - public/fonts (ask andiliu for the file)
  - dormsoup-daemon

## Setting up for developing locally

After we put your keys in authorized_keys in the server, you put this in your local `.ssh/config`:

```bash
Host DormSoup
  HostName dormdigest.mit.edu
  User dormsoup
  SetEnv GIT_AUTHOR_NAME="YOUR_NAME_HERE" GIT_AUTHOR_EMAIL=YOUR_EMAIL_HERE
  ForwardAgent yes
  IdentityFile ~/.ssh/id_rsa_dormsoup
```

where `YOUR_NAME_HERE` and `YOUR_EMAIL_HERE` are the name and email you want to use.

Then `cd` into `dormsoup` to run `npm install` to install the dependencies.

## Developing locally

First start the ssh connection to forward the local 5432 port to the DormSoup database:

```bash
ssh DormSoup -L 5432:localhost:5432
```

**Important note**: Even though it says `localhost`, the database is on the server, not on your computer. Be careful with any destructive actions. (Check the [daemon repo](https://github.com/DormSoup/dormsoup-daemon) for instructions of setting up a local development database.)

![port forwarding diagram](https://i.sstatic.net/QcwEn.png)

You can read <https://stackoverflow.com/questions/5280827/can-someone-explain-ssh-tunnel-in-a-simple-way> for an explanation about port forwarding, or you could find other results on the web or maybe even on `man ssh`.

Then (on a different tab) run `npm run dev` at the `DormSoup/dormsoup` root folder, go to `http://localhost:3000` to checkout the website.

## Common issues

- If getting `public key denied` during `ssh`, check if you correctly capitalized `DormSoup`
- If the website keeps loading after `npm run dev`, check the dev console for errors. It is possible that the connection to database is not setup correctly possibly due to incorrect `.env` files
  - Same if you see a page asking you to sign in. Sign-in should happen automatically, but the if `.env` file is not configured correctly, then auth won't work
- If some icons are not correctly loading after `npm run dev`, you need to get the `public/fonts` files from andiliu

## Developing practices

- Open new branches and PR while developing

<!-- ## Screenshots

<img width="1439" alt="image" src="https://github.com/DormSoup/dormsoup/assets/60227494/0f9620cb-68f5-4f15-bedd-d440e81f53b8">

<img width="1435" alt="image" src="https://github.com/DormSoup/dormsoup/assets/60227494/d53006c5-229e-45f2-a044-a488f0764be2"> -->

<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
 -->
