@echo off
if exist "uploads\*" (
    del /q "uploads\*"
    for /d %%i in ("uploads\*") do rmdir /s /q "%%i"
    echo Cleared all files in uploads folder
) else (
    echo Uploads folder is empty or does not exist
)