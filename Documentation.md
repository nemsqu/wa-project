# Documentation #

Introduction
=======
This application is a Code snippet application that is used to share, read and comment on small snippets.

Technology choices
=======
The application is built in two parts: the front-end is built using javascript and especially the React.js framework, the back-end is built on Node.js with the help of Express.js.
React was chosen for the fron-end because it allows creating a responsive user interface in the sense that components can easily be updated without reloading the whole page. This makes for a more pleasent user experience.
The packages that were used to help were the following: 
*Jwt-decode is used for authentication purposes. JWT was considered the best option for this application since it can easily be created and stored. After that cheking it is simple as well, especially with jwt-decode.
*React Router was used for routing purposes and handling the different URL addresses, in other words the different pages on the website. This was also an intuitive choice since it has been developed for React.
*For highlighting the code snippets Highlight.js was used. Highlight.js is compatible with any js framework (source: https://highlightjs.org/) and it works well with detecting multiple programming languages and, hence, it was deemed to be a good choice.
*For some of the user interface elements and in order to create a more responsive user interface, MUI was chosen. MUI is a React user interface framework but includes a lot of the same elements and properties as Materialize.css which is why it was a great option for helping with this application.

For the back-end Node.js and Express were used because they work well together and they provide many useful features. Building an API with these two is straight-forward. In addition to these two, the following packages and technologies were used:
*MongoDB and Mongoose for database usages. They are easy to use and provide great opportunities for creating different schemas for different use cases. Their variability as well as their easiness of use were the main reasons why this database set up was decided on.
*Passport.js is used for authentication together with JWT. JWT was used because of its compatibility with both the front and the back-end and Passport is a good, simple tool for checking the token when requests are made to the API.
*dotenv is used to create the secret needed for encoding the token. Again, the choice was mostly made based on compatibility and ease of use.
*cors is needed in order to have the client and the server running on different ports but still be able to communicate together. It was used for handling the API requests correctly.

Various properties of Express were used, including checking user input and escaping HTML code before the snippet posted by the user has been added to the database.

Installation guide
=======

1. Download the files
2. Unzip the files to a folder which location you are aware of
3. Open cmd
4. Go to the folder where you unzipped the files
5. Run "npm install"
6. Run "npm start"
7. Open your browser to http://localhost:1234
8. Enjoy. :)

User manual
=======
On the front page you can see the code snippets that have already been posted. In the upper right corner you have two buttons for the possibility to register or to login to the application. Once you have registered and logged in you can also post snippets to the application. Simply click on the "Add new snippet" button that appears on the top of the front page. Then add a title for your snippet and the code that will be saved on the application. After clicking the "Add" button you will find your snippet at the end of the list of snippets.

Registration
-----------
Every user needs to have a unique username.

Opening snippets and voting
-----------
By clicking on any of the snippets it will be opened on a new page, where you can see the title and the author of the snippet as well as the comments that have been added to it. Here you can also vote on the comments, up or down, based on what you think of them. Voting on the snippets themselves happens on the front page.

Editing posts
-----------
You can always edit snippets and comments you have posted. When you open one of your snippets an "edit" icon will appear below it. By clicking on it the snippet will be opened for you to edit. You can see a similar icon next to the comments you have posted.By clicking on it you can edit your comment. Once you edit your snippet or comment, an "Edited" timestamp will appear showing the day and time when it was last edited.

Filtering posts
-----------
You have the possibility to filter through the code snippets and the comments by writing the desired content into the search field. The search field for the snippets can be found from the front page, above the list of snippets, and the search field for comments from every code snippet's page above the list of comments.

User profiles
-----------
Everyone's user profile is public. When clicking on the username of the writer of a snippet or a comment, their profile will open. Only the user's email is not shown to others.

You have the possibility to add a bio and an avatar to your profile by clicking on the "Profile" button in the upper right corner after you have logged in. There you can also change your password.

Implemented features
=======

**Basic features:**
*Backend implemented with Node.js
*Utilization of database: MongoDB
*Authentication: users can register and login, JWT is used and only authenticated users can post, comment or vote.
*Features: authenticated users can post snippets and comment on existing snippets. Non-authenticated users can see posts, comments and votes. All the posts are on the front page and comments are shown when a post is opened.
*Responsive design: Can be used with a computer, tablet, phone and so on.
*Documentation.
Points: 25
*Users can edit their own comments/posts
Points: 4
*Utilization of a frontside framework, such as React, but you can also use Angular, Vue or some other
Points: 5
*Use some highlight library for the code snippets
Points: 2
*Use of a pager when there is more than 10 posts available
Points: 2
*Provide a search that can filter out only those messages that have the searched keyword
Points: 2
*Vote (up or down) posts and comments (only one vote per user)
Points: 3
*User profiles can have images which are show next to posts/comments
Points: 3
*User can click username and see user profile page where name, register date, user picture and user bio is listed
Points: 2
*Last edited timestamp is stored and shown with posts/comments
Points: 2

**Total points: 50**