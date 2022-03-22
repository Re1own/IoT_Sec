## afl-gcc.c

### main函数

main的核心就两个函数，find_as和edit_params，从他们的名字可以大致推断find_as应该是用来找as文件或者目录的，edit_params应该是用来修改gcc的参数，加上一些宏定义啥的，在原有的基础上添加一些参数设置。最后通过execvp来执行前面编辑好（加了额外afl所需要的参数）的gcc命令

```c
int main(int argc, char** argv) {

  if (isatty(2) && !getenv("AFL_QUIET")) {

    SAYF(cCYA "afl-cc " cBRI VERSION cRST " by <lcamtuf@google.com>\n");

  } else be_quiet = 1;

  if (argc < 2) {

    SAYF("\n"
         "This is a helper application for afl-fuzz. It serves as a drop-in replacement\n"
         "for gcc or clang, letting you recompile third-party code with the required\n"
         "runtime instrumentation. A common use pattern would be one of the following:\n\n"

         "  CC=%s/afl-gcc ./configure\n"
         "  CXX=%s/afl-g++ ./configure\n\n"

         "You can specify custom next-stage toolchain via AFL_CC, AFL_CXX, and AFL_AS.\n"
         "Setting AFL_HARDEN enables hardening optimizations in the compiled code.\n\n",
         BIN_PATH, BIN_PATH);

    exit(1);

  }

  find_as(argv[0]);

  edit_params(argc, argv);

  execvp(cc_params[0], (char**)cc_params);

  FATAL("Oops, failed to execute '%s' - check your PATH", cc_params[0]);

  return 0;

}
```

### find_as

find_as首先会传入afl-gcc的路径，然后通过getenv函数看是否存在AFL_PATH路径，如果存在则看afl_path/as路径是否可以访问，可以访问这个函数就直接返回了。如果之前getenv判断不存在AFL_PATH，则afl_path为null

