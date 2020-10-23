<p align="center">
  <a href="https://pico8-mobile-template.jasontu.now.sh"><img width="500" alt="PICO-8 on iOS" src="https://user-images.githubusercontent.com/914228/67862906-2dd40a00-fae0-11e9-832a-a592029f350f.png" ></a><br />
  ☝️ <strong><em>Press the image on mobile to try the demo</em></strong> ☝️
</p>

<br />

<p align="center">
  <strong>PICO-8 Mobile Template</strong><br />
  (PI)CO-8 ❖ (R)eact ❖ (P)rogressive Web App ❖ (<em>PIRP Stack</em>)
</p>

<br />

## Motivation

Imagine this scenario.

You meet someone new, and they ask the inevitable question:

> _What do you do in your spare time?_

You, being the consummate PICO-8 user that you are, respond:

> _Well, I make video games. I use this thing called PICO-8, which is a fantasy console that uses Lua, and it has a built-in pixel art editor, and–_

Your new friend's eyes glaze over. Heck, maybe they aren't even a new friend anymore.

Wouldn't it be better if you could say this?

> _Well, I make video games. If you take out your phone and go to `https://funnydomain.name/`, you can play it right now!_

Your new friend whips out their phone, visits `https://funnydomain.name/` as directed, and starts playing your game right in their mobile browser.

> _Woah, that's so badass! You have an awesome hobby._

PICO-8 Mobile Template enables that kind of conversation.

<br />

## What is it exactly?

PICO-8 Mobile Template provides a starting point for porting your PICO-8 game to mobile devices. It uses two key technologies: React.js and Progressive Web App (PWA) features.

1. <a href="https://reactjs.org/" target="_blank">React.js</a> is an industry-standard JavaScript library that enables you to build user interfaces in a modular, component-based fashion.

2. <a href="https://developers.google.com/web/progressive-web-apps" target="_blank">Progressive Web App</a> (PWA) is a development philosophy, where you want your app to behave as closely as possible to a mobile app. Concretely, this means that a user can install your app on their mobile device, and play your app as if it were a standalone mobile app.

The second point is especially important, as PICO-8 currently lacks export options for iOS and Android. We must export to web, and make things work on mobile web.

<br />

## Get started

### 1. Generate a new repository from this template

> <a href="https://github.com/nucleartide/pico8-mobile-template/generate" target="_blank">Hold <kbd>Ctrl</kbd> (Windows) or <kbd>Command</kbd> (Mac), then click this link</a>

<br />

### 2. Start the development web server

Clone your generated git repository locally. Then, to start the development web server, run the command:

```
$ make serve
```

> _**Note:** If you're on Windows, `make serve` may not work._
>
> _But you basically need to start a web server so you can serve the repo's files locally._

Open a browser and navigate to `http://localhost:8000/`. You can also use a helper command, which does the same thing:

```
$ make open
```

<br />

### 3. Develop

If you are using Google Chrome, you should configure your Developer Tools such that Chrome displays the site in phone resolution:

<p align="center">
  <img width="1454" alt="Screen Shot 2019-10-30 at 8 24 34 AM" src="https://user-images.githubusercontent.com/914228/67872353-10f30300-faef-11e9-80ee-0b39775396a8.png">
</p>

At this point, feel free to play around with the app.

Click around. Examine the project's files. Tweak the code, refresh the browser, and study any changes in the webpage's behavior.

<br />

### 4. Test on mobile

Once you have your bearings, we can load the game on an actual mobile device.

