# Notes
*Please do not supply your name or email address in this document. We're doing our best to remain
unbiased.*

## Date
June / 7th / 2021

## Location of deployed application
https://thinkific-assignment.herokuapp.com/

## Time spent
Around 8 hours (I tried and implemented all the Stretch Goals which took the most of the time)

## Assumptions made
Use this section to tell us about any assumptions that you made when creating your solution.
- There is only one counter for all the people who sign in to the application
- If one resets the timer to some number, basically it will be reset for everyone
- On the frontend, clicking on each button (Get current, Get next, Update the counter) will send an axios request to the backend. So, 2 requests cant happen in the same time
- The only validation for password is that, it can not be empty
- The only validation for email is that:
    - It can not be left empty
    - There should be an '@' in the string and there should be a '.' after '@'

## Shortcuts/Compromises made
If applicable. Did you do something that you feel could have been done better in a real-world
application? Please let us know.
 - I wanted to implement using redux and Material-ui but i tried to be fast since i wanted to try all the stretch goals

## Stretch goals attempted
I Implemented all the stretched goals:
- Build a UI for the service, especially the account creation functionality.
- Take it a step further and build the UI as a single page app that consumes your API.
    - SPA using React
- Allow sign up using OAuth 
    - (Facebook and Google)
- Deploy your API and include the link in your README so we can try it out without having to run it.
    - Deployed it to Heroku (https://thinkific-assignment.herokuapp.com/)

## Instructions to run assignment locally
- Cloning the project
```
git clone https://github.com/HamidHeyde/Thinkific 
cd Thinkific
```
- Node Server (localhost:5500)
```
npm install
npm run startBackendDev
```
- React Front-end (localhost:3000)
```
cd app
npm install
npm run start
```

## What did you not include in your solution that you want us to know about?
Were you short on time and not able to include something that you want us to know about? Please list
it here so that we know that you considered it.

## Other information about your submission that you feel it's important that we know if
applicable.

## Your feedback on this technical challenge
Have feedback for how we could make this assignment better? Please let us know.
- The front-end can be done in so many different ways. Giving more clear info on up to what extent you expect a programmer go can save a lot of time. Considering the fact that someone like me always want to impress, lots of time goes into thinking about what to include in the application and how ;)