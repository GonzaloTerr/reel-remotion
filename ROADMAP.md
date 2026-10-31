# Roadmap

Planned work on this service. Estimates are rough and add up to about 28 hours.

## Reliability

- [ ] Add a job queue with status, so a long render does not hold an HTTP request open (6 h)
- [ ] Limit input size and validate image URLs on `/render` and `/render-carousel` (2 h)
- [ ] Add a simple API key to the render endpoints (2 h)
- [ ] Add a health check that also confirms a render can run, and log render time and memory (3 h)

## Tests

- [ ] Add automated tests for text parsing, template choice and music choice (4 h)
- [ ] Add an end-to-end test that renders a short sample video (3 h)

## Templates

- [ ] Move colors, logo and call to action out of the components into a config file (4 h)
- [ ] Replace the deprecated `Audio` usage with the current Remotion API (1 h)

## Documentation

- [ ] Document both endpoints with request and response examples (2 h)
- [ ] Add sample images and text for local testing (1 h)
