$dest = "chrome-app\_build\"
function copy-game 
{
    rm -Recurse -Force $dest
    mkdir $dest
    xcopy .\Hack24\Content .\$dest\Content\ /E /Y
    Write-Output "Copying game files..."
}

function copy-chrome-app
{
    Write-Output "Copying Chrome App"
    xcopy .\chrome-app\src .\$dest /E /Y
}

copy-game
copy-chrome-app


