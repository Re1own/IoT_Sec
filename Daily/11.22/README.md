<<<<<<< HEAD
<<<<<<< HEAD
# Dahua固件模拟

根据输出信息Main,logPtr invalid

![image-20211122141256323](https://i.loli.net/2021/11/22/dkGuPyzlJDaVMW8.png)

往后依次下断点发现到了0x3BD48处出错，直接NOP掉BL.W sub_7E3960

![image-20211122141521162](https://i.loli.net/2021/11/22/jgPcULZ514mr7iB.png)





# VxWorks路由器破解：

## VxWorks介绍：

任务调度：

* 嵌入式设备的实时操作系统，以task为单位进行运算调度
* 某个task崩溃会或异常会导致整个系统崩溃

内存与权限管理：

* 没有内存管理（MMU）
* 没有虚拟内存
* 所有任务运行在实模式，可以执行特权指令

代码生成：

* 业务逻辑不单独编译，与内核代码一同编译生成单个二进制文件
* 所有操作系统功能直接使用函数调用方式



固件从官网下就行：[TL-WDR7660千兆易展版 V1.0升级软件20211103_3.0.4 - TP-LINK 服务支持](https://service.tp-link.com.cn/detail_download_9380.html)

![image-20211122144354913](https://i.loli.net/2021/11/22/WYHSCdl6zviFmfI.png)

binwalk --term查看

uImage header（binwalk没法提取，需要手动提取）：用来保存固件，储存bootloader

![image-20211122144634814](https://i.loli.net/2021/11/22/7uDHdLcEwTe9lOx.png)



jr $ra

li $v0, 2





=======
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
# Dahua固件模拟

根据输出信息Main,logPtr invalid

![image-20211122141256323](https://i.loli.net/2021/11/22/dkGuPyzlJDaVMW8.png)

往后依次下断点发现到了0x3BD48处出错，直接NOP掉BL.W sub_7E3960

![image-20211122141521162](https://i.loli.net/2021/11/22/jgPcULZ514mr7iB.png)





# VxWorks路由器破解：

## VxWorks介绍：

任务调度：

* 嵌入式设备的实时操作系统，以task为单位进行运算调度
* 某个task崩溃会或异常会导致整个系统崩溃

内存与权限管理：

* 没有内存管理（MMU）
* 没有虚拟内存
* 所有任务运行在实模式，可以执行特权指令

代码生成：

* 业务逻辑不单独编译，与内核代码一同编译生成单个二进制文件
* 所有操作系统功能直接使用函数调用方式



固件从官网下就行：[TL-WDR7660千兆易展版 V1.0升级软件20211103_3.0.4 - TP-LINK 服务支持](https://service.tp-link.com.cn/detail_download_9380.html)

![image-20211122144354913](https://i.loli.net/2021/11/22/WYHSCdl6zviFmfI.png)

binwalk --term查看

uImage header（binwalk没法提取，需要手动提取）：用来保存固件，储存bootloader

![image-20211122144634814](https://i.loli.net/2021/11/22/7uDHdLcEwTe9lOx.png)



jr $ra

li $v0, 2





<<<<<<< HEAD
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
参考：[揭秘VxWorks路由器破解之路_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1D3411b7XY)