# Playfair Ciphre



1 – We first take the Playfair key from the user and generate the grid


2 – Then we let the user choose encrypt/decrypt


3 – The user then enters either The Cipher text or The Plain Text

4 – We Then run the algorithms and produce the output 

The Algorithms:
Initial Setup:
1 - We start by setting up the grid of 5x5 using The Playfair Key
	
 

Encrypt:


1 - We start by remove spaces from the plain text. 


2 - We split it into even chunks of 2, if it’s an odd number we insert a place holder character “x” is the default choice, we also insert x if there’s a double letter. e.g., “hello” -> “he lx lo” 

3 – We iterate over the 2 letter combinations. And find where their both row number and column number on the grid (through iteration) 


4 – Then we check for 3 conditions 


•	The two letters have the same row number.


•	The two letters have the same column number.


•	They have different row and column numbers.


We then apply the Playfair cipher by increasing the column number by 1 for both letters if they have the same row, increase the row number if they have the same column, or if they are different we swap the column numbers between them
 


Decrypt:


1 – It follows the same steps as Encrypt until increasing and decreasing part
We apply Decrypt Playfair cipher by decreasing the column number by 1 for both letters if they have the same row, decrease the row number if they have the same column, or if they are different we swap the column numbers between them
