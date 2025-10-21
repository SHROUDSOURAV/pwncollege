
## Challenge Information

```
Obviously, as you're accessing this website in your web browser, this isn't your _first_ HTTP request. But it's your first HTTP request for a pwn.college challenge! Run `/challenge/server`, fire up Firefox in the dojo workspace (you'll need to use the [GUI Desktop](https://pwn.college/workspace/desktop) for this!), and visit the URL that it's listening on for the flag!
```


## 1. `Your First HTTP Request`

I executed the program which is located in `/challenge` directory. The filename is `server.` Upon running the script the URL will be revealed as shown below.
The script will only reveal the flag if the requests' User Agent is **Firefox**. So, I used `curl` to send the request.

![Your First HTTP Request](./Images/Img1.png)


## 2. `Reading Flask`

Analyzing the program and the URL `http://challenge.localhost:80` I understood that the endpoint for triggering the **def challenge()** function is `/pwn` and also the user-agent has to be **Firefox**. So, I used `curl` command to do the following.

![Reading Flask](./Images/Img2.png)


## 3. `Commented Data`

Well, this challenge is just the same as the last one except the flag will be hidden as **comment** in the HTML source code but lucky for us `curl` produces the HTML source code as response so we can just use the same previous technique to solve this challenge.

![Commented Data](./Images/Img3.png)


## 4. `HTTP Metadata`

We will use `curl` command along with the `-v` option to check the request and response. The `-v` is for verbosity.

![HTTP Metadata](./Images/Img4.png)


## 5. `HTTP (netcat)`

In this challenge, we need to send **HTTP GET request** to the URL `http://challenge.localhost:80` at endpoint **/** to get the flag. We have to use `netcat` to connect to the target web server and send our request.

![HTTP (netcat)](./Images/Img5.png)

`echo` command is used to send the **HTTP GET request** to the **/** endpoint. `\r\n\r\n` are indicators for the end of the HTTP headers and to make sure they are correctly interpreted as intended I have used the `-e` switch and `-n` to prevent addition of newlines.


## 6. `HTTP Paths(netcat)`

This challenge is just like the previous one with just a different endpoint. The endpoint is **/hack** this time.

![HTTP Paths(netcat)](./Images/Img6.png)


## 7. `HTTP(curl)`

Using `curl` to make HTTP requests to the endpoint **/trial** in the URL `http://challenge.localhost:80`.

![HTTP(curl)](./Images/Img7.png)


## 8. `HTTP(python)`

We need to send HTTP GET request to the target URL using Python's requests library.

![HTTP(python)](./Images/Img8.png)


## 9. `HTTP Host Header(python)`

We need to send HTTP get request to the target URL by making changing the host header using python requests library. The host header name will be provided inside the **server** script.

![HTTP Host Header(python)](./Images/Img9.png)


## 10. `HTTP Host Header(curl)`

Same as the previous challenge except we need to use `curl` this time.

![HTTP Host Header(curl)](./Images/Img10.png)


## 11. `HTTP Host Header(netcat)`

Same as the previous challenge except we need to use `netcat` this time. Remember that `netcat` alone will not be sufficient to solve this challenge so you can use `echo` command along with it as well, like I have shown below in the image.

![HTTP Host Header(netcat)](./Images/Img11.png)


## 12. `URL Encoding(netcat)`

We need to use `netcat` to send HTTP GET request to a URL with the mentioned Host header and also the endpoint for the URL has spaces so we need to provided the correct encoded value of spaces as well.

![URL Encoding(netcat)](./Images/Img11.png)


## 13. `HTTP GET Parameters`

We need to pass a **Query String** in our HTTP GET request to get the challenge flag.

![HTTP GET Parameters](./Images/Img13.png)


## 14. `Multiple HTTP Parameters(netcat)`

We need to again pass **Query String** in our HTTP GET request but this time there will be multiple query strings so we can append them using **&** symbol. We will use `netcat` for this challenge.

![Multiple HTTP Parameters(netcat)](./Images/Img14.png)

