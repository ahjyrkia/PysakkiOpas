<<<<<<< Updated upstream
# simple angular bootstrap [![Build Status](https://travis-ci.org/TeemuKoivisto/simple-angular-bootstrap.svg?branch=master)](https://travis-ci.org/TeemuKoivisto/simple-angular-bootstrap) [![Coverage Status](https://coveralls.io/repos/github/TeemuKoivisto/simple-angular-bootstrap/badge.svg?branch=master)](https://coveralls.io/github/TeemuKoivisto/simple-angular-bootstrap?branch=master)
Simple Angular 1.5 bootstrap with Gulp and Bootstrap.

# General
This app is ultra small scaffold that I myself use as a base when starting out angular projects. It consists of basic gulp scripts for minifying the code and generic libraries that are useful for getting things done quick and easy.

# How to install
1. Install Node.js and nvm if you don't have them by now. Newest versions suit very well. 4.-something if you want the production-stable version. Basically it should work if you write ```curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash``` to your terminal. Then ```nvm install 6.3.1``` and maybe ```nvm use 6.3.1```.
2. Clone this repository and go to the root and enter ```npm i``` or ```npm install```.
3. After downloading dependencies install gulp and bower globally ```npm i -g gulp bower```.
4. It's recommended to use Livereload plugin, [here's one for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).
5. This app uses dotenv for storing environment variables, rename the ```.dev-env``` file in the root of this folder to ```.env``` and anytime you want to use Travis or Heroku remember to add your variables to their config. Or for your own server create your own production ```.env```.
6. Now you're all set, enter ```gulp start``` to run the development server.
7. Go to localhost:3333 and hit the Livereload button in the upper corner of your browser. Now anytime you make changes to the code Livereload automatically refreshes the page (so you don't have to spam F5).

# App's structure summed up:

The source files are written into ```src```-folder. From that folder your gulp scripts move the files and process them into ```dist```-folder. Your ```index.html``` then gathers those files from that folder with link and script tags and vóila you got your Single-Page-Application. Frontend dependencies are installed with Bower using ```bower i <library> --save``` and if you need backend dependencies depending do you need them in production or not install them ```npm i <library> --save``` if you need them in production e.g. Express or ```npm i <library> --save-dev``` if not e.g. Karma.

Create controllers to handle the stuff between view(html) and logic(services/factories). Do all your logic in services/factories e.g. calling the API or holding app-wide information. I myself prefer services over factories but in short: you can have only one service which is a single instance of itself but with factories you can create multiple instances of the same factory. Add routes and new Angular libraries to ```app.routes.js```. 

Here's a list of important commands to remember:

1. ```npm i <library> --save``` or ```npm i <library> --save-dev```
2. ```bower i <library> --save```
3. ```gulp start```
4. ```npm run lint``` or ```npm run lint:fix```
5. ```npm test```

# Detailed version

## public  
Static files such as images and etc. The best practise of course is to use dedicated file-hosting server but that would be a bit overkill in this case.

## gulp  
Where the gulp scripts are stored. The ```gulpfile.js``` at the root of this project automatically requires every file from this folder so that you don't have to (copied from yeoman's gulp-angular-bootstrap). There are as of writing this readme 3 files for keeping the app's development process manageable, The ```build-app.js``` file for gathering js and css source files and combining them into minified ones. Also in the end of tasks are pipings for livereload which leads us to ```nodemon.js``` file. This file is responsible for restarting the server after each build-script run and also refreshing the page at localhost:3333. Makes the development process so much more pleasant without having to hit F5 button constantly. ```watch.js``` file has currently only one script that's only purpose is to watch the source files inside ```src``` -folder and each time change is made run build scripts, notify livereload and after build script is ran nodemon script takes care of restarting the server to update all the changes. NOTE: Even better would be to use hot-reloading but I find myself too often having to refresh the page manually as a fallback when the changes don't actually update :/.

## test
Unit test files made with Karma, Jasmine, Chai and Sinon. Incase your app starts to grow they are there for you to fiddle. It's always a huge pain in the ass with frontend frameworks to get a working testing environment and configuring it with your build (like Travis). Rendering virtual DOM often proves to be quite difficult in practise (tutorials always promise something else) but with Angular 1 I suppose the use of Angular-based injectables instead of 'real' globals such as $window or $document makes stubbing of them reasonable. Also both Jasmine and Sinon offer stubbing of injectables.

## e2e
End to end test files aka. behavior-tests. While unit tests test invidual files or functions these test the app's functioning in practise which means they start the app and render it into browser screen and click buttons and fill input fields and see if things go to shit or not. Haven't yet made any :DDD. Will update this soon. TODO

