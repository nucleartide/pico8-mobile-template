# Serve app.
serve:
	@python -m SimpleHTTPServer
.PHONY: serve

# Open browser.
open:
	@open http://localhost:8000
.PHONY: serve

# Serve ngrok.
ngrok:
	@ngrok http 8000
.PHONY: ngrok

# Deploy for testing. You should install the `now` command-line program: https://zeit.co/
deploy:
	@now
.PHONY: deploy
