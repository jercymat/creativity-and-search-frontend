# Creativity and Search Project - Frontend

This project served as the Frontend web application of Creativity and Search Project hosted by Prof. Soo Young Rieh, School of Information, The University of Texas at Austin. The application is bootstrapped with Create React App and developed with React, with various state management libraries like Redux and Redux-saga to build a scalable and robust web application.

The result of this project has been published at [ACM SIGIR Conference on Human Information Interaction and Retrieval (CHIIR) 2023](https://dl.acm.org/doi/10.1145/3576840.3578294).

## Get Started

### Prerequisites

- Node.js
- NPM
- React
- SASS
- React-router-dom
- Redux, React-redux, Redux-Saga
- Axios

### Running the Service

To start the service locally:

```
npm install
npm start
```

It will run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Documentation

- Explore more information in [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
- To learn React, check out the [React documentation](https://reactjs.org/).
- Further documentation is available here.

## Build

Run the following code:

```
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
After the build, the app is ready to be deployed.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

After the build, pack the `/build` folder and serve `index.html` with website hosting software like Nginx or Apache HTTP Server

### Static Server

For quick deployment, the easiest way to handle this would be to install [serve](https://github.com/vercel/serve) and let it handle the rest:

```
npm install -g serve
serve -s build
```

The last command shown above will serve your static site on the port **3000**.

### Other Solutions

For other deployment solutions, check [here](https://create-react-app.dev/docs/deployment/) for mre detail.
