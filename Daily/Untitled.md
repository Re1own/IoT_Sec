花式栈溢出

https://blog.csdn.net/AcSuccess/article/details/104372496

ret2libc

https://mzgao.blog.csdn.net/article/details/104335514



PWN stack4-pivoting

https://www.cnblogs.com/wulitaotao/p/13909467.html



mov esp,ebp 
pop ebp 
retn
或者是 
leave
retn



没有开NX，可以向栈上写入shellcode。

防护措施只开了一个Partial RELRO，这意味着每次栈加载的地址会变化。



Leave等价于：

movl %ebp %esp

popl %ebp	





retn：

pop eip
add esp, nh







ebp位置

pop是把esp指向的内容弹出来后把esp+4

push是先把esp-4，再放到esp指向的位置中

栈是单独的一个空间

![image-20211125150320249](https://tva1.sinaimg.cn/large/008i3skNly1gwreqo2fsij313f0u077p.jpg)

