# 第七章	基于MIPS的Shellcode开发

软中断：和硬中断不同在于它是通过软件指令触发而非外设引发的中断，是编程人员开发出来的一种异常，具体来说就是调用`int 0x80`，除了调用`int 0x80`外，还可以使用syscall指令进行系统调用

syscall的调用方式为：“在使用系统调用syscall之前，$v0保存需要执行的系统调用的调用号

如exit(code)的例子：

```
```
