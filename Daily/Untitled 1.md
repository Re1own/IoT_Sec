花式栈溢出











ret2libc

https://blog.csdn.net/counsellor/article/details/81986052

https://mzgao.blog.csdn.net/article/details/104335514?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link



libc基地址  +  函数偏移量   =  函数真实地址

libc的延迟绑定技术，这个技术大概就是当第一次调用一个函数的时候，这个函数的got表里存放着是下一条plt表的指令的地址，然后再经过一系列的操作(这里不详解got表和plt表的关系了，太复杂了。)得到了这个函数的真实地址，然后呢，再把这个函数的真实地址放到了got表里。当第二次调用这个函数的时候，就可以直接从Got表里取函数的真实地址，不用再去寻找了。




ROPgadget --binary stack5 --only "pop|ret" | grep rdi



查找__libc_start_main函数在got表中的地址

```sh
┌──(root💀06aa46c0844f)-[/home/stack5]
└─#  objdump -R stack5

stack5:     file format elf64-x86-64

DYNAMIC RELOCATION RECORDS
OFFSET           TYPE              VALUE 
0000000000600ff0 R_X86_64_GLOB_DAT  __libc_start_main@GLIBC_2.2.5
0000000000600ff8 R_X86_64_GLOB_DAT  __gmon_start__
0000000000601060 R_X86_64_COPY     stdout@@GLIBC_2.2.5
0000000000601070 R_X86_64_COPY     stdin@@GLIBC_2.2.5
0000000000601080 R_X86_64_COPY     stderr@@GLIBC_2.2.5
0000000000601018 R_X86_64_JUMP_SLOT  puts@GLIBC_2.2.5
0000000000601020 R_X86_64_JUMP_SLOT  setbuf@GLIBC_2.2.5
0000000000601028 R_X86_64_JUMP_SLOT  printf@GLIBC_2.2.5
0000000000601030 R_X86_64_JUMP_SLOT  read@GLIBC_2.2.5
0000000000601038 R_X86_64_JUMP_SLOT  memcpy@GLIBC_2.14
```





# ret2libc





对于只给出了libc.so文件的程序，我们可以直接在libc.so文件当中去找system()函数和"/bin/sh"字符串，因为libc.so文件中也是包含了这些的；最后对于没有给出libc.so文件的程序，我们可以通过泄露出程序当中的某个函数的地址，通过查询来找出其使用lib.so版本是哪一个




```sh
┌──(root💀06aa46c0844f)-[/home/stack5]
└─# checksec stack5
[*] '/home/stack5/stack5'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```







原文链接：https://blog.csdn.net/AcSuccess/article/details/104335514
