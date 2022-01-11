可能利用的危险函数：

​    格式化字符串、命令注入：参数来源于外部输入(包括文件内容、nvram、环境变量等)

​    密码学函数误用：密码学函数使用错误导致加密不可靠



Demo

命令注入

```
void CWE78_OS_Command_Injection__char_connect_socket_system_34_bad()
{
    char * data;
    CWE78_OS_Command_Injection__char_connect_socket_system_34_unionType myUnion;
    char data_buf[100] = FULL_COMMAND;
    data = data_buf;
    {
#ifdef _WIN32
        WSADATA wsaData;
        int wsaDataInit = 0;
#endif
        int recvResult;
        struct sockaddr_in service;
        char *replace;
        SOCKET connectSocket = INVALID_SOCKET;
        size_t dataLen = strlen(data);
        do
        {
#ifdef _WIN32
            if (WSAStartup(MAKEWORD(2,2), &wsaData) != NO_ERROR)
            {
                break;
            }
            wsaDataInit = 1;
#endif
            /* POTENTIAL FLAW: Read data using a connect socket */
            connectSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
            if (connectSocket == INVALID_SOCKET)
            {
                break;
            }
            memset(&service, 0, sizeof(service));
            service.sin_family = AF_INET;
            service.sin_addr.s_addr = inet_addr(IP_ADDRESS);
            service.sin_port = htons(TCP_PORT);
            if (connect(connectSocket, (struct sockaddr*)&service, sizeof(service)) == SOCKET_ERROR)
            {
                break;
            }
            /* Abort on error or the connection was closed, make sure to recv one
             * less char than is in the recv_buf in order to append a terminator */
            /* Abort on error or the connection was closed */
            recvResult = recv(connectSocket, (char *)(data + dataLen), sizeof(char) * (100 - dataLen - 1), 0);
            if (recvResult == SOCKET_ERROR || recvResult == 0)
            {
                break;
            }
            /* Append null terminator */
            data[dataLen + recvResult / sizeof(char)] = '\0';
            /* Eliminate CRLF */
            replace = strchr(data, '\r');
            if (replace)
            {
                *replace = '\0';
            }
            replace = strchr(data, '\n');
            if (replace)
            {
                *replace = '\0';
            }
        }
        while (0);
        if (connectSocket != INVALID_SOCKET)
        {
            CLOSE_SOCKET(connectSocket);
        }
#ifdef _WIN32
        if (wsaDataInit)
        {
            WSACleanup();
        }
#endif
    }
    myUnion.unionFirst = data;
    {
        char * data = myUnion.unionSecond;
        /* POTENTIAL FLAW: Execute command in data possibly leading to command injection */
        if (SYSTEM(data) != 0)
        {
            printLine("command execution failed!");
            exit(1);
        }
    }
}
```

格式化字符串

```
void CWE134_Uncontrolled_Format_String__char_file_snprintf_01_bad()
{
    char * data;
    char dataBuffer[100] = "";
    data = dataBuffer;
    {
        /* Read input from a file */
        size_t dataLen = strlen(data);
        FILE * pFile;
        /* if there is room in data, attempt to read the input from a file */
        if (100-dataLen > 1)
        {
            pFile = fopen(FILENAME, "r");
            if (pFile != NULL)
            {
                /* POTENTIAL FLAW: Read data from a file */
                if (fgets(data+dataLen, (int)(100-dataLen), pFile) == NULL)
                {
                    printLine("fgets() failed");
                    /* Restore NUL terminator if fgets fails */
                    data[dataLen] = '\0';
                }
                fclose(pFile);
            }
        }
    }
    {
        char dest[100] = "";
        /* POTENTIAL FLAW: Do not specify the format allowing a possible format string vulnerability */
        SNPRINTF(dest, 100-1, data);
        printLine(dest);
    }
}
```

密码学误用

```
int __fastcall aes_cbc_wrapper(const char *a1, int a2, int a3, int a4, int a5)
{
  char v11[244]; // [sp+18h] [bp-FCh] BYREF
  size_t v12; // [sp+10Ch] [bp-8h]

  v12 = strlen(a1);
  if ( a3 == 1 )
  {
    if ( !AES_set_encrypt_key(a4, 128, v11) )
    {
LABEL_8:
      AES_cbc_encrypt(a1, a2, v12, v11, a5, a3);
      return 0;
    }
LABEL_3:
    puts("Set Encrypt Key Error");
    goto LABEL_8;
  }
  if ( !a3 )
  {
    if ( !AES_set_decrypt_key(a4, 128, v11) )
      goto LABEL_8;
    goto LABEL_3;
  }
  return 1;
}

int __cdecl main(int argc, const char **argv, const char **envp)
{
  char v5[128]; // [sp+Ch] [bp-228h] BYREF
  char dest[128]; // [sp+8Ch] [bp-1A8h] BYREF
  char v7[128]; // [sp+10Ch] [bp-128h] BYREF
  char v8[128]; // [sp+18Ch] [bp-A8h] BYREF
  char v9[16]; // [sp+20Ch] [bp-28h] BYREF
  char src[16]; // [sp+21Ch] [bp-18h] BYREF

  if ( !RAND_status(argc, argv, envp) )
    return 1;
  strcpy(src, "ConstantIV01234");
  RAND_bytes(v9, 16);
  strcpy(v8, "t3st_hell0_w0rld_asdf");
  printf("plaintext: \"%s\"\n", v8);
  memcpy(dest, src, sizeof(dest));
  if ( !aes_cbc_wrapper(v8, (int)v7, 1, (int)v9, (int)dest) )
    printf("ciphertext: \"%s\"\n", v7);
  memcpy(dest, src, sizeof(dest));
  if ( !aes_cbc_wrapper(v7, (int)v5, 0, (int)v9, (int)dest) )
    printf("decryptedtext: \"%s\"\n", v5);
  return 0;
}
```

