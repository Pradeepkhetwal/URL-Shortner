//Here we will create our own server using nodejs so that we can serve the html and css file (frontend) of our application from that server only . we don't want to use the liveserver which is used to run the html files.

//this type of import are called named imports.Here we import a specific method from the module.Here the name of the function should be same  as that present in the module. So here we are directly importing the createServer method.
import { createServer } from 'http';
//here we are importing readfile method from fr/promises module. /promises module help us to manage the code by the use of promises and async and await.
import { readFile } from 'fs/promises';

//This is default import here we import the complete module.
import path from 'path'
import { writeFile } from 'fs/promises';
import crypto from "crypto"
import {json} from "stream/consumers"


const PORT = 2999;
//this is path to the file links.json present in data folder 
const DATA_FILE = path.join("data", "links.json");

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

//it will fetch all the json data that is present in the links.json file
const loadLinks = async () => {
  try {
    
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};
//will write the data in the links.json file whose path is stored in data_file .
const saveLinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links));
};

//we create server in nodejs using createServer method(inbuilt method in Nodejs in https module).
const server = createServer(async (req, res) => {
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

  if (req.method === 'POST' && req.url === "/shorten") {
    const links = await loadLinks();

    let body = "";
    
    // The req.on() method in Node.js is used to handle events on an incoming request object (represented by req) in a server. It is typically used to read data from the request.

    // In the context of HTTP requests, req.on() allows you to listen to specific events on the request stream, such as: data , end,error.

    // data: Fired when there is data coming in the request body (for example, when the client sends a POST request).
    // end: Fired when the request has been completely received and there is no more data to be read.
    //error:Fired when the req has some error.
    req.on("data", (chunk) => {
      body += chunk
    });

    req.on("end", async () => {
      console.log(body)
      //jo data response se aya hai usse js object mein convert karke destructure kar lo.
      const { url, shortcode } = JSON.parse(body)
      console.log("hello");
      console.log(url);
      
      //agar url nahi aya to error show karo.
      if (!url) {
        res.writeHead(400, { "Content-Type": "text/plain" })
        return res.end("URL is required");

      }

      //if shortcode is not present then generate random shortcode using crypto module.
      // The crypto.randomBytes(4).toString("hex") expression is part of the crypto module in Node.js, which is used for cryptographic operations, such as generating random data, hashing, encryption, etc.

      // The crypto.randomBytes(size) method generates a buffer containing size random bytes (where size is passed as an argument).
      // In this case, size is 4, so crypto.randomBytes(4) generates 4 random bytes.
      // .toString("hex"):
      // The .toString("hex") method is used to convert the binary data (random bytes) into a hexadecimal string.Hexadecimal is commonly used to represent binary data in a more human-readable format.
      const finalShortCode = shortcode ;

       //This links is the whole data of the json file present in the data folder in links.json file.
      // so by doing links[finalShortCode] we are accessing the value finalShortCode. so agar finalShortCode ki value already present in the links.json file this means we are trying to store a value that already exists in the file so it is a case of duplicasy so in that case user must enter another shortCode in the form.
      if (links[finalShortCode]) {
        res.writeHead(400,{"Content-Type":"text/plain"})
        return res.end("Short code already exists Please choose another")
      }
     
      //if shortcode does not already exists in the links.json file then assign the shortcode the url value and save them to links.json file by using savelinks function.
      links[finalShortCode] = url;
      await saveLinks(links);
      res.writeHead(200, { "Content-Type": "application/json" });
     
      res.end()

    })
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