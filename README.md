# Half-Life 2 Mod speedrun hub

## Table of contents
- [Overview](#Overview)
- [Technologies](#Technologies)
- [Team members](#Team&nbsp;members)
- [Requirements](#Requirements)
- [Installation](#Installation)
- [Demo](#Demo)

## Overview
The purpose of this project is to provide a home for listing useful resources for various Half-Life 2 modifications, primarily focusing on its speedrunning community. Half-Life 2 speedrunning community's resources has had a history of being scattered among multiple websites and spreadsheets, and the goal of this hub is to bring most of it to a single place for ease of access and make it less tedious to navigate through various resources.
Users of this site can view and create following content:
  - Dedicated pages for each mod
  - Resource links for every mod, such as download links and speedrun.com links
  - Tutorials and strategies to help new runners and preserve otherwise hard-to-find information
  - World record history for each speedrun category
  - User-specified ratings to evaluate the enjoyment and difficulty of each category, and to assess how optimized the current world record is

## Technologies
Backend: Node.js, Express.js

Frontend: Javascript, HTML, CSS

## Team&nbsp;Members
- [Anniina Leikas](https://github.com/Anniina-55)
- [Väinö Mäkinen](https://github.com/LyrenAlt)
- [Erik Markula](https://github.com/emarkula24)

## Requirements
  ```sh
  node.js v18 or later
  ```
## Install & Run
  1. Clone the repository
  2. Navigate to the server folder and install dependencies.
```
$ ~/server npm install
```
3. Set up the environment variables required for database configuration by copying `.env.example` to `.env` and setting the values.
4. Run the database container
```
$ ~/server docker-compose up -d
```
5. Run the backend server
```
$ ~/server npm run devStart
```

## Demo
https://hl2-mods-speedrun-hub.onrender.com/

The site opens on the main landing page. The part of the project that this GitHub repository is responsible of can be reached by clicking the "Half-Life 2 Mods Hub" link.
Because the demo is running on a free instance of Render, it takes time to start up if there has not been a request in 15 minutes. Wait patiently if no content loads.
