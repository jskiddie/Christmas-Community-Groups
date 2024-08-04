> **_NOTE:_**  Currently in Beta. Migration guide below. No helm charts for now open an issue if you need them.

# Christmas Community Groups
In short a Fork of Christmas Community but with groups hacked in. Migration guide is below

![Docker Pulls](https://img.shields.io/docker/pulls/jskiddie/christmas-community-groups?style=for-the-badge)
![Version](https://img.shields.io/badge/dynamic/json?color=orange&label=Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fjskidie%2FChristmas-Community-Groups%2Fmaster%2Fpackage.json&style=for-the-badge)
![Language](https://img.shields.io/badge/Language-JavaScript-DDA000?style=for-the-badge)
![Runtime](https://img.shields.io/badge/Runtime-Node.JS-68A063?style=for-the-badge)
![Docker build](https://img.shields.io/github/actions/workflow/status/jskiddie/Christmas-Community-Groups/docker-image.yml?style=for-the-badge&label=Docker%20build)


Web app for your family's Christmas shopping

## Purpose
To create a simple place for your entire family to use to find gifts that people want, and to avoid double-gifting.

## Screenshots
![Screenshot](screenshots/main.png)
![Screenshot](screenshots/list.png)
![Screenshot](screenshots/link-not-required.png)
![Screenshot](screenshots/name-from-link.png)

## Amazon Smile
By default, Christmas Community converts www.amazon.com links to smile.amazon.com. If you do not want this, set the environment variable SMILE to false (if you are using Docker Compose, make sure to put "false" in quotes).

## Root Path
If you want put Christmas Community on a subdirectory, such as `/christmas-community-groups`, set `ROOT_PATH` to that path.

## Docker
```
docker run --detach --name christmas-community-groups -p 80:80 --restart always jskiddie/christmas-community-groups
```

## Docker Compose
```yml
---
version: "3"
services:
  christmas-community-groups:
    image: jskiddie/christmas-community-groups
    volumes:
      - ./data:/data
    ports:
      # If you want to go to localhost:8080 to access Christmas Community,
      # use - 8080:80 instead of
      - 80:80
    environment:
      # Amazon Smile, set to 'false' to disable www.amazon.com links
      # turning into smile.amazon.com
      SMILE: 'true'
      # Table mode, set to 'false' to revert to box mode
      TABLE: 'true'
      # Single list mode
      # (for weddings, birthdays, etc. only the admin account's list is accessible)
      # Set to 'true' to enable
      SINGLE_LIST: 'false'
      # Some websites (like walmart) send headers that are larger than 8MB in
      # length. If issues are encountered, set the node.js limit to a higher
      # number than 8192
      #NODE_OPTIONS: "--max-http-header-size=32768"
    restart: always
```

## Install

```sh
git clone https://github.com/jskiddie/Christmas-Community-Groups
cd Christmas-Community-Groups
npm install
```

## Configuration
Add environment variables with a .env. Example:
```sh
## Core Settings
# Where to store databases, can be a CouchDB compatible server or directory.
DB_PREFIX=dbs/
# Where to send someone if they need to log in
DEFAULT_FAILURE_REDIRECT=/login
# Port to listen on
PORT=80
# Expose the internal PouchDB with CouchDB API and Fauxton browser. Mostly used for debugging. Leave empty to disable.
DB_EXPOSE_PORT=
# Proxy to send item data requests to. Leave empty to disable.
PROXY_SERVER=
# Secret string to store session cookies with. Automatically generated if not provided.
SECRET=
# How long a user is logged in (milliseconds). Defaults to one week.
SESSION_MAX_AGE=604800000
# The name of the site in the <title> and navigation bar
SITE_TITLE=Christmas Community
# Used when shared to home screen
SHORT_TITLE=Christmas
# The root path for forms, CSS, and a small amount of JS. Useful when proxying.
ROOT_PATH=/
# Where to trust the X-Forwarded-For header from. Defaults to "loopback". Useful for proxying to docker.
TRUST_PROXY=loopback
# Any theme from https://jenil.github.io/bulmaswatch
BULMASWATCH=default
# Set to false to disable update notices
UPDATE_CHECK=true
# Set to false to disable the profile pictures feature
PFP=true
# Language of the interface, options listed in `languages` directory
LANGUAGE=en-US
# Password to enter guest mode,
# e.g. https://wishes.example.com?pw=ReplaceWithYourGuestPassword
# GUEST_PASSWORD=ReplaceWithYourGuestPassword

## Wishlist Settings
# Set to true to not allow users to have their own lists. You may want this for a birthday or wedding.
SINGLE_LIST=false
# Set to false to allow viewing wishlists without logging in
LISTS_PUBLIC=false
# Defaults to true. Set to false for legacy cards view.
TABLE=true
# Convert Amazon links to Amazon Smile links. A percentage of the profit goes to a charity of buyer's choice. Defaults to true.
SMILE=true
# Allow Markdown in item notes. Does not work with TABLE=false. Defaults to false.
MARKDOWN=false
# Enable grouping for the wishlists, please read about Groups in README beforehand, TLDR: After seting to true  click "Migrate to Groups" in setings before any group work
# GROUPING=false

## Custom HTML Snippets
# These are inserted into specific locations in the relevant page
# HTML is not escaped. Don't put untrusted data here.
# CUSTOM_HTML_LOGIN=<p style="margin-top: 1em;">Some custom text for the Login page</p>
# CUSTOM_HTML_WISHLISTS=

# Custom CSS stylesheet
# If you wish to include a custom stylesheet you can add the filename in the variable here.
# Remember to add the stylesheet to the filesystem at `static/css/custom.css`. In docker, mount `/usr/src/app/src/static/css/custom.css`.
# CUSTOM_CSS=custom.css
```

## Default Profile Pictures
To replace the default snowman profile pictures, replace the files in `static/img/default-pfps`. In docker, mount `/usr/src/app/src/static/img/default-pfps`.

## Startup
```sh
npm start
```

## Setup
Visit `/` on the HTTP server to add an admin account.

## Adding Sites
Christmas Community gets data about products automatically with [Wingysam/get-product-data](https://github.com/Wingysam/get-product-data). Please submit pull requests for new sites or fixes for changes to existing sites!

# Grouping
## Setup
- ADD an ENV GROUPING and set it to true 
- By default grouping is disabled for everyone
- create a new group under settings
	- type in a group name
	- click "add group"
- add a user to the group by clicking "edit" on the corrosponding group
	- type in the correct name of the user under "username"
	- click "Add users to group"
- once a user is added to a group grouping is enbaled for them, from then on they can only see lists of people in their group,
  their lists can be seen by everyone they share a group with as well as users for whom grouping is disabled

## How to migrate from "normal" Christmas Community 
**TLDR:** make shure existing db is copied to or accessed from Christmas Community Grouped

- Make and be shure you have a working backup.
- ADD an ENV GROUPING and set it to true
- Continue depending on your setup 
  - **docker:**
    - copy database from existing container to temporary folder e.g.`docker cp christmas-community:/data/ /tmp/data` 
    - start the new container `See paragraph Docker` and stop it e.g.  `docker stop christmas-community-groups` 
    - copy database back into container e.g. `docker cp  /tmp/data christmas-community-groups:/`
  - **docker-compose:**  
    - swap the image in your docker_compose.cml for  `jskiddie/christmas-community-groups`
  - **npm** 
    - Run install and copy the dbs folder (and secret.txt) from the christmas-communitys module folder to the christmas-community-groupss module folder (and secret.txt as well)
- Start up your instance. (it is reccomended nobody accesses the server until completion of the Setup)
- Go to Settings and click the "migrate to groups button"
- Click "Migrate"
- Continue as seen above under Setup under Grouping
