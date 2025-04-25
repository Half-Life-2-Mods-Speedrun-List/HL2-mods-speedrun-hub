# Half-Life 2 Mod speedrun hub

## Table of contents
- [Overview](#Overview)
- [Technologies](#Technologies)
- [Team members](#Team&nbsp;members)
- [Installation](#Installation)
- [Live demo](#Live&nbsp;Demo)

## Overview

## Technologies

## Team&nbsp;Members

## Install & Run
  - Clone the repository
  - Navigate to the server folder and install dependencies.
```
$ ~/server npm install
```
- Set up the environment variables required for database configuration.
- Run the database container
```
$ ~/server docker-compose up -d
```
- Run the backend server
```
$ ~/server npm run devStart
```
- Serve the static frontend files to a browser by using [http-server](https://github.com/http-party/http-server) or [Live server Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=yandeu.five-server)

## Live Demo
https://hl2-mods-speedrun-hub.onrender.com/
