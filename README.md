
<div align="center">
    <img src="https://news.librarypure.com/images/read-news.png"/>
</div>
<h1 align="center">
    The News Board
</h1>

The are **2 projects** incorporated in this repository.
The **backend** (Laravel) and the frontend, in react... titled **frontend**

1. **The Backend** (Laravel)
   
   This is laravel project, which is the main API, handling authenticated and API calls from news apis.
   To run it, follow steps below:

   1. clone this project to the local, make sure you have a PHP running server, like XAMP/WAMP etc.
   2. Navigate to the cloned extracted folder, and edit **.env** file, expecially the database and the API section.
      Add your database and API parameters
   4. Go to the terminal (bash) and run the following commands

      ```cmd
      C:\Users\Example> cd path/to/clone
      ```
      
   5. Then in this project, execute the artisan command below to migrate the database

      ```cmd
      C:\Users\Example> php artisan migrate
      ```

   6. If your migrations successful, you can then proceed to serve the project as

      ```cmd
      C:\Users\Example> php artisan serve
      ```

   7. You may now open the  app in browser on the link shown... for example

      ```cmd
      http://localhost:8000
      ```

2. **Frontend** (React)

   Now this is react project, which faces the user.
   To run it, make sure you have node/react setup on your machine and then follow instructions below

   1. Go to the extracted folder, and find a folder called **frontend**
   2. Edit the .env if necessary, for VITE api base to point where the backend (in this case laravel app) is running.
   3. In the bash (terminal), run below commands
  
       ```cmd
      C:\Users\Example> cd path/to/clone/frontend
      ```
  
       And once you are in the project, run
  
      ```cmd
      C:\Users\Example> npm install
      ```
  
      To install the dependencies listed in package.json... and finally run
      
       ```cmd
      C:\Users\Example> npm run dev
      ```
       
   5. After this, you should be able to see the url for the project
      i.e

      ```cmd
      http://localhost:3000
      ```

   And now you can start viewing the news
   


