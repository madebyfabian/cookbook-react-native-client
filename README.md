1. To get this project started, create a ".env" in the root folder. The minimal config is:
```bash
# Firebase General
FIREBASE_APIKEY=xxx
FIREBASE_AUTHDOMAIN=xxx.firebaseapp.com
FIREBASE_PROJECTID=xxx
FIREBASE_APPID=xxx

# Firebase iOS
FIREBASE_IOS_DEV_CLIENTID=xxx.apps.googleusercontent.com
FIREBASE_IOS_PROD_CLIENTID=xxx.apps.googleusercontent.com

# Firebase Functions
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