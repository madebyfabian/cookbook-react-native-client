1. To get this project started, create a ".env" in the root folder. The minimal config is:
```bash
FIREBASE_APIKEY=xxx
FIREBASE_AUTHDOMAIN=xxx.firebaseapp.com
FIREBASE_FUNCTIONS_BASEURL=xxx.cloudfunctions.net/xxx
```

2. To have a proper vscode experience, add this to your global (!) `settings.json` of vscode.
```json
{
	// ...
	"material-icon-theme.files.associations": {
    "index.js": "Javascript-map"
  }
}
```