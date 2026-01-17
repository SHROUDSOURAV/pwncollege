
## Forming Executable and Running Challenge File

After you form your assembly code use the below commands to create binary file or executable of the assembly code. Your assembly code file name might be different so change the name. After forming the executable we need to use the executable as command line argument for the `/challenge/run` file. This will give us our `pwn.college{FLAG}` if our assembly code is correct. Its better you create a `.sh` or shell script and run it after finishing your code instead of manually typing it every time.

### Automation Script

The below script is for removing the headache of assembling the assembly code and then forming the executable file and running it again and again with the `/challenge/run` file. Make sure to add executable permissions to it using `chmod +x <script_name.sh>` command.

```bash
#!/bin/bash
nasm -f elf64 assembly.s -o assembly.o # forming object code file using nasm
ld -f assembly.o -o assembly # creating executable using linker
/challenge/run assembly # run the challenge file
```

## Exit

In this challenge we need to create the `exit` syscall. This syscall is used to exit a program and returns a status code which is usually `0`.

```nasm
global _start

section .text

_start:
    mov rax, 0x3c   ; exit syscall
    mov rdi, 0  ; status code
    syscall
```

## Socket

In this challenge we will create a `socket` syscall. A `socket` is basically the building block of network communication. A `socket` typically requires the following 3 arguments. They are :-

- `AF_INET` for IPV4 for example
- `SOCK_STREAM` for TCP
- protocol (usually set to `0`) by default

We need to find the integer which corresponds to `AF_INET`. These numbers are not even found in the man pages, but these numbers do exist on our machine. Check out the `/usr/include` directory. All the system's general-use include files for C programming are placed here.

Read the below header files to get the numbers required to make the arguments necessary for `socket` syscall :-
- `/usr/include/x86_64-linux-gnu/bits/socket.h`
	- `AF_INET -> 2 `
- `/usr/include/x86_64-linux-gnu/bits/socket_type.h`
	- `SOCK_STREAM -> 1`
- `/usr/include/netinet/in.h`
	- `IPPROTO_TCP = 6`

So the above header files gave us our 3 necessary values for the 3 arguments required to make the `socket` syscall. Below is the assembly code required to get the flag. According to the Linux Syscall Table `socket` syscall number is `0x29` or `41`.

```nasm
global _start

section .text

_start:
    mov rax, 0x29   ; socket syscall number
    mov rdi, 2  ; AF_INET for IPV4 addresses
    mov rsi, 1  ; SOCK_STREAM for connection
    mov rdx, 0  ; default TCP protocol
    syscall

    mov rax, 0x3c   ; exit syscall
    mov rdi, 0  ; status code
    syscall
```