## individual files
There is a lot of odd stuff in any project which programmer might not never understand what they are for. With any Node.js project there is certain amount of files you'll get used to quickly and know what they do like ```package.json```. Some just stay in your near consciousness and you only become aware of them when things stop working. So remeding that issue in advance here's every file from the root of this folder with a small description what they are for:

### package.json
The one file to rule them all. This is the pom.xml of any Node.js project. Or Gemfile. Or.. well you get the idea. It has all the basic information how your app works and which libraries it uses. Also a vital thing it handles are the scripts run by ```npm```-command at the root of this folder. That often includes the famous ```npm start``` which is the main script for starting a Node.js application (in our case we use Gulp for starting the development version of our app with ```gulp start```, ```npm start``` is only used in production where gulp isn't needed.) And ```npm test``` is de facto command for running tests. But often you want to create your own custom scripts with npm so you include those scripts in the ```package.json``` and they are runnable with ```npm run <script>``` -command. We have here various custom scripts that for example run the style check with Eslint ```npm run lint``` or run tests and keep watching the source files for changes ```npm run test:watch```. You could if you wanted run your gulp script from npm but that kinda beats the purpose of having a separate task-runner library.

Also important part to know is the difference of ```"dependencies"``` and ```"devDependencies"```. Simply put dependencies are the libraries your app *must* have in order to run it. DevDependencies are those libraries that are only needed when you're developing it thus when you have environment variable NODE_ENV set to production ```npm install``` automatically downloads only ```"dependencies"```.

### index.js
The "main" of this app. Creates an instance of server with ```const app = express();```, sets public folder to be statically hosted, sets every get-request to be handled with the same response: send the ```index.html```-file. Then it starts up the server to the assigned port and prints an informative message to the console. And that's basically it. Without going too deep into this topic this file is the minimal setup for running single-page-application Node.js server. It can be found in probably every Node.js project and has various other names such as ```app.js```or ```server.js```. Perhaps ```app.js```could be more appropiate since this file only spins up a single server. Often the server cluster is started with ```index.js``` file but meh. If you´ve read this far you can refactor it to to app.js if you feel seriously committed into learning Node.js :D.

### gulpfile.js
This is kind of the ```package.json``` for Gulp which means whenever you type ```gulp <script>``` it always goes through here. So to separate the scripts there is a small script that runs through the ```gulp``` folder and requires each and everyone of the ```.js````-files. Particularly bad practise would be to have all your gulp scripts inside this file since it makes managing of them quite hard after you've gathered up a few.

### bower.json
The ```package.json``` for Bower which I think of like a frontend version of npm the difference being that Bower does mostly dependency management. Now I do know that some people think having two package management libraries is stupid and redundant but I have to disagree in this particular case. The reason is the absence of any module bundler such as Browserify or Webpack. Because those things make requiring of files easy and there is no hassle with having your server libraries such as express and your frontend libraries like angular mixed inside the same folder. But because using module bundler with Angular 1 has so much overhead to the whole development process I've decided against using it. Which makes Bower much smarter solution when you have much more control over how you insert those ```<script>```-tags to your ```index.html``` instead of one huge bundle. And the gulp library ```main-bower-files``` finds handily all the frontend libraries and you can put them inside your build-folder (in our case ```dist```). Just trust me on this one, this is the convenient way. On other hand with React (and I guess Angular 2.0) you don't need Bower unless you really want to.

### .bowerrc
Since by default dependencies marked by ```bower.json``` or ```package.json``` for that case are installed into the same folder as the configuration file ```.bowerrc``` defines a custom path for bower libraries to be installed at. In our case we want them inside ```src``` folder although as this app's build has developed I don't know if this is necessary anymore.

### .eslintrc
The configuration file for Eslint which is a JavaScript style checker library. Here are the common rules I use for stylings such as double-quotes (") and 2 space indentation. The reason for double-quotes over single-quotes (') is that if I ever need to write english inside a string say: "Here's a message!" I'd have to escape the '-character if I were using single quotes. Yeah sometimes you write quotes inside quotes but that happens more rarely than escaping single quotes. And if for some god knows what reason you have to escape a long string, with lots of quotes, yeah that would be a nightmare. And as a solution you might switch to double quotes if you otherwise use single quotes but then you have a problem with style check and consistency so I'd rather use double quotes all the time than wait for those rare but very tiresome exceptions to happen. Also airbnb/base is the style quide from the Airbnb company. Supposedly it's pretty good.

### .gitignore
This is a rather generic file found in almost every git repository. It just tells git what folders and files are to be excluded from being committed to the repo. In Node.js projects ```.gitignore``` is particularly important since we do not want to ever commit node_modules to git. Because that's the reason you have ```npm``` in first place, to do the package management and installing them from their own separate repositories.

### .nvmrc
This is a rather unsignificant file that only tells Travis and Heroku which Node.js version this project uses without having to write it down in .yml files. But the real reason why it's needed is because everytime you run script like ```npm run lint``` and it fails it creates a file called ```npm-debug.log```. For reasons unknown that file could appear anywhere inside this project but having ```.nvmrc``` will always default it to the root folder.

### .travis.yml
Travis configuration file. Just tells Travis how to build this project and what scripts to run. Only thing worth nothing here is the sending of coverage report to Coveralls with ```- cat ./coverage/lcov.info | coveralls```. It's regular bash command because Travis containers are Linux-distros so you could write your own bash scripts to do stuff when you build your projects.

### karma.conf.js
Configuration file for Karma, your test-runner.

# App structure
Angular is based on MV** architechture which means Model-View-whatever. That gives a quite lot of freedom how to devise your app but the little scaffold I've made is just basic MVC where services and factories are the Model, HTML-templates the view and controllers are the Controllers. Down below are some details how Angular app actually works.

## app.min.js
Is the minified version of the whole app. Worth noting is that it has sourcemaps so you can see the actual lines in the separate files before they were bundled together. Also keep in mind if you ever wish to change its location that the paths to HTML-files stay correct which now reference to the ```dist/templates```-folder.

## app.routes.js
The "main" of this Angular project. Here I name my app and set it to a variable so that connecting components to it is bit quicker (no need for ```angular.module("MyApp")``` in every file). Also I'm naming the Angular dependencies I use. In this case it's only ```"ui.router"```. Well the actual initilization of the app could be in a separate file but I think having a file with only one line in it is a bit silly. 

But after the initilization comes the real purpose of this file (and why it's named). Here I declare all the routes and which controllers are connected to which view. Ui-router makes handling of nested controllers much easier than the regular ng-route so it's the preferable version of the two. Currently it's not much to look at but once you start building your app this becomes a lot more contrived. If you ever want to load some asynchronous data before rendering a view this is the place to do it via resolve-method (look it up if you're interested).

## components
This is the folder for the different parts of your application. I'm using component structure instead of type-based structure where all controllers are inside controllers folder etc. The reason is that when app grows large it becomes hard to see what parts are connected to what and what components are related to what. This is just better for scaling up, trust me. And every component can be a page or a directive or multiple directives that are connected or whatever. You decide how'll make your app.

## stylesheets
I used to put my stylesheets inside components folder with the html-files that they were styling. That proved to be too tedious and it created a lot of small files with little bits of code so in this case the type-based structure works much better IMO. Now I can see all the styles from one glance without having to go through all the folders in search of that one style that I stored somewhere. And I'm not using any CSS-processor like Stylus or SASS because I'm not a designer (>_<) so I'll try to use default Bootstrap or Semantic UI styles as much as possible. My own styles I'll keep at minimun and mostly it's just small adjustments to fix certain things.

## controllers
Are the sometimes shunned middle-man between view and the data. Often you want to only write simple methods here that just manipulate what views are shown and call services whenever some button is pressed. You'll get it, I promise. Sometimes you see something like this in the first lines of a controller ```var vm = this;```. It's a way of isolating the controller's scope to the ```vm``` variable and not messing with the global ```$scope```. Yeah it might be the better way but for the sake of simplicity I'm doing it the old way.

## services
Are the bread and butter of any Angular app's logic and asynchronous stuff. With repeating too much what I've said they cannot access ```$scope``` leaving it "unharmed". That means that all of the methods are binded to it's local ```this``` which keeps them relatively safe although remember when doing promises that the ```this``` stops referencing the service's scope as soon as the code is executed inside the promise. So to call service's other methdos inside promise you must store the ```this``` inside a variable like so: ```var self=this;```. Then you can call a method like this: ```self.someMethod();```. Well it might sound confusing but that's more advanced stuff that you might not have to worry about too soon at least.

## directives
Aret the Angular version of Web components. If that doesn't say anything think about HTML-elements. You have stuff like ```<div>```, ```<button>``` and ```<input>``` etc. What if you wanted to create your own custom HTML-element? Like for example ```<my-directive>```. And that component has its own separate logic describing how it works and how it looks and you can use it anywhere inside your HTML like a regular element. That's basically what directives are, custom HTML-elements. They might look a bit confusing but they work very well. You can inject your services to its scope or maybe create a nested directive with other directive inside it. It's cool and if you ever switch up to React and Angular 2.0 you'll find them there too, in a different way maybe, but they'll be there.

## factories
Eh not really too excited about these. If you want to use classes inside your app for some reason you should try using these. Other than that, I'd stay away from them.

=======
>>>>>>> Stashed changes
