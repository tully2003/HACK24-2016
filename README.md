# HACK24-2016
For use during HACK24 2016

# Packed24
To get this working requires a little trickery.

1. Run the vs solution (ctrl + f5) this will get the server running on localhost
2. from the command line navigate to the root of the repository and run the `build` command
3. then navigate to the `chrome-app` directory and run the `go` command.
	* If `go` breaks then you will need to update `go.bat` to use the location where your local repository is stored.
4. this app will then load - hit the play game button and it should open up across monitors (note: one screen might go black, click it with the mouse and you should be in business)  