> _**Note:** Please install [`ngrok`](https://ngrok.com/) before proceeding below._

To do this, I opt for using `ngrok` to expose our locally-running web server publicly. Run the following command:

```
# You can also run `make ngrok` for convenience, which does the same thing.
$ ngrok http 8000
```

Note the URLs in `ngrok`'s terminal display:

<p align="center">
  <img width="801" alt="Screen Shot 2019-10-30 at 8 32 20 AM" src="https://user-images.githubusercontent.com/914228/67872873-d047b980-faef-11e9-80b8-cce72b7e970a.png">
</p>

Then, navigate to the `https://` URL above (`https://486f2bce.ngrok.io/` in this case) on your mobile device.

This is important: you will not be able to "Add to Home Screen" if accessing an `http://` (not `https://`) site.

In landscape mode, the site should resemble the image below:

<p align="center">
  <img width="500" alt="PICO-8 on iOS" src="https://user-images.githubusercontent.com/914228/67862906-2dd40a00-fae0-11e9-832a-a592029f350f.png">
</p>

<br />

### 5. Test the "Add to Home Screen" button

If you click the "Share" button (whose appearance depends on your mobile operating system and browser), you can verify that the "Add to Home Screen" button appears:

<p align="center">
  <img width="533" alt="Home Screen" src="https://user-images.githubusercontent.com/914228/67873512-cb373a00-faf0-11e9-8e30-25daee4dad70.PNG">
</p>

Upon clicking the "Add to Home Screen" button, you'll be able to see the game as a true, standalone app in your Home Screen:

<p align="center">
  <img width="300" alt="Add to Home Screen" src="https://user-images.githubusercontent.com/914228/67873510-cb373a00-faf0-11e9-9516-e48c53ad4870.PNG">
</p>

_Pretty cool_, eh?

Try pressing on your standalone app's icon. Note that _everything_ is customizable: the splash screen, the game shell, the touch controls. You can tweak to your heart's content later.

For `now` (pun intended), let's deploy the game to a more permanent public address.

<br />

### 6. Deploy

To deploy, one only needs to host the repository's files somewhere, and serve the files over `https://`.

There are many static file hosts. I like [Zeit's `now`](https://zeit.co/), but feel free to use your preferred host.

If you have Zeit's `now` command-line program installed, you can deploy as follows:

```
$ now
```

Which will output something like the following:

```
$ now
> NOTE: Deploying to Now 2.0, because no Dockerfile was found. More: https://zeit.co/docs/version-detection
> Deploying ~/Repositories/progressive_web_app_test under jasontu
> Using project progressive_web_app_test
> Synced 2 files [139ms]
> NOTE: This is the first deployment in the progressive_web_app_test project. It will be promoted to production.
> NOTE: To deploy to production in the future, run `now --prod`.
> https://progressivewebapptest-68b5vw2ag.now.sh [1s]
⠏ Queued...> Ready! Deployed to https://progressivewebapptest.jasontu.now.sh [in clipboard] [3s]
```

And voilà!

You deployed your game to a web host, and you can share your game's URL (in this case, `https://progressivewebapptest.jasontu.now.sh/`) with anyone who wants to play your game.

<br />

## Configuration

PICO-8 Mobile Template provides a _rough_ starting point; it is not plug-and-play. You should study the included files, and modify the code to suit your desired user experience.

I left many code comments, which should hopefully ease understanding. Also, below is a description of the file structure:

```
.
├── Makefile # Helper commands for convenience. Requires `make` to be installed.
├── app.css # Your app's CSS stylesheet. Controls your app's visual appearance.
├── app.js # Your app's JavaScript. Contains the game shell's React.js components.
├── images # Your app's icon images. Customizable through `manifest.json`.
│   ├── icon_128x128.png
│   ├── icon_144x144.png
│   ├── icon_152x152.png
│   ├── icon_192x192.png
│   ├── icon_256x256.png
│   ├── icon_32x32.png
│   ├── icon_512x512.png
│   └── pico8_logo_vector.png
├── index.html # Your app's HTML page.
├── jelpi.js # The JavaScript exported by `export <your game>.js` in PICO-8. You should replace this file, and update the filename in `app.js`.
├── manifest.json # Progressive Web App configuration.
└── service_worker.js # Customize offline caching behavior here.
```

<br />

## Support

Please open a GitHub issue if something is unclear.

While I'll try my best to respond, please remember that I have a full-time job, as well as general adult time commitments!

> <a href="https://github.com/nucleartide/pico8-mobile-template/issues/new" target="_blank">Hold <kbd>Ctrl</kbd> (Windows) or <kbd>Command</kbd> (Mac), then click here to open a GitHub issue</a>

<br />

## Who am I?

**@nucleartide** is the online alias of Jason Tu.

As of this writing, I work at [**@segment**](https://github.com/segmentio) by day, and hack on PICO-8 projects by night. I love PICO-8, and I think its creative constraints suit time-strapped people very well.

For more quips about PICO-8, please follow me on Twitter at [**@nucleartide**](https://twitter.com/nucleartide).

---

> Team Avocado: https://teamavocado.co/
