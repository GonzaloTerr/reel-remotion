# reel-remotion

A small self-hosted service that renders vertical videos (1080x1920) and carousel images from an HTTP request, built with [Remotion](https://www.remotion.dev). I built it for my own Instagram content, to stop paying per render on a hosted video API.

An automation sends a text and an image, the service renders the result and returns a URL.

## Built with

Node.js, Express, React, TypeScript, Remotion and Docker.

## Run it locally

```bash
npm install
npm run studio     # opens Remotion Studio to view and edit the templates
npm run render     # renders a test video to out/reel.mp4
npm start          # starts the HTTP server on port 8080
```

## Endpoints

`GET /` is the health check. It returns `{ "status": "ok", "bundled": true }`.

`POST /render` renders a 15-second video:

```json
{
  "texto": "Pain point | Solution",
  "imagen": "https://example.com/background.jpg",
  "hashtags": "#automation #ai",
  "variant": 2,
  "music": "track.mp3"
}
```

`variant` (0 to 3) and `music` are optional: if you leave them out, the service picks one at random. It returns `{ "url", "variant", "music" }`.

`POST /render-carousel` renders 4:5 images:

```json
{
  "imagen": "https://example.com/background.jpg",
  "slides": [
    { "kind": "cover", "titulo": "Title" },
    { "kind": "content", "titulo": "Point", "cuerpo": "Details" },
    { "kind": "cta", "titulo": "Call to action" }
  ]
}
```

Rendered files are served by the service itself and deleted automatically after a while.

## Deploy

The repository includes a `Dockerfile`. Build it, expose the container on port 8080 and set the variables from `.env.example`. The first build downloads a headless browser, so it takes a while.

Rendering uses headless Chromium, which needs a lot of memory, so renders run one at a time with concurrency 1.

## Plans

See [ROADMAP.md](ROADMAP.md).

## License

The code in this repository is under the [MIT License](LICENSE).

The music tracks in `public/music/` are third-party files and are not covered by the MIT License: each one keeps the license of its author. Remotion, a dependency, has [its own license](https://www.remotion.dev/license), which is free for individuals and small teams.
