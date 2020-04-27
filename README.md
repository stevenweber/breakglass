Breakglass
---

<img src="https://www.almacctv.com/web/wp-content/uploads/2016/03/Emergency-Break-Glass-YH-900D.jpg" />

## Development

    make setup
    make test

If you would like to functionally test out code or play around with endpoints, use

    make run-development

You can change action inputs values in the `.env` file and change the event payload in the `.github_event.json`.
It also automatically injects your GitHub token like actions do.

## Packaging

    make clean dist/index.js
