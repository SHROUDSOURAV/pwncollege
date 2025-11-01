
## 1. `cat`

```bash
hacker@program-misuse~cat:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 12 Nov  1 10:21 cat -> /usr/bin/cat
hacker@program-misuse~cat:/challenge$ ls -l /usr/bin/cat
-rwsr-xr-x 1 root root 43416 Sep  5  2019 /usr/bin/cat
hacker@program-misuse~cat:/challenge$ cat ../flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```

Reading the file permissions for `/usr/bin/cat` I found out it has **SETUID** setup for this binary at the root level so I used it to read the contents of the flag. The `->` sign means `cat` is a symbolic link and `/usr/bin/cat` is the actual path of the `cat` command.


## 2. `more`

```bash
hacker@program-misuse~more:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 13 Nov  1 12:21 more -> /usr/bin/more
hacker@program-misuse~more:/challenge$ ls -l /usr/bin/more
-rwsr-xr-x 1 root root 43160 Apr  9  2024 /usr/bin/more
hacker@program-misuse~more:/challenge$ more ../flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 3. `less`

```bash
hacker@program-misuse~less:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 13 Nov  1 12:26 less -> /usr/bin/less
hacker@program-misuse~less:/challenge$ ls -l /usr/bin/less
-rwsr-xr-x 1 root root 180064 Apr 28  2024 /usr/bin/less
hacker@program-misuse~less:/challenge$ less ../flag
```

The `less` command is a file pager that allows viewing the content of files one screenful at a time, providing interactive navigation.


## 4. `tail`

```bash
hacker@program-misuse~tail:~$ cd /challenge
hacker@program-misuse~tail:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 13 Nov  1 12:36 tail -> /usr/bin/tail
hacker@program-misuse~tail:/challenge$ ls -l /usr/bin/tail
-rwsr-xr-x 1 root root 72088 Sep  5  2019 /usr/bin/tail
hacker@program-misuse~tail:/challenge$ tail ../flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 5. `head`

```bash
hacker@program-misuse~head:~$ cd /challenge
hacker@program-misuse~head:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 13 Nov  1 12:38 head -> /usr/bin/head
hacker@program-misuse~head:/challenge$ ls -l /usr/bin/head
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/head
hacker@program-misuse~head:/challenge$ head ../flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 6. `sort`

```bash
hacker@program-misuse~sort:~$ cd /challenge
hacker@program-misuse~sort:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 13 Nov  1 12:40 sort -> /usr/bin/sort
hacker@program-misuse~sort:/challenge$ ls -l /usr/bin/sort
-rwsr-xr-x 1 root root 117376 Sep  5  2019 /usr/bin/sort
hacker@program-misuse~sort:/challenge$ sort ../flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 7. `vim`

```bash
hacker@program-misuse~vim:~$ cd /challenge
hacker@program-misuse~vim:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 12 Nov  1 12:46 vim -> /usr/bin/vim
hacker@program-misuse~vim:/challenge$ ls -l /usr/bin/vim
lrwxrwxrwx 1 root root 21 May  1  2025 /usr/bin/vim -> /etc/alternatives/vim
hacker@program-misuse~vim:/challenge$ vim ../flag
```

`vim` is an editor so when the command gets executed a window opens up and you can get your flag from there.


## 8. `emacs`

`emacs` is a GUI text editor. To bypass the GTK we need to use the `-nw` switch. A window will open up showing the contents of the flag file.

```bash
emacs -nw ../flag
```


## 9. `nano`

`nano` is another text editor. Again a new window will open will displaying the flag contents.

```bash
hacker@program-misuse~nano:/challenge$ ls -l nano 
lrwxrwxrwx 1 root root 13 Nov  1 13:58 nano -> /usr/bin/nano
hacker@program-misuse~nano:/challenge$ ls -l /usr/bin/nano
-rwsr-xr-x 1 root root 320136 Oct  9  2024 /usr/bin/nano
hacker@program-misuse~nano:/challenge$ nano ../flag
```


## 10. `rev`

`rev` command is used to reverse the order of the characters present in the file.

```bash
hacker@program-misuse~rev:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 12 Nov  1 15:54 rev -> /usr/bin/rev
hacker@program-misuse~rev:/challenge$ rev ../flag
}WzU5OTczLDE1Ml0.-A46lL90ghJW0u-EQ2g6RUNlDKo{egelloc.nwp
hacker@program-misuse~rev:/challenge$ echo '}WzU5OTczLDE1Ml0.-A46lL90ghJW0u-EQ2g6RUNlDKo{egelloc.nwp' | rev
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 11. `od`

`od` command displays data in octal format (0-7). Used the `tr -d [:space:]` part to delete horizontal, vertical, newline spaces. 

```bash
hacker@program-misuse~od:/challenge$ ls -l od
lrwxrwxrwx 1 root root 11 Nov  1 16:02 od -> /usr/bin/od
hacker@program-misuse~od:/challenge$ od ../flag
0000000 073560 027156 067543 066154 063545 075545 054470 057561
0000020 071516 034163 053464 034516 034163 044121 063521 063121
0000040 050110 063505 071144 027147 030460 030515 042105 075114
0000060 052143 032517 075125 076527 000012
0000071
hacker@program-misuse~od:/challenge$ od -c ../flag
0000000   p   w   n   .   c   o   l   l   e   g   e   {   8   Y   q   _
0000020   N   s   s   8   4   W   N   9   s   8   Q   H   Q   g   Q   f
0000040   H   P   E   g   d   r   g   .   0   1   M   1   E   D   L   z
0000060   c   T   O   5   U   z   W   }  \n
0000071
hacker@program-misuse~od:/challenge$ od -c ../flag | tr -d '[:space:]'
0000000pwn.college{xxxxxxxxFLAGxxxxxxxx}\n0000071
```


