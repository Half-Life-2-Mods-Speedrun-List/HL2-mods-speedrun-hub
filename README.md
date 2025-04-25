# Half-Life 2 Mod speedrun hub

## Table of contents
- [Overview](#Overview)
- [Technologies](#Technologies)
- [Team members](#Team&nbsp;members)
- [Installation](#Installation)
- [Live demo](#Live&nbsp;Demo)

## Overview
The purpose of this project is to provide a home for listing useful resources for various Half-Life 2 modifications, primarily focusing on its speedrunning community. Half-Life 2 speedrunning community's resources has had a history of being scattered among multiple websites and spreadsheets, and the goal of this hub is to bring most of it to a single place for ease of access and make it less tedious to navigate through various resources.
Users of this site can view and create following content:
  - Dedicated pages for each mod
  - Resource links for every mod, such as download links and speedrun.com links
  - Tutorials and strategies to help new runners and preserve otherwise hard-to-find information
  - World record history for each speedrun category
  - User-specified ratings to evaluate the enjoyment and difficulty of each category, and to assess how optimized the current world record is

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
