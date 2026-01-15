
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

---
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

## set-upper-byte

Using only one move instruction, set the upper 8 bits of `ax` register to `0x42`

```nasm
mov ah, 0x42
```

## efficient-modulo

We need to compute the following :-
- `rax = rdi % 256`
- `rbx = rsi % 65536`

If we have `x % y`, and `y` is a power of 2, such as `2^n`, the result will be the lower `n` bits of `x`.

```nasm
mov al, dil
mov bx, si
```

## byte-extraction

In this challenge we need to perform bitwise shift left and right operations using `shr` and `shl` instructions. We need to set `rax` to the 5th least significant byte of `rdi` register. To calculate the number of shits the formula is :-

- consider the byte you want to extract and subtract minus 1 from it.
- multiply the result with 8 to get the number of shits you require.

```nasm
shr rdi, 32
mov al, dil
```

## bitwise-and

Set `rax` to the value of `(rdi AND rsi)`. `rax` will have all bits set to `1`

```nasm
and rdi, rsi
and rax, rdi
```

## check-even

Using `and` `or` `xor` we need to implement the below logic where `x = rdi` and `y = rax` 

```
if x is even then
  y = 1
else
  y = 0
```

So to check whether `rdi` or **x** is even or not we need to check the last bit is `0` or `1`. If `0` then **even** else **odd**.

- `and` operation checks whether `rdi` is even or odd.
- `xor` operation makes `rax` value `0`.
- `xor` operation makes `rdi` last bit value flip.
- `or` operation copies flipped value of `rdi` last bit to `rax`.

```nasm
and rdi, 1  
xor rax, rax  
xor rdi, 1  
or rax, rdi
```

## memory-read

We need to dereference the address `0x404000` i.e. get the value stored at the address and copy it to `rax` register.

```nasm
mov rax, [0x404000]
```

## memory-write

This time the opposite of the previous challenge. We need to dereference a memory itself and store a value there which is present in `rax` register.

```nasm
mov [0x404000], rax
```

## memory-increment

- we need to place the value stored at `0x404000` into `rax`.
- After that we need to increment the value stored at the address `0x404000` by `0x1337`.

Without a size specifier(`word, dword, qword`), the assembler will not know how many bytes of memory we want to modify or add in this case.

```nasm
mov rax, [0x404000]
add word [0x404000], 0x1337
```

## byte-access

In this challenge we need to set `rax` to the byte of `0x404000`.

```nasm
mov al, byte [0x404000]
```
