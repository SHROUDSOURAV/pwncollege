
## Challenge Information

```
Obviously, as you're accessing this website in your web browser, this isn't your _first_ HTTP request. But it's your first HTTP request for a pwn.college challenge! Run `/challenge/server`, fire up Firefox in the dojo workspace (you'll need to use the [GUI Desktop](https://pwn.college/workspace/desktop) for this!), and visit the URL that it's listening on for the flag!
```


## `Your First HTTP Request`

I executed the program which is located in `/challenge` directory. The filename is `server.` Upon running the script the URL will be revealed as shown below.
The script will only reveal the flag if the requests' User Agent is **Firefox**. So, I used `curl` to send the request.

![Your First HTTP Request](./Images/Img1.png)


## `Reading Flask`

Analyzing the program and the URL `http://challenge.localhost:80` I understood that the endpoint for triggering the **def challenge()** function is `/pwn` and also the user-agent has to be **Firefox**. So, I used `curl` command to do the following.

![Reading Flask](./Images/Img2.png)


## `Commented Data`

Well, this challenge is just the same as the last one except the flag will be hidden as **comment** in the HTML source code but lucky for us `curl` produces the HTML source code as response so we can just use the same previous technique to solve this challenge.

![Commented Data](./Images/Img3.png)

