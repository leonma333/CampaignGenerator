# CampaignGenerator

[![CampaignGenerator Build Status](https://travis-ci.org/Liang-Hsuan/CampaignGenerator.svg?branch=master)](https://travis-ci.org/Liang-Hsuan/CampaignGenerator)
[![CampaignGenerator Codecov](https://codecov.io/gh/Liang-Hsuan/CampaignGenerator/branch/master/graph/badge.svg)](https://codecov.io/gh/Liang-Hsuan/CampaignGenerator)
[![CampaignGenerator Docker Pulls](https://img.shields.io/docker/pulls/leonma333/campaign-generator)](https://hub.docker.com/r/leonma333/campaign-generator)
[![CampaignGenerator made-with-angular](https://img.shields.io/badge/made%20with-angular-red)](https://angular.io/)

CampaignGenerator is an open-sourced web project that allows admin users to create marketing campaigns using WYSIWYG (What You See Is What You Get) editor. By using the rich text editor, admins can create nice-looking campaigns easily and quickly. Admins can also save the template and reuse it when creating a new campaign. For each campaign, the admin can apply the demographics that the campaign is targeting and the desired schedule to send. In the end, there is a list of campaigns and templates for marketing.

See [Wiki](https://github.com/Liang-Hsuan/CampaignGenerator/wiki) page for more details.

## Quick start

Running the project is very easy. There is a live demo, docker image, and you can of course clone it and run it yourself. The project is using Firebase as data storage, but you can fork this project as a boilerplate to talk to your own backend.

### Live demo

Go to https://campaign-generator-prod.web.app/

### Docker

[Docker Hub](https://hub.docker.com/repository/docker/leonma333/campaign-generator)

Go to your Firebase console and find the web config.

``` Bash
docker run \
-e FIREBASE_APIKEY=xxx \
-e FIREBASE_AUTHDOMAIN=xxx \
-e FIREBASE_DATABASE_URL=xxx \
-e FIREBASE_PROJECTID=xxx \
-e FIREBASE_STORAGE_BUCKET=xxx \
-e FIREBASE_MESSAGING_SENDERID=xxx \
-e FIREBASE_APPID=xxx \
-p 80:80 leonma333/campaign-generator
```

### Start your own

Clone the project git clone https://github.com/Liang-Hsuan/CampaignGenerator.git then `npm install` and finally `npm run start`.
