

- A scheme to convert binary data to text or string or in a sequence of printable characters
- `Base64` converts the binary data and represents in ASCII string format.
- `Base64` is limited to a set of 64 characters.
- These **64 characters** must be common so they were chosen.
- The binary data is split into **6 bits chunk**.


**NOTE: some characters like newline or something else .... basically some characters even after conversion are not printable.**



### base64 example


![Example Image](./Images/i1.png)


- The binary data is split into 6 bit chunks from the left to right.
- 64 characters are there so the encoding is done as per the base64 mapping
- The **last chunk** doesn't have 6 bit. So to signify this the last bit will produce the `==` sign. Each `=` sign for each missing bit. Since there were **2 bits** missing for the last chunk out of 6 bit so filled with double `==` sign.


