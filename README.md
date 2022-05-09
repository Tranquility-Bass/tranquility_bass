# tranquility_bass

Welcome to Tranquility & Bass! Our music review and discussion based website allows users to express opinions on musical artists, albums, and songs. 

You can download our repo to your local file system. Our project uses the Node.js environment. Once downloaded, open a terminal and navigate to the folder that contains the repo. Use the following terminal commands to run the project:
   
   To install the necessary packages: npm install
   
   To populate the database: npm run seed
   
   To start the website: npm start
    
Once the website is up and running, you can go to http://localhost:3000 in your browser. You will be presented with our home page. From here, you can login or sign up for an account, view our about us page, search for an artist/song/album, view the top reviewed topics, or add a topic.

When you search for a topic, you will be presented with the results. You can click on the desired topic and view the discussions and reviews already posted about the topic. You could choose to view a specific discussion thread which will show the comments left on the post along with a button to allow you to leave a comment. You could also choose to view a specific review which will allow you to like or dislike the user's review on the topic. If a review recieves at least 5 more dislikes than likes, the review will be hidden from the results page. Each user is allowed to leave one review on a given topic. You could also choose to create a new discusion or review post on the topic. The user must be logged in to leave a comment, like or dislike a review, or create a discussion or review post.

From any page, you can view the top reviewed page by clicking the link at the top of the website. This page will present the top 3 artists, albums, and songs. This is calculated from the likes/dislikes of reviews on the specfic topic.

In addition, you can add a topic to the website so you can discuss and review it along with others. You must be logged in to add a topic. You can choose to add an artist or an album which will include adding all of the songs on the album.



See below for features you can test with the given seed file:
- Search term for artist "Big Time Rush" has one discussion and one review post about it. The discussion has 1 comment already in the system. The review has 2 likes and 1 dislike
- Search term for album "Elevate" has one discussion and one review post about it. The discussion has 1 comment already in the system. The review has 1 like.
- Search term for song "Love Me Love Me" has one discussion and one review post about it. The discussion has 1 comment already in the system. The review has 1 like.
- Search term for artist "Olivia Rodrigo" has one review post about it. The review has 3 likes.
- Search term for artist "Pitbull" has one review post about it. The review has 4 dislikes. If it is disliked one more time, it is hidden from the results page.
- The top reviewed page will consist of "Big Time Rush" and "Olivia Rodrigo" since both artists has positive likes/dislikes ratio. For albums, it will consist of "Elevate" since it is the only album with a review that has a like. For songs, it will consist of "Love Me Love Me" since it is the only song with a review that has been liked.
- You can login to an existing user with the username:user1 and the password:user1pass.

Enjoy the discussion!
