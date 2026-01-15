
## Forming Executable

After you form your assembly code use the below commands to create binary file or executable of the assembly code. Your assembly code file name might be different so change the name. Its better you create a `.sh` or shell script and run it after finishing your code instead of manually typing it every time.

```bash
$ nasm -f elf64 assembly.s -o assembly # forming object code file using nasm
$ ld -f assembly.o -o assembly # creating executable using linker
```

## Running Challenge

After forming the executable we need to use the executable as command line argument for the `/challenge/run` file. This will give us our `pwn.college{FLAG}` if our assembly code is correct.

```bash
$ /challenge/run assembly
pwn.college{xxxxxFLAGxxxxX}
```

## set-register

In this challenge we need to set  `rdi = 0x1337` . We also need to compile the assembly code and create an executable from it using `nasm` and `ld` command.

```nasm
mov rdi, 0x1337
```

## set-multiple-registers

In this level, we need to work with multiple registers. We need to set the following:-
- `rax = 0x1337`
- `r12 = 0xCAFED00D1337BEEF`
- `rsp = 0x31337`

```nasm
mov rax, 0x1337
mov r12, 0xCAFED00D1337BEEF
mov rsp, 0x31337
```

## add-to-register

In this challenge we need to add `0x331337` to `rdi` register

```nasm
add rdi, 0x331337
```

## linear-equation-registers

In this challenge we need to computer the expression `f(x) = mx + b` where :-

- `m = rdi`
- `x = rsi`
- `b = rdx`

We need to place the result in `rax` register and also we need to use `imul` instead `mul`. `imul` for signed multiplication and `mul` for unsigned multiplication.

```nasm
imul rdi, rsi
add rdi, rdx
mov rax, rdi
```

## integer-division

In this challenge we need to compute `speed = distance/time` where :-
- `distance = rdi`
- `time = rsi`
- `speed = rax`
We need to use the `div` instruction for performing division. Make sure to set `rdx = 0` because during division the numerator becomes `rax + rdx` (concatenates and forms numerator). The quotient in the below code will be stored in `rax` register.

```nasm
mov rdx, 0
mov rax, rdi
div rsi
```

## modulo-operation

In this challenge we need to perform the modulo operation(`%`) which basically gives us the remainder when division is performed. We need to compute `rdi % rsi` and place the value in `rax` register. The remainder will stored in `rdx` register after division.

```nasm
mov rdx, 0
mov rax, rdi
div rsi
mov rax, rdx
```