![image-20220320213615018](https://s2.loli.net/2022/03/20/5I6LwasZz2elvE1.png)

slash为afl_gcc的路径，通过strrchr取出/afl-gcc，dir根据slash知道了afl-gcc所在的目录从而判断出afl-as的目录，它猜测跟afl-gcc是同一个目录，所以之后加上了afl-gcc的父目录，这样来定位afl-as所在的路径，定位了afl-as的路径后赋值给tmp

![image-20220320214737631](https://s2.loli.net/2022/03/20/NxSoEyFPdu4skjv.png)

再判断tmp（也就是afl-as）是否可以访问，可以访问**find_as**此函数就结束了

![image-20220320215513179](https://s2.loli.net/2022/03/20/G2qWZ7Cu4o9INmX.png)



### edit_params

首先为cc_params分配argc*8字节的内存空间，再看argv[0]是否包含'/'，反正就是取出/之后的字符串，再看是不是afl-clang或者afl-clang++，如果两个都不是判断是不是afl_g++还是afl_gcc

![image-20220320220834677](https://s2.loli.net/2022/03/20/d3X4a6KeJrHZjV2.png)

这里是afl_gcc，最后取环境变量AFL_CC的值，如果存在就把cc_params[0]设置为该值，如果不存在就设置为gcc

![image-20220320221912533](https://s2.loli.net/2022/03/20/d2KNlPbq1z7X93T.png)

之后从argv[1]遍历argv参数，遇到-B、-integrated-as、-pipe参数就跳过，遇到-fsanitize=address或者-fsanitize=memory就设置aasan_set 为 1，遇到字符串包含了FORTIFY_SOURCE就把fortify_set参数设为1

![image-20220320225556935](https://s2.loli.net/2022/03/20/1SwEfPvzMBlKRVj.png)

取出之前计算出来的as_path的路径，然后参数相当于-B as_path，这里as_path = 目录/AFL，再判断clang_mode和AFL_HARDEN是否开启，如果有就再加上对应的参数,-no-integrated-as、-fstack-protector-all

![image-20220320230414127](https://s2.loli.net/2022/03/20/5nrKCwslbEaUJ1T.png)

再判断asan_set，开启的话就让AFL_USE_ASAN设置为1，如果存在AFL_USE_NASN，就添加参数-U_FORTIFY_SOURCE、-fsanitize=address，但是这两句语句执行之前说明了AFL_USE_ASAN和AFL_USE_MASN只能选一个，不能同时。区别在于前者-fsanitize=address，后者AFL_USE_MASN的-fsanitize=memory

![image-20220320230937239](https://s2.loli.net/2022/03/20/UlSCgnFqKMPDt3p.png)

如果AFL_DONT_OPTIMIZE环境变量为空，则添加参数-g -O3 -funroll-loops -D__AFL_COMPILER=1 -DFUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION=1

![image-20220320232250996](https://s2.loli.net/2022/03/20/sTMOfrLUWSqy3uQ.png)

如果存在AFL_NO_BUILTIN环境变量，则添加-fno-builtin-strcmp、-fno-builtin-strncmp、-fno-builtin-strcasecmp、-fno-builtin-strncasecmp、-fno-builtin-memcmp、-fno-builtin-strstr、-fno-builtin-strcasestr参数，最后cc_params的结尾为空，结束参数的编辑

![image-20220320232501229](https://s2.loli.net/2022/03/20/vZ58twK6HNOj21V.png)



## afl-as.c

### add_instrumentation（插桩关键代码）

inf为要插桩程序汇编内容，while循环里按行读取text段设置instr_ok为1，说明现在开始是可插桩的，但是未必每行都需要插桩，比如遇到jmp，直接对此位置插桩一个随机数，遇到LBB或者L+数字的代表一个代码块，或者直接一个函数，于是将instrument_next设为1，跳到while循环下将此时的代码块插入一个随机数再将instrument_next设为0说明这段插完了不需要再插桩了。

```
while (fgets(line, MAX_LINE, inf)) {
    if(instr_ok && instrument_next && line[0] == '\t' && isalpha(line[1])){
        fprintf(outf, use_64bit ? trampoline_fmt_64 : trampoline_fmt_32,
                    R(MAP_SIZE));

        instrument_next = 0;
        ins_lines++;
    }
    ...
    if (line[0] == '\t' && line[1] == '.') {
        if (!strncmp(line + 2, "text\n", 5) ||
            !strncmp(line + 2, "section\t.text", 13) ||
            !strncmp(line + 2, "section\t__TEXT,__text", 21) ||
            !strncmp(line + 2, "section __TEXT,__text", 21)) {
            instr_ok = 1;
            continue;
        }

        if (!strncmp(line + 2, "section\t", 8) ||
            !strncmp(line + 2, "section ", 8) ||
            !strncmp(line + 2, "bss\n", 4) ||
            !strncmp(line + 2, "data\n", 5)) {
            instr_ok = 0;
            continue;
        }
    }
    ...
    if (line[0] == '\t') {
            if (line[1] == 'j' && line[2] != 'm' && R(100) < inst_ratio) {
                fprintf(outf, use_64bit ? trampoline_fmt_64 : trampoline_fmt_32,
                        R(MAP_SIZE));

                ins_lines++;
            }
            continue;

        }
    ...
    if (strstr(line, ":")) {
        if (line[0] == '.') {
            if ((isdigit(line[2]) || (clang_mode && !strncmp(line + 1, "LBB", 3)))
                        && R(100) < inst_ratio) {
                            instrument_next = 1;
                        }
        }
        else {
            /* Function label (always instrumented, deferred mode). */
            instrument_next = 1;
        }
    }
}
```

汇编示例：

```asm
main:
.LFB2:
	.cfi_startproc
	endbr64
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register 6
	subq	$32, %rsp
	movl	%edi, -20(%rbp)
	movq	%rsi, -32(%rbp)
	movq	%fs:40, %rax
	movq	%rax, -8(%rbp)
	xorl	%eax, %eax
	leaq	.LC2(%rip), %rax
	movq	%rax, %rdi
	call	puts@PLT
	leaq	-12(%rbp), %rax
	movq	%rax, %rsi
	leaq	.LC3(%rip), %rax
	movq	%rax, %rdi
	movl	$0, %eax
	call	__isoc99_scanf@PLT
	movl	-12(%rbp), %eax
	cmpl	$1, %eax
	jne	.L4
	call	f1
	jmp	.L5
.L4:
	movl	-12(%rbp), %eax
	cmpl	$2, %eax
	jne	.L6
	call	f2
	jmp	.L5
.L6:
	leaq	.LC4(%rip), %rax
	movq	%rax, %rdi
	call	puts@PLT
.L5:
	movl	$0, %eax
	movq	-8(%rbp), %rdx
	subq	%fs:40, %rdx
	je	.L8
	call	__stack_chk_fail@PLT
.L8:
	leave
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
```



