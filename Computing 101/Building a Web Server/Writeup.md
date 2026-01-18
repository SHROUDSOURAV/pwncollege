
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

## Bind

We created a `socket` previously for communication in the network and we need the `bind` to assign the `socket` to a specific IP address and port. In this challenge we need to create the `bind` syscall. We need to the following arguments for making the `bind` syscall :-

- **socket file descriptor** -> value returned in `rax` by the `socket` syscall in our previous `socket` creation.
- **a pointer to a `struct sockaddr` (specifically a `struct sockaddr_in` for IPv4 that holds fields like the address family, port, and IP address)** -> we must create the below structure in memory.

```
struct sockaddr sturcure below
	struct sockaddr_in {
    sa_family_t    sin_family;   // 2 bytes //AF_INET
    in_port_t      sin_port;     // 2 bytes //PORT NUMBER 80
    struct in_addr sin_addr;     // 4 bytes //IPv4 0.0.0.0 all networkinterfaces
};
```

- **size of that structure** -> the size of the `struct sockaddr`

```nasm
global _start

section .text

_start:
    

socket_syscall:    
    mov rax, 0x29   ; socket syscall number
    mov rdi, 2  ; AF_INET for IPV4 addresses
    mov rsi, 1  ; SOCK_STREAM for connection
    mov rdx, 0  ; default TCP protocol
    syscall

; struct sockaddr sturcure below
;    struct sockaddr_in {
;        sa_family_t    sin_family;   // 2 bytes // AF_INET
;        in_port_t      sin_port;     // 2 bytes // PORT NUMBER 80
;        struct in_addr sin_addr;     // 4 bytes // IPv4 -> 0.0.0.0 for all network interfaces
;    };


bind_syscall:
    mov rdi, rax    ; socket file descriptor returned by socket syscall (arg1)
    sub rsp, 0x10   ; reserving 16 bytes of memory
    mov word[rsp], 2    ; sin_family AF_INET
    mov word[rsp+2], 0x5000 ; Little Endian for 0x80 or port 80 sin_port
    mov dword[rsp+4], 0x0   ; sin_addr 0.0.0.0 equivalent and dword cuz IPv4 32 bits/4 bytes
    add qword[rsp+8], 0x0   ; balancing stack alignment so +16 and -16 bytes done
    lea rsi, [rsp]    ; pointer to struct_addr (arg2)
    mov rdx, 0x10   ; 16 bytes address length cuz struct_addr is 16 bytes (2+2+4+8)
    mov rax, 0x31   ; bind syscall number
    syscall


exit_syscall:
    mov rax, 0x3c   ; exit syscall
    mov rdi, 0  ; status code
    syscall
```

## Listen

We have created a `socket` and bounded it to an IP address and port using our own `bind`. In this challenge we need to prepare our socket to accept incoming connections. This introduces us to `listen` syscall which we need to create in this level. The `listen` syscall requires the following arguments. They are:-

- 