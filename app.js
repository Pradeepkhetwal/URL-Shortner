//Here we will create our own server using nodejs so that we can serve the html and css file (frontend) of our application from that server only . we don't want to use the liveserver which is used to run the html files.

//this type of import are called named imports.Here we import a specific method from the module.Here the name of the function should be same  as that present in the module. So here we are directly importing the createServer method.
import { createServer } from 'http';
//here we are importing readfile method from fr/promises module. /promises module help us to manage the code by the use of promises and async and await.
import { readFile } from 'fs/promises';

//This is default import here we import the complete module.
import path from 'path'


const PORT = 2999;

//This function is used to serve the html and css file in this link(by default jaha par server response bhejta hai ye wo address hi hai bhai node app.js karke dekh lena terminal mein) http://localhost:2999 when we run our server.

const serveFile = async (res, filePath, contentType) => {
  try {
    //readFile is a method provided by the fs (filesystem) module in Node.js. This method is used to read the contents of a file.
    // In the case of fs/promises, it returns a Promise, which makes it compatible with async/await, allowing you to handle file reading asynchronously in a more readable way.

    // Now in general this readFile method can be used in 2 ways one with callback function and one with async and await so here we are using async await wala tarika.
    // so here this readFile returns a promise.
    //now this readFile generally takes 2 argument one is filepath and other is encoding.
    //if we don't pass encoding this function returns buffer.
    //buffer usually contains the data in the raw form . Suppose we are reading a text file so text written inside it will be converted to binary data and will be stored in data structure called as buffer and then this buffer will be returned.

    //we use encoding like utf-8 which help to convert this buffer data into actual readable data.
    // in case when we don't pass type of encoding  in the 2nd argument the nodejs by default returns the buffer.
    //in our case we are dealing with html and css file so browser can easily render html , css file buffer so no need to pass encoding , aur agar utf-8 pass kar bhi diya to no problem.

    const data = await readFile(filePath);
    // res.writeHead() method is used to set the HTTP response status code and response headers before sending the response body.
    // The first argument in this method is the status code and the second argument is the headers.
    // headers:The second argument is an object where you can define HTTP headers that should be included in the response. Headers provide additional information about the response, such as the type of content being returned or how long the content can be cached.
    res.writeHead(200, { "Content-Type": contentType });

    // 2. res.end(data)
    // Purpose:
    // res.end() is used to send the response to the client and signal that the response is complete. It is the last step in the process of sending an HTTP response.

    // Parameters:
    // data (optional): You can pass some data to res.end() if you want to send a body with the response. This could be HTML, JSON, text, or any other data you want to send back to the client. If no data is passed, it simply ends the response.You can send data like res.end("<h1>Welcome to the homepage!</h1>");In this case, the string "<h1>Welcome to the homepage!</h1>" will be sent as the body of the response. The server has already sent the headers (like content type) with res.writeHead(), and now res.end() is sending the actual content back to the client.
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "content/plain" });
    res.end("404 page not found")
  }
};

//we create server in nodejs using createServer method(inbuilt method in Nodejs in https module).
const server = createServer((req, res) => {
  console.log(req.url);
  //if we have a get request.
  if (req.method === "GET") {
    // if in the get request we are requesting for home page then run the function serveFile it will serve(run) the html and css file present in the public folder.
    if (req.url === "/") {
      //here this path.join("public",index.html) means we are providing the path of index.html which is present in the public folder so that it can be served.
      return serveFile(res, path.join("public", "index.html"), "text/html");
    }
    //if we are requesting get request.
    else if (req.method === 'GET') {
      //if we are requesting this route then serve the style.css file.
      if (req.url === "/style.css") {
        return serveFile(res, path.join("public", "style.css"), "text/css");
      }
    }
  }
});

//listening at the port is necessary while creating a server.
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})

//note.

/* Example of the Full Process:
Step 1: The browser makes an HTTP request for http://localhost:2999/ (root URL).

The server responds with the index.html file and a Content-Type: text/html header.

The browser interprets the file as HTML and begins rendering it.

Step 2: The browser sees the <link rel="stylesheet" href="/style.css"> tag in the HTML, so it makes another HTTP request to fetch http://localhost:2999/style.css. so here again serveFile method will be called again for the css file. so it is being called 2 times one for index.html and one for style.css

Step 3: The server responds with the style.css file and a Content-Type: text/css header.

 